import { ResolvedIterator } from './resolvedIterator';
import { EditorSchema } from '../schema/schema';
import { Transaction } from 'prosemirror-state';
import { ResolvedData } from './resolvedData';
import { ResolvedPos } from 'prosemirror-model';
import { ResolvedNode } from './resolvedNode';

/**
 * Extends functionality for editor type
 * @inheritDoc {ResolvedIterator}
 */
export class BaseIterator extends ResolvedIterator {
  get sequence() : ResolvedNode | null {
    const node = this.data.getNode(EditorDepth.Sequence);
    return node && node.type === EditorSchema.nodes.sequence ? node : null;
  }
  
  get page() : ResolvedNode | null {
    return this.data.getNode(EditorDepth.Page) || null;
  }
  
  get element() : ResolvedNode | null {
    return this.data.getNode(EditorDepth.Element) || null;
  }
  
  /**
   * @see ResolvedIterator#constructor
   * @constructor
   * @param {!Transaction} tr
   * @param {Number|BaseIterator|ResolvedIterator|ResolvedData|ResolvedPos?} obj
   * @param {Number|null} opt_depth
   */
  constructor(tr: Transaction, obj: number | ResolvedIterator | ResolvedData | ResolvedPos, opt_depth: number | undefined = undefined) {
    super(tr, obj, opt_depth);
  }
}

export enum EditorDepth {
  Sequence = 1,
  Page,
  Element,
};