import * as _ from 'lodash';
import { MarkType } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { textElementChanged, textMarkToggled } from '../events/globalEvents';
import { EditorKeys } from '../editorKeys';
import { isOnlyCollabCursorUpdate } from '../../../util/pmUtils';
import { Editor } from '../editor';

export const ToolbarSyncPlugin = (editor: Editor) => new Plugin({
  key: EditorKeys.Toolbar,
  appendTransaction: (trs, oldState, newState) => {
    for (const tr of trs) {
      /**
       * ensures current storedMarks for bold, italic, etc are not toggled off from previous state when
       * a collab transaction comes through without them
       */
      if (tr.getMeta('collabTransaction')) {
        return newState.tr.setStoredMarks(oldState.storedMarks);
      }
    }
    return null;
  },
  view: () => {
    return {
      destroy: _.noop,
      update: (view, prevState) => {
        const oldData = EditorKeys.Toolbar.getState(prevState);
        const newData = EditorKeys.Toolbar.getState(view.state);
        if (!_.isEqual(oldData.marksData, newData.marksData)) {
          textMarkToggled(newData.marksData);
        }
        if (!_.isEqual(oldData.nodeTypeName, newData.nodeTypeName) && !_.isNil(newData.nodeTypeName)) {
          textElementChanged(newData.nodeTypeName);
        }
      }
    };
  },
  state: {
    init: (config, instance) => {
      return {
        marksData: buildMarksData(instance),
        nodeTypeName: instance.selection.$anchor.node(3)?.type.name || null
      };
    },
    apply: (tr, val, oldState, newState) => {
      if (isOnlyCollabCursorUpdate(tr)) return val;
      const pluginState: typeof val = _.cloneDeep(val);
      const selectionChanged = !oldState.selection.eq(newState.selection);
      const isCurrEditor = true;
      const storedMarksChanged = !_.isEqual(oldState.storedMarks, newState.storedMarks);
      const selectionMarksChanged = !_.isEqual(
        _.uniqBy(oldState.selection.$from.marks().concat(oldState.selection.$to.marks()), v => v.type),
        _.uniqBy(newState.selection.$from.marks().concat(newState.selection.$to.marks()), v => v.type)
      );
      const nodeTypeChanged = newState.selection.$anchor.node(3)?.type.name !== oldState.selection.$anchor.node(3)?.type.name;
      if (isCurrEditor) {
        if (storedMarksChanged || selectionMarksChanged || selectionChanged) {
          pluginState.marksData = buildMarksData(newState);
        }
        if (selectionChanged || nodeTypeChanged) {
          pluginState.nodeTypeName = newState.selection.$anchor.node(3)?.type.name || null;
        }
      }
      return pluginState;
    }
  }
});

const checkTypeForMarks = (state: EditorState, type: MarkType) => {
  if (state.selection.empty) {
    const setMark = type.isInSet(
      state.storedMarks || _.uniqBy(
        _.compact(
          state.selection.$from.marks().concat(state.selection.$to.marks())
        ), v => v.type
      )
    );
    return setMark ? setMark.type === type : false;
  } else {
    return state.doc.rangeHasMark(state.selection.from, state.selection.to, type);
  }
};

const buildMarksData = (state: EditorState) => {
  return {
    bold: checkTypeForMarks(state, state.schema.marks.strong),
    italics: checkTypeForMarks(state, state.schema.marks.em),
    underline: checkTypeForMarks(state, state.schema.marks.underline),
    strikethrough: checkTypeForMarks(state, state.schema.marks.strikethrough)
  };
};