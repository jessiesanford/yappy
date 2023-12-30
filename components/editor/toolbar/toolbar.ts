import { toggleMark } from 'prosemirror-commands';
import * as history from 'prosemirror-history';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { Mark, MarkType } from 'prosemirror-model';

export function markActive(state: EditorState, type: Mark | MarkType) {
  const {from, $from, to, empty} = state.selection;
  if (empty) {
    return type.isInSet(state.storedMarks || $from.marks());
  } else {
    return state.doc.rangeHasMark(from, to, type);
  }
}

export class Toolbar {
  static toggleBold(editorView: EditorView) {
    const {from, to} = editorView.state.selection;
    return editorView && toggleMark(editorView.state.schema.marks.strong)(editorView.state, editorView.dispatch);
  }

  static isBoldActive(editorView: EditorView) {
    return editorView && !!markActive(editorView.state, editorView.state.schema.marks.strong);
  }

  static toggleItalics(editorView: EditorView) {
    return editorView && toggleMark(editorView.state.schema.marks.em)(editorView.state, editorView.dispatch);
  }

  static isItalicsActive(editorView: EditorView) {
    return editorView && !!markActive(editorView.state, editorView.state.schema.marks.em);
  }

  static toggleUnderline(editorView: EditorView) {
    return editorView && toggleMark(editorView.state.schema.marks.underline)(editorView.state, editorView.dispatch);
  }

  static isUnderlineActive(editorView: EditorView) {
    return editorView && !!markActive(editorView.state, editorView.state.schema.marks.underline);
  }

  static toggleStrikethrough(editorView: EditorView) {
    return editorView && toggleMark(editorView.state.schema.marks.strikethrough)(editorView.state, editorView.dispatch);
  }

  static isStrikethroughActive(editorView: EditorView) {
    return editorView && !!markActive(editorView.state, editorView.state.schema.marks.strikethrough);
  }

  static undoAction(editorView: EditorView) {
    editorView && history.undo(editorView.state, editorView.dispatch);
  }

  static isUndoDisabled(editorView: EditorView) {
    return !editorView || !history.undo(editorView.state);
  }

  static redoAction(editorView: EditorView) {
    editorView && history.redo(editorView.state, editorView.dispatch);
  }
}


export const ToolbarButtons = {
  UNDO: 'editUndo',
  UNDO_SECONDARY: 'editUndoSecondary',
  REDO: 'editRedo',
  REDO_SECONDARY: 'editRedoSecondary',
  FIND_REPLACE: 'editFindReplace',
  UNDERLINE: 'formatUnderline',
  UNDERLINE_SECONDARY: 'formatUnderlineSecondary',
  STRIKETHROUGH: 'formatStrikethrough',
  STRIKETHROUGH_SECONDARY: 'formatStrikethroughSecondary',
  BOLD: 'formatBold',
  BOLD_SECONDARY: 'formatBoldSecondary',
  ITALICS: 'formatItalics',
  ITALICS_SECONDARY: 'formatItalicsSecondary',
};

