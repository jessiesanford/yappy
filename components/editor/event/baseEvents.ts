import { EditorView } from 'prosemirror-view';

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
  mousedown(view, event) {
    _.merge(view._props, {mouse: {active: true}});
    let toEl = event.target;
    if (toEl.classList.contains('ProseMirror')) {
      // need to stop clicks from making the cursor go offscreen... this can happen on
      // both the outside document class and page.
      event.stopPropagation();
      event.preventDefault();
      return true;
    }
    // const autocomplete = view.props['cxScriptEditor'].getAutoCompletePlugin();
    // autocomplete && autocomplete.resetComponent();
    return false;
  },
  /**
   *
   * @param {EditorView} view
   * @param {KeyboardEvent} event
   * @return {boolean}
   */
  mouseup(view, event) {
    _.merge(view._props, {mouse: {active: false}});
    return false;
  },
  // cut: handleCutCopy,
  // copy: handleCutCopy,

  input(view, event) {
    if (view.props.isReadOnly) {
      event.stopPropagation();
      event.preventDefault();
      return true;
    }
    return false;
  },

  textInput(view, event) {
    if (view.props.isReadOnly) {
      event.stopPropagation();
      event.preventDefault();
      return true;
    }
    return false;
  },
};