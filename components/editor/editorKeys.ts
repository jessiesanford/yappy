import { PluginKey } from 'prosemirror-state';

export type TToolbarPluginState = {
  marksData: {
    bold: boolean;
    italics: boolean;
    underline: boolean;
    strikethrough: boolean;
    [key: string]: boolean;
  };
  nodeTypeName: string | null;
}

export const EditorKeys = {
  Toolbar: new PluginKey<TToolbarPluginState>('toolbarSync'),
};