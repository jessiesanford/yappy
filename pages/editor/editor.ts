import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { WebrtcProvider } from 'y-webrtc';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ySyncPlugin, yCursorPlugin, yUndoPlugin, undo, redo } from 'y-prosemirror';
import { keymap } from 'prosemirror-keymap';
import { schema } from './schema';

export class Editor {
  editorView: EditorView;
  loaded: boolean = false;
  provider: WebsocketProvider | WebrtcProvider;
  constructor() {
  }

  setupProvider(ydoc) {
    if (!this.provider) {
      // this.provider = new WebsocketProvider('ws://localhost:3000', 'helloWorld', ydoc);
      this.provider = new WebrtcProvider('myRoom', ydoc);
    }
  }

  init(container: Element) {
    const ydoc = new Y.Doc();
    const type = ydoc.getXmlFragment('prosemirror');
    this.setupProvider(ydoc);

    this.editorView = new EditorView(container, {
      state: EditorState.create({
        schema,
        plugins: [
          ySyncPlugin(type),
          yCursorPlugin(this.provider.awareness),
          yUndoPlugin(),
          keymap({
            'Mod-z': undo,
            'Mod-y': redo,
            'Mod-Shift-z': redo
          })
        ]
          // .concat(exampleSetup({ schema }))
      })
    });

    this.loaded = true;
  }

  connect() {
    if (this.provider) {
      if (this.provider.shouldConnect) {
        this.provider.disconnect();
        console.log('disconnecting');
      } else {
        this.provider.connect();
        console.log('connecting');
      }
    } else {
      console.log('provider is undefined');
    }
  }

  destroy() {
    this.editorView.destroy();
  }
}