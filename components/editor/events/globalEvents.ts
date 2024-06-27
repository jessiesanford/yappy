import {EventTypes} from '../../../static';
import { ToolbarButtons } from '../toolbar/toolbar';

function dispatch(name: EventTypes, data: any) {
  const event = new CustomEvent(name, {
    detail: data,
    bubbles: true,
  });

  console.log('Dispatched Event:', name);
  document.dispatchEvent(event);
}

export function toolbarScriptElementChanged(elementType: string) {
  dispatch(EventTypes.SCRIPT_ELEMENT_CHANGED, { element: elementType });
}

export function toolbarMarkToggled(markType: typeof ToolbarButtons) {
  dispatch(EventTypes.TOOLBAR_MARK_TOGGLED, { markType });
}

export function textMarkToggled(marks: { bold: boolean; italics: boolean; underline: boolean; strikethrough: boolean; }) {
  dispatch(EventTypes.TEXT_MARK_TOGGLED, marks);
}

export function textElementChanged(element: string) {
  dispatch(EventTypes.TEXT_ELEMENT_UPDATED, { element });
}