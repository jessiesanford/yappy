import * as _ from "lodash";
import { NodeType, Schema } from "prosemirror-model";
import { EditorState, NodeSelection, TextSelection, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
// import { redo, undo } from "../plugins/gem/undo-plugin";
import { BaseKeymap, DefaultModifiers, KBCmd, KeyStroke, Modifier } from "./baseKeymap";
import { BaseIterator, EditorDepth } from "../resolver/baseIterator";
import { generateId } from '../../../util/';
import { safeDeleteSelection } from '../../../util/';


const browser = { windows: 'windows', mac: false };

export class GameKeymap extends BaseKeymap {
  constructor(schema: Schema) {
    super(schema);
    this.rebind_(KBCmd.Create(KeyStroke.Z, handleUndo, Modifier.MOD));
    this.rebind_(KBCmd.Create(KeyStroke.Z, handleRedo, [Modifier.SHIFT, Modifier.MOD]));
    this.rebind_(KBCmd.Create(KeyStroke.ENTER, onGameEditorShiftEnterKeyPress, Modifier.MOD));
    this.rebind_(KBCmd.Create(KeyStroke.ENTER, onGameEditorShiftEnterKeyPress, Modifier.SHIFT));
    if (browser.mac) {
      this.rebind_(KBCmd.Create(KeyStroke.ENTER, onGameEditorShiftEnterKeyPress, Modifier.CONTROL));
    } else {
    }
    this.bind_(KBCmd.Create(KeyStroke.ENTER, onGameEditorEnterKeyPress));
    this.bind_(KBCmd.Create(KeyStroke.BACKSPACE, onGameEditorBackspaceKeyPress));
    this.bind_(KBCmd.Create(KeyStroke.BACKSPACE, onGameEditorBackspaceKeyPress, [Modifier.SHIFT])); //same behavior as backspace
    this.bind_(KBCmd.Create(KeyStroke.TAB, onGameEditorTabKeyPress));
    this.bind_(KBCmd.Create(KeyStroke.TAB, onGameEditorShiftTabKeyPress, Modifier.SHIFT));

  }

}

export const changeScriptElement = (state: EditorState, dispatch: EditorView['dispatch'], type: NodeType) => {
  const tr = state.tr;
  const selection = tr.selection;
  const {$from, $to} = selection;
  if ($from.depth === 3) {
    if (selection.empty) {
      tr.setNodeMarkup(
        $from.before(), type, _.merge(_.cloneDeep({}), {id: $from.node().attrs['id'] || generateId()})
      );
    } else {
      //TODO: I don't think Jon finished this?
    }
    if (dispatch) {
      dispatch(tr);
      return true;
    } else {
      return tr;
    }
  }
  return true;
};

/**
 * Wrapper function for undo
 * Also checks the selection isn't broken
 * @param {EditorState} state
 * @param {function} dispatch
 * @param {EditorView} view
 * @returns
 */
function handleUndo(state: EditorState, dispatch: EditorView['dispatch'], view: EditorView) {
  // undo(state);
  handleDepth(state, dispatch, view); // get the selection back into the correct depth
}

/**
 * Wrapper function for redo
 * Also checks the selection isn't broken
 * @param {EditorState} state
 * @param {function} dispatch
 * @param {EditorView} view
 * @returns
 */
function handleRedo(state: EditorState, dispatch: EditorView['dispatch'], view: EditorView) {
  // redo(state);
  handleDepth(state, dispatch, view); // get the selection back into the correct depth
}

/**
 * After undo and redo the selection sometimes gets in the incorrect depth of 2
 * on a cxpage element; this causes enter/delete keystrokes to not work, this places
 * the selection in the correct depth so these keystrokes still work as intended
 *
 * Note this looks at the view state to find out the depth and the current selection
 * after the undo/redo has updated the state, but since this function don't have access to
 * a fresh transaction this looks at the editor state to see where the selection is.
 * @param {EditorState} state
 * @param {function} dispatch
 * @param {EditorView} view
 */
function handleDepth(state: EditorState, dispatch: EditorView['dispatch'], view: EditorView) {
  let tr = state.tr;
  let viewTr = view.state.tr;
  // the selection is at cxpage node if its at depth 2
  if (viewTr.curSelection.$anchor.depth === 2 || viewTr.selection.$anchor.depth === 2) {
    // find a leaf node to put the cursor so enter/delete (and others) function as intended.
    // this also feels illegal and wrong
    tr.deleteSelection();
    let sel = TextSelection.between(viewTr.curSelection.$anchor, viewTr.curSelection.$head);
    viewTr.setSelection(sel);
    dispatch(viewTr);
  }
}

function onGameEditorEnterKeyPress(state: EditorState, dispatch: (tr: Transaction) => void, view: EditorView) {
  return insertNewParagraph(state, dispatch, state.schema.nodes.paragraph);
}

function onGameEditorShiftEnterKeyPress(state: EditorState, dispatch: EditorView['dispatch'], view: EditorView) {
  let anchorNode = state.selection instanceof NodeSelection ? state.selection.node : state.selection.$anchor.node();
  if (!anchorNode.type.spec.isPrimary && anchorNode.type.name !== 'cxinteractive') {
    dispatch(state.tr.replaceSelectionWith(state.schema.nodes.hard_break.create({})).scrollIntoView());
  }
  return true;
};

export function onGameEditorTabKeyPress(state: EditorState, dispatch: EditorView['dispatch'], view: EditorView, isReverse: boolean) {
  const {$anchor, $head} = state.selection;
  const types = state.schema.nodes;
  let type = $anchor.node().type;
  let newType;

  if (!view.props['mouse'].active) {
    type = $head.node().type;
  }

  switch (type) {
    case types['paragraph']:
      newType = !isReverse ? types['character'] : types['dialogue'];
      break;
    case types['character']:
      newType = !isReverse ? types['dialogue'] : types['paragraph'];
      break;
    case types['dialogue']:
      newType = !isReverse ? types['paragraph'] : types['character'];
      break;
    default:
      break;
  }

  return changeScriptElement(state, dispatch, newType);
}

function onGameEditorShiftTabKeyPress(state: EditorState, dispatch: EditorView['dispatch'], view: EditorView) {
  return onGameEditorTabKeyPress(state, dispatch, view, true);
}

function onGameEditorBackspaceKeyPress(state: EditorState, dispatch: EditorView['dispatch'], view: EditorView) {
  const replaceCharacterItem = (tr: Transaction, iter: BaseIterator) => {
    const character = state.schema.nodes.cxcharacter.createAndFill({id: generateId(), catalog_id: generateId()});
    tr.replaceRangeWith(iter.start(), iter.end(), character);
    tr.setSelection(TextSelection.create(tr.doc, iter.start()));
  };

  let selection = state.selection;
  let tr = state.tr.setMeta('editor_delete', true);
  let iter = new BaseIterator(tr, selection.$from);
  if (selection.empty) {
    if (selection.$from.depth >= 3 && selection.$to.depth >= 3) {
      let NODE_START = selection.$from.start(2) === selection.$from.pos - (selection.$from.depth - 2);
      let NODE_END = selection.$from.end(2) === selection.$from.pos + (selection.$from.depth - 2);
      let ELEMENT_START = selection.$from.start() === selection.$from.pos;
      let ELEMENT_END = selection.$from.end() === selection.$from.pos;
      let PREVENT = false;
      if (ELEMENT_START) {
        // let iterClone = new BaseIterator(tr, selection.$from);
        PREVENT = iter.hasPrev(EditorDepth.Element) && iter.prev(EditorDepth.Element);
        switch (PREVENT ? iter.element.type : null) {
          // case CXGVRSchema.Class.Nodes.cxbranch:
          // case CXGVRSchema.Class.Nodes.cxinteractive_branch:
          // case CXGVRSchema.Class.Nodes.cxdualdialog:
          //   PREVENT = true;
          //   break;
          default:
            PREVENT = false;
            break;
        }
      }
      if (PREVENT || NODE_START) {
        return true;
      } else {
        if (ELEMENT_START && ELEMENT_END) {
          tr.join(selection.$from.before());
        } else if (ELEMENT_START) {
          if (iter.type() === state.schema.nodes.cxcharacter_item) {
            let pos = iter.end();
            let selection = TextSelection.create(tr.doc, pos);
            tr.setSelection(selection);
          } else {
            tr.join(selection.$from.before());
          }
        } else if (ELEMENT_END) {
          // special case for character items, need to delete the entire element and replace with a character node
          if (iter.type() === state.schema.nodes.cxcharacter_item) {
            replaceCharacterItem(tr, iter);
          } else {
            tr.deleteRange(selection.$from.pos - 1, selection.$from.pos);
          }
        } else {
          if (iter.type() === state.schema.nodes.cxcharacter_item) {
            replaceCharacterItem(tr, iter);
          }
          tr.deleteRange(selection.$from.pos - 1, selection.$from.pos);
        }
      }
    }
  } else {
    let pos = selection.$from.pos;
    safeDeleteSelection(tr, (data) => {
      switch (data.type(EditorDepth.Element)) {
        case state.schema.nodes.paragraph:
        case state.schema.nodes.character:
          return true;
        default:
          return false;
      }
    });
    tr.setSelection(TextSelection.create(tr.doc, tr.mapping.map(pos)));
    if (!tr.selection.$anchor.node().attrs.id) {
      tr.setNodeMarkup(tr.selection.$anchor.before(), void 0, _.merge(_.cloneDeep(tr.selection.$anchor.node().attrs), {id: generateId()}));
    }
  }

  if (tr.docChanged && dispatch) {
    dispatch(tr);
  }
  return true;
}

function insertNewParagraph(state: EditorState, dispatch: any, nextType: NodeType, opt_forceNewLine = false) {
  const tr = state.tr;
  const anchor = tr.selection.$anchor;
  const selected = anchor.node();
  const type = selected.type;
  const sel = anchor.pos;
  const types = state.schema.nodes;

  if (selected.content.size === 0) {
    // start of empty -- change node to next type
    // tr.setNodeMarkup(anchor.before(), (opt_emptyType || nextType), { id: selected.attrs.id });
  } else if (anchor.pos === anchor.start()) {
    // at the beginning of an element -- insert gameplay element before
    let node = nextType.createAndFill({id: generateId()});
    let pos = tr.selection.$anchor.before();
    tr.insert(pos, node);
    tr.setSelection(TextSelection.create(tr.doc, pos + 1));
  } else if (anchor.pos === anchor.end() || opt_forceNewLine) {
    // at the end of the line -- next type inserted after
    // culprit
    let node = nextType.createAndFill({id: generateId()});
    let pos = tr.selection.$anchor.after();
    tr.insert(pos, node);
    tr.setSelection(TextSelection.create(tr.doc, pos + 1)).scrollIntoView();
    // convert character nodes into character item nodes to reflect catalog link
    // if (type === schema.nodes.character) {
    //   let newCharacterItem = schema.nodes.cxcharacter_item.create(
    //     {
    //       id: selected.attrs.id,
    //       catalog_id: generateId()
    //     },
    //     selected.content.content
    //   );
    //   tr.replaceRangeWith(anchor.before(), anchor.after(), newCharacterItem);
    // }
  } else {
    // in the middle of an element
    tr.split(sel);
    tr.setNodeMarkup(sel + 1, void 0, {id: generateId()});
    tr.removeMark(sel + 1, sel + 1 + tr.doc.nodeAt(sel + 1).nodeSize, type.schema.marks.cxbreakdown);
  }

  tr.scrollIntoView();

  if (dispatch) {
    dispatch(tr);
    // shift the editor down to bottom of scrollable content when new elements are inserted near end of scrollHeight
  }

  return true;
}