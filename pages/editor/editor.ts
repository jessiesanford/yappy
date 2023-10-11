import * as Y from 'yjs';
import applyDevTools from 'prosemirror-dev-tools';
import { WebsocketProvider } from 'y-websocket';
import { WebrtcProvider } from 'y-webrtc';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ySyncPlugin, yCursorPlugin, yUndoPlugin } from 'y-prosemirror';
import { EditorSchema } from './schema/schema';
import { EditorKeymap } from './keymap';
import { NodeViewPlugin } from './plugins/nodeViewPlugin';
import { handleDOMEvents } from './event/baseEvents';

export class Editor {
  editorView: EditorView;
  loaded: boolean = false;
  provider: WebsocketProvider | WebrtcProvider;

  constructor() {
    this.editorView = null;
    this.provider = null;
  }

  setupProvider(ydoc) {
    if (!this.provider) {
      this.provider = new WebsocketProvider('ws://localhost:3000', 'helloWorld', ydoc);
      // this.provider = new WebrtcProvider('myRoom', ydoc);
    }
  }

  init(container: Element) {
    const ydoc = new Y.Doc();
    const type = ydoc.getXmlFragment('prosemirror');
    this.setupProvider(ydoc);


    this.editorView = new EditorView(container, {
      state: EditorState.create({
        schema: EditorSchema,
        plugins: [
          ySyncPlugin(type),
          yCursorPlugin(this.provider.awareness),
          yUndoPlugin(),
          EditorKeymap,
          NodeViewPlugin,
        ],
      }),
      handleDOMEvents: handleDOMEvents,
    });
    this.loaded = true;
    applyDevTools(this.editorView);
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