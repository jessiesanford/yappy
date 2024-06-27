import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';
import { ParagraphNodeView } from '../nodeViews';
import { CharacterNodeView } from '../nodeViews';
import { DialogueNodeView } from '../nodeViews';

export const NodeViewPlugin = new Plugin({
  props: {
    nodeViews: {
      paragraph: (node: Node, view: EditorView, getPos) => new ParagraphNodeView(node, view, getPos).create(),
      character: (node: Node, view: EditorView, getPos) => new CharacterNodeView(node, view, getPos).create(),
      dialogue: (node: Node, view: EditorView, getPos) => new DialogueNodeView(node, view, getPos).create(),
    }
  }
});