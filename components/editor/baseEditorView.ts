import { DirectEditorProps, EditorView } from 'prosemirror-view';

// use this class to add more utility to the PM Editor View
export class BaseEditorView extends EditorView {
  readOnly: boolean;

  constructor(mount: Element, state: DirectEditorProps) {
    super(mount, state);
    this.readOnly = false;
  }

  isReadOnly() {
    return this.readOnly;
  }


}