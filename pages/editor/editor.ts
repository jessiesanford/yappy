import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
// import { ySyncPlugin, yCursorPlugin, yUndoPlugin, undo, redo } from 'y-prosemirror';
import { EditorState } from 'prosemirror-state';
import { schema } from './schema';
import { EditorView } from 'prosemirror-view';
import { keymap } from 'prosemirror-keymap';

export class Editor {
  editor: EditorView;
  constructor() {
  }

  init(container: Element) {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider('wss://demos.yjs.dev', 'prosemirror', ydoc);
    const type = ydoc.getXmlFragment('prosemirror');

    this.editor = new EditorView(container, {
      state: EditorState.create({
        schema,
        plugins: [
          // ySyncPlugin(type),
          // yCursorPlugin(provider.awareness),
          // yUndoPlugin(),
          keymap({
            // 'Mod-z': undo,
            // 'Mod-y': redo,
            // 'Mod-Shift-z': redo
          })
        ]
      })
    });
  }

  destroy() {
    this.editor.destroy();
  }
}