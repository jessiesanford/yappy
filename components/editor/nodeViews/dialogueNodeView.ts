import { BaseNodeView } from './baseNodeView';
import { EditorView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';

export class DialogueNodeView extends BaseNodeView {
  constructor(node: Node, view: EditorView, getPos: () => void) {
    super(node, view);
    if (this.Type === 'dialogue') {
      // we're good!
    } else {
      throw Error('Error: node type mismatch (character)');
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