import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';
import { ParagraphNodeView } from '../nodeViews/paragraphNodeView';
import { CharacterNodeView } from '../nodeViews/characterNodeView';

export const NodeViewPlugin = new Plugin({
  props: {
    nodeViews: {
      paragraph: (node: Node, view: EditorView, getPos) => new ParagraphNodeView(node, view, getPos).create(),
      character: (node: Node, view: EditorView, getPos) => new CharacterNodeView(node, view, getPos).create(),
    }
  }
});