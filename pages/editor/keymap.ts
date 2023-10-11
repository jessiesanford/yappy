import { keymap } from 'prosemirror-keymap';
import { EditorState, TextSelection, Transaction } from 'prosemirror-state';
import { KeyNames } from '../../static/constants';
import { undo, redo } from 'y-prosemirror';
import { generateId } from '../../util/baseUtils';
import { NodeSpec, NodeType, Schema } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import * as _ from 'lodash';
import { BaseIterator, EditorDepth } from './resolver/baseIterator';
import { safeDeleteSelection } from '../../util/pmUtils';

export const EditorKeymap = keymap({
  [KeyNames.Enter]: handleEnterKeyPress,
  [KeyNames.Backspace]: handleBackspaceKeyPress,
  [KeyNames.Tab]: handleTabKeyPress.bind(this),
  'Mod-z': undo,
  'Mod-y': redo,
  'Mod-Shift-z': redo,
});

function handleBackspaceKeyPress(state: EditorState, dispatch: any) {
  const replaceCharacterItem = (tr: Transaction, iter: BaseIterator) => {
    const character = state.schema.nodes.cxcharacter.createAndFill({ id: generateId(), catalog_id: generateId() });
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
      tr.setNodeMarkup(tr.selection.$anchor.before(), void 0, _.merge(_.cloneDeep(tr.selection.$anchor.node().attrs), { id: generateId() }));
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
    let node = nextType.createAndFill({ id: generateId() });
    let pos = tr.selection.$anchor.before();
    tr.insert(pos, node);
    tr.setSelection(TextSelection.create(tr.doc, pos + 1));
  } else if (anchor.pos === anchor.end() || opt_forceNewLine) {
    // at the end of the line -- next type inserted after
    // culprit
    let node = nextType.createAndFill({ id: generateId() });
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
    tr.setNodeMarkup(sel + 1, void 0, { id: generateId() });
    tr.removeMark(sel + 1, sel + 1 + tr.doc.nodeAt(sel + 1).nodeSize, type.schema.marks.cxbreakdown);
  }

  tr.scrollIntoView();

  if (dispatch) {
    dispatch(tr);
    // shift the editor down to bottom of scrollable content when new elements are inserted near end of scrollHeight
  }

  return true;
}

function handleEnterKeyPress(state: EditorState, dispatch: any) {
  return insertNewParagraph(state, dispatch, state.schema.nodes.paragraph);
}

export const changeScriptElement = (state: EditorState, dispatch: EditorView['dispatch'], type: NodeType) => {
  const tr = state.tr;
  const selection = tr.selection;
  const { $from, $to } = selection;
  if ($from.depth === 3) {
    if (selection.empty) {
      tr.setNodeMarkup(
        $from.before(), type, _.merge(_.cloneDeep({}), { id: $from.node().attrs['id'] || generateId() })
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

function handleTabKeyPress(state: EditorState, dispatch: any, isReverse: boolean) {
  const { $anchor, $head } = state.selection;
  const type = $anchor.node().type;
  /**
   * @type {Object<string, NodeType>}
   */
  const types = state.schema.nodes;
  let newType;

  switch (type) {
    case types['paragraph']:
      newType = !isReverse ? types['character'] : types['character'];
      break;
    case types['character']:
      newType = !isReverse ? types['paragraph'] : types['paragraph'];
      break;
    case types['cxdialog']:
      newType = !isReverse ? types['cxparenthetical'] : types['cxcharacter'];
      break;
    default:
      break;
  }
  return changeScriptElement(state, dispatch, newType);
}