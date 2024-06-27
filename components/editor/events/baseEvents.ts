import { EditorView } from 'prosemirror-view';
import _ from 'lodash';
import { BaseEditorView } from "../baseEditorView";

export const handleDOMEvents = {
  /**
   *
   * @param {EditorView} view
   * @param {KeyboardEvent} event
   * @return {boolean}
   */
  keydown(view: EditorView, event: Event) {
    // handle readonly here in the future.
    return false;
  },
  /**
   *
   * @param {EditorView} view
   * @param {KeyboardEvent} event
   * @return {boolean}
   */
  mousedown(view: EditorView, event: Event) {
    _.merge(view._props, {mouse: {active: true}});
    const toEl = event.target as Element;
    if (toEl.classList.contains('ProseMirror')) {
      // need to stop clicks from making the cursor go offscreen... this can happen on
      // both the outside document class and page.
      event.stopPropagation();
      event.preventDefault();
      return true;
    }
    // autocomplete && autocomplete.resetComponent();
    return false;
  },
  /**
   *
   * @param {EditorView} view
   * @param {KeyboardEvent} event
   * @return {boolean}
   */
  mouseup(view: EditorView, event: Event) {
    _.merge(view._props, {mouse: {active: false}});
    return false;
  },


  // cut: handleCutCopy,
  // copy: handleCutCopy,

  input(view: EditorView, event: Event) {
    if (view.props.isReadOnly) {
      event.stopPropagation();
      event.preventDefault();
      return true;
    }
    return false;
  },

  textInput(view: BaseEditorView, event: Event) {
    if (view.props.isReadOnly) {
      event.stopPropagation();
      event.preventDefault();
      return true;
    }
    return false;
  },
};