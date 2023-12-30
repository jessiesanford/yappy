import { PluginKey } from 'prosemirror-state';

//Base Keys
// export const CXBaseKeys = {
//   AutoComplete: new PluginKey<any, CXBaseSchema.Class>("cxAutoComplete"),
//   CollabSaveRestore: new PluginKey<any, CXBaseSchema.Class>("cxCollabSaveRestore"),
//   CollabTracking: new PluginKey<any, CXBaseSchema.Class>("cxCollabTracking"),
//   ControlBar: new PluginKey<any, CXBaseSchema.Class>("cxControlBar"),
//   Debug: new PluginKey<any, CXBaseSchema.Class>("cxDebug"),
//   Dirty: new PluginKey<any, CXBaseSchema.Class>("cxDirty"),
//   FindReplace: new PluginKey<any, CXBaseSchema.Class>("cxfindreplace"),
//   PreserveMarks: new PluginKey<boolean, CXBaseSchema.Class>("cxPreserveMarks"),
//   RevisionMode: new PluginKey<any, CXBaseSchema.Class>("cxRevisionMode"),
//   SceneNumbering: new PluginKey<any, CXBaseSchema.Class>("cxSceneNumbering"),
//   SceneSelection: new PluginKey<any, CXBaseSchema.Class>("cxSceneSelection"),
//   ScriptInsights: new PluginKey<any, CXBaseSchema.Class>("cxScriptInsights"),
//   Scrolling: new PluginKey<any, CXBaseSchema.Class>("cxScroller"),
//   Transform: new PluginKey<any, CXBaseSchema.Class>("cxTransform"),
// };

//We need a place to do types for plugins properly.
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

//GEM Keys
export const EditorKeys = {
  Toolbar: new PluginKey<TToolbarPluginState>('toolbarSync'),
};