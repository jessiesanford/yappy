import { Depth, ResolvedIterator } from './resolvedIterator';
import { EditorSchema } from '../schema/schema';
import { Transaction } from 'prosemirror-state';
import { ResolvedData } from './resolvedData';
import { ResolvedPos } from 'prosemirror-model';
/**
 * Extends functionality for GEM editor type
 * @inheritDoc {ResolvedIterator}
 */
export class BaseIterator extends ResolvedIterator {
  /**
   * ResolvedNode that is a sequence
   * @see {@link ResolvedNode}
   * @return {ResolvedNode|null}
   */
  get sequence() {
    const node = this.data.getNode(EditorDepth.Sequence);
    return node && node.type === EditorSchema.nodes.sequence ? node : null;
  }
  
  /**
   * ResolvedNode that is a page
   * @see {@link ResolvedNode}
   * @return {ResolvedNode|null}
   */
  get page() {
    return this.data.getNode(EditorDepth.Page) || null;
  }

  /**
   * ResolvedNode that is a element
   * @see {@link ResolvedNode}
   * @return {ResolvedNode|null}
   */
  get element() {
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