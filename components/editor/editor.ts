import * as Y from 'yjs';
import applyDevTools from 'prosemirror-dev-tools';
import { WebsocketProvider } from 'y-websocket';
import { WebrtcProvider } from 'y-webrtc';
import { EditorState, Transaction, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ySyncPlugin, yCursorPlugin, yUndoPlugin } from 'y-prosemirror';
import { EditorSchema } from './schema/schema';
import { NodeViewPlugin } from './plugins/nodeViewPlugin';
import { handleDOMEvents } from './event/baseEvents';
import { Doc } from "yjs";
import {EventTypes} from "../../static/enums";
import * as _ from "lodash";
import {generateId} from "../../util/baseUtils";
import {GameKeymap} from "./keymap/gameKeymap";
import { keymap } from "prosemirror-keymap";
import { ToolbarSyncPlugin } from "./plugins/toolbarSyncPlugin";
import { Toolbar, ToolbarButtons } from "./toolbar/toolbar";


export class Editor {
  editorView: EditorView;
  loaded: boolean = false;
  provider: WebsocketProvider | WebrtcProvider | null;
  keymap: GameKeymap;

  constructor() {
    this.editorView = null;
    this.provider = null;
    this.keymap = new GameKeymap(EditorSchema);
  }

  setupProvider(ydoc: Doc) {
    if (!this.provider) {
      this.provider = new WebsocketProvider('ws://localhost:3000', 'helloWorld', ydoc);
    }
  }

  init(container: Element) {
    const ydoc = new Y.Doc();
    const type = ydoc.getXmlFragment('prosemirror');
    this.setupProvider(ydoc);

    if (this.provider) {
      this.editorView = new EditorView(container, {
        state: EditorState.create({
          schema: EditorSchema,
          plugins: [
            ySyncPlugin(type),
            yCursorPlugin(this.provider.awareness),
            ToolbarSyncPlugin(this),
            yUndoPlugin(),
            _.merge(keymap(this.keymap), { key: new PluginKey('cxKeyMap') }.key),
            NodeViewPlugin,
          ],
        }),
        handleDOMEvents: handleDOMEvents,
      });

      this.addListeners();

      this.loaded = true;
      applyDevTools(this.editorView);
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
    document.addEventListener(EventTypes.TOOLBAR_MARK_TOGGLED, this.handleToolbarButtonClick.bind(this))
  }

  destroyListeners() {
    document.removeEventListener(EventTypes.SCRIPT_ELEMENT_CHANGED, this.handleElementChangeEvent.bind(this));
    document.removeEventListener(EventTypes.TOOLBAR_MARK_TOGGLED, this.handleToolbarButtonClick.bind(this))
  }

  destroy() {
    if (this.editorView) {
      this.editorView.destroy();
    }

    this.destroyListeners();
  }

  handleElementChangeEvent(event: CustomEvent) {
    const { detail } = event;
    if (this.editorView) {
      this.setSelectedElementType(this.editorView, detail.element);
    }
  }

  setSelectedElementType(view: EditorView, typeName: string, opt_tr?: Transaction) {
    let state = view.state;
    let tr = opt_tr || state.tr;
    let selection = tr.selection;
    let { $from, $to } = selection;
    let type = state.schema.nodes[typeName];

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

  handleToolbarButtonClick(buttonKey) {
    // prevents editor from losing selection
    this.focus();

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

  focus() {
    if (this.editorView) {
      this.editorView.focus();
    }
  }
}