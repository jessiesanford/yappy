import * as Y from 'yjs';
// import applyDevTools from 'prosemirror-dev-tools';
import { WebsocketProvider } from 'y-websocket';
import { EditorState, Transaction, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ySyncPlugin, yCursorPlugin, yUndoPlugin } from 'y-prosemirror';
import { EditorSchema } from './schema/schema';
import { NodeViewPlugin } from './plugins/nodeViewPlugin';
import { handleDOMEvents } from './events/baseEvents';
import { Doc } from 'yjs';
import {EventTypes} from '../../static';
import * as _ from 'lodash';
import { generateId, stringToHexColor } from '../../util/baseUtils';
import { GameKeymap } from './keymap/gameKeymap';
import { keymap } from 'prosemirror-keymap';
import { ToolbarSyncPlugin } from './plugins/toolbarSyncPlugin';
import { Toolbar, ToolbarButtons } from './toolbar/toolbar';
import { BaseEditorView } from './baseEditorView';


export class Editor {
  editorView: EditorView | null;
  loaded: boolean = false;
  provider: WebsocketProvider | null;
  keymap: GameKeymap;
  doc: Y.Doc | null;

  constructor() {
    this.editorView = null;
    this.provider = null;
    this.keymap = new GameKeymap(EditorSchema);
    this.doc = null;
  }

  setupProvider(ydoc: Doc) {
    if (!this.provider) {
      this.provider = new WebsocketProvider('ws://localhost:3000', 'helloWorld', ydoc);
    }
  }

  setPresenceLabel(label: string) {
    if (this.provider) {
      this.provider.awareness.setLocalStateField('user', {
        name: label,
        color: stringToHexColor(label),
      });
    }
  }

  init(container: Element) {
    this.doc = new Y.Doc();
    const type = this.doc.getXmlFragment('prosemirror');
    this.setupProvider(this.doc);

    if (this.provider) {
      // this.provider.awareness.setLocalStateField('color', { dark: '#000000', light: '#ffffff' });
      this.provider.awareness.setLocalStateField('user', {
        name: 'Testing User',
        color: stringToHexColor(''),
      });

      this.editorView = new BaseEditorView(container, {
        state: EditorState.create({
          schema: EditorSchema,
          plugins: [
            ySyncPlugin(type),
            yCursorPlugin(this.provider.awareness),
            ToolbarSyncPlugin(this),
            yUndoPlugin(),
            _.merge(keymap(this.keymap), { key: new PluginKey('keyMap') }.key),
            NodeViewPlugin,
          ],
        }),
        handleDOMEvents: handleDOMEvents,
      });

      this.addListeners();

      this.loaded = true;
      // applyDevTools(this.editorView);
    } else {
      throw Error('Provider is not initialized');
    }
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

  addListeners() {
    document.addEventListener(EventTypes.SCRIPT_ELEMENT_CHANGED, this.handleElementChangeEvent.bind(this));
  }

  destroyListeners() {
    document.removeEventListener(EventTypes.SCRIPT_ELEMENT_CHANGED, this.handleElementChangeEvent.bind(this));
  }

  destroy() {
    if (this.editorView) {
      this.editorView.destroy();
    }

    this.destroyListeners();
  }

  handleElementChangeEvent(event: Event) {
    const { detail } = event as CustomEvent;
    if (this.editorView) {
      this.setSelectedElementType(this.editorView, detail.element);
    }
  }

  setSelectedElementType(view: EditorView, typeName: string, opt_tr?: Transaction) {
    const state = view.state;
    const tr = opt_tr || state.tr;
    const selection = tr.selection;
    const { $from, $to } = selection;
    const type = state.schema.nodes[typeName];

    if ($from.depth === 3) {
      if (selection.empty) {
        tr.setNodeMarkup($from.before(), type, _.merge({}, { id: $from.node().attrs['id'] || generateId() }));
      } else {
        // ?
      }
      if (!opt_tr) {
        view.dispatch(tr);
      } else {
        return tr;
      }
    }
  }



  handleToolbarButtonClick(buttonKey: string) {
    // prevents editor from losing selection
    this.focus();

    if (this.editorView) {
      switch (buttonKey) {
        case ToolbarButtons.BOLD:
          return Toolbar.toggleBold(this.editorView);
        case ToolbarButtons.ITALICS:
          return Toolbar.toggleItalics(this.editorView);
        case ToolbarButtons.UNDERLINE:
          return Toolbar.toggleUnderline(this.editorView);
        case ToolbarButtons.STRIKETHROUGH:
          return Toolbar.toggleStrikethrough(this.editorView);
        case ToolbarButtons.UNDO:
          Toolbar.undoAction(this.editorView);
          break;
        case ToolbarButtons.REDO:
        case ToolbarButtons.REDO_SECONDARY:
          Toolbar.redoAction(this.editorView);
          break;
      }
    }
  }

  focus() {
    if (this.editorView) {
      this.editorView.focus();
    }
  }

  doSave() {
    if (this.editorView) {

    }
  }
}