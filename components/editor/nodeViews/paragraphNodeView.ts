import { BaseNodeView } from './baseNodeView';
import { EditorView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';

export class ParagraphNodeView extends BaseNodeView {
  constructor(node: Node, view: EditorView, getPos: () => number | undefined) {
    super(node, view, getPos);
    if (this.Type === 'paragraph') {
      // we're good!
    } else {
      throw Error('Error: node type mismatch (paragraph)');
    }
  }

  ignore(record: MutationRecord) {
    if (record.type === 'attributes' && record.attributeName === 'class') {
      return true;
    } else {
      return super.ignore(record);
    }
  }

  update(node = this.Node) {
    return super.update(node);
  }
}