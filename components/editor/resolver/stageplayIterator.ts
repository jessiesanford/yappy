import { Depth, ResolvedIterator } from "./resolvedIterator";
import { ResolvedNode } from "./resolvedNode";
var global = globalThis
/**
 * Extends functionality for Stageplay editor type
 * @inheritDoc {ResolvedIterator}
 *
 */
export class StageplayIterator extends ResolvedIterator {
  /**
   * ResolvedNode that is a page
   * @see {@link ResolvedNode}
   * @return {ResolvedNode|null}
   */
  get page(): ResolvedNode {
    return this.data.getNode(SPDepth.Page) as ResolvedNode || null;
  }

  /**
   * ResolvedNode that is a element
   * @see {@link ResolvedNode}
   * @return {ResolvedNode|null}
   */
  get element(): ResolvedNode {
    return this.data.getNode(SPDepth.Element) as ResolvedNode || null;
  }

  /**
   * ResolvedNode that is a dualdialog child node
   * @see {@link ResolvedNode}
   * @return {ResolvedNode|null}
   */
  get dualDialogChild(): ResolvedNode {
    return this.data.getNode(SPDepth.DualDialogChild) as ResolvedNode || null;
  }

  /**
   * ResolvedNode that is a dualdialog element node
   * @see {@link ResolvedNode}
   * @return {ResolvedNode|null}
   */
  get dualDialogElement(): ResolvedNode {
    return this.data.getNode(SPDepth.DualDialogElement) as ResolvedNode || null;
  }

  /**
   * @see ResolvedIterator#constructor
   * @constructor
   * @param {!Transaction} tr
   * @param {Number|StageplayIterator|ResolvedIterator|ResolvedData|ResolvedPos?} obj
   * @param {Number|null} opt_depth
   */
  constructor(tr, obj, opt_depth = null) {
    super(tr, obj, opt_depth);
  }

  /**
   * Seeks in a particular direction to find predicate using the current iterator.
   * Permanently changes the position of the iterator.
   * If the opt_ignore_depth is true, the iterator will ignore depth and iterate pages and elements.
   * return the first node at depth that was found successfully
   * @param {!Number} depth
   * @param {function} predicate
   * @param {Boolean?} opt_reverse
   * @param {Boolean?} opt_ignore_depth
   * @return {ResolvedData|null}
   */
  find(depth = this.depth, predicate = (node: ResolvedNode) => false, opt_reverse = false, opt_ignore_depth = true) {
    let direction = opt_reverse ? -1 : 1;
    let result = null;
    if (this.data.depth >= depth) {
      switch (depth) {
        case SPDepth.DualDialogElement:
        case SPDepth.DualDialogChild:
        case SPDepth.Element:
          switch (opt_reverse) {
            case true:
              while (this.element) {
                if (predicate(this.element)) {
                  result = this.data.clone();
                  this.seek(direction, depth, opt_ignore_depth);
                  break;
                } else {
                  if (this.hasPrev(depth) || (this.hasPrev(depth - 1) && opt_ignore_depth)) {
                    this.seek(direction, depth, opt_ignore_depth);
                  } else {
                    break;
                  }
                }
              }
              return result;
            case false:
              while (this.element) {
                if (predicate(this.element)) {
                  result = this.data.clone();
                  this.seek(direction, depth, opt_ignore_depth);
                  break;
                } else {
                  if (this.hasNext(depth) || (this.hasNext(depth - 1) && opt_ignore_depth)) {
                    this.seek(direction, depth, opt_ignore_depth);
                  } else {
                    break;
                  }
                }
              }
              return result;
            default:
              return result;
          }
        case SPDepth.Page:
          switch (opt_reverse) {
            case true:
              while (this.page) {
                if (predicate(this.page)) {
                  result = this.data.clone();
                  this.seek(direction, depth, opt_ignore_depth);
                  break;
                } else {
                  if (this.hasPrev(depth) || (this.hasPrev(depth - 1) && opt_ignore_depth)) {
                    this.seek(direction, depth, opt_ignore_depth);
                  } else {
                    break;
                  }
                }
              }
              return result;
            case false:
              while (this.page) {
                if (predicate(this.page)) {
                  result = this.data.clone();
                  this.seek(direction, depth, opt_ignore_depth);
                  break;
                } else {
                  if (this.hasNext(depth) || (this.hasNext(depth - 1) && opt_ignore_depth)) {
                    this.seek(direction, depth, opt_ignore_depth);
                  } else {
                    break;
                  }
                }
              }
              return result;
            default:
              return result;
          }
        default:
          return result;
      }
    } else {
      return result;
    }
  }

  /**
   * Returns the attrs.masterId of the node at the given depth
   * @param {number} depth
   * @return {NaN|string}
   */
  masterId(depth = -1) {
    return this.data && this.data.depth >= depth && this.data.attrs(depth).masterId || Number.NaN
  }

  /**
   * @inheritDoc
   * @return {StageplayIterator}
   */
  first(opt_depth = this.depth, opt_magnet = false) {
    return /** @type {StageplayIterator} */super.first(opt_depth, opt_magnet);
  }

  /**
   * @inheritDoc
   * @return {StageplayIterator}
   */
  last(opt_depth = this.depth, opt_magnet = false) {
    return /** @type {StageplayIterator} */super.last(opt_depth, opt_magnet);
  }

  /**
   * @inheritDoc
   * @return {StageplayIterator}
   */
  seek(offset, opt_depth = this.depth, opt_force = false) {
    return /** @type {StageplayIterator} */ super.seek(offset, opt_depth, opt_force);
  }

  /**
   * @inheritDoc
   */
  peek(offset, opt_depth = this.depth, opt_force = false) {
    return super.peek(offset, opt_depth, opt_force);
  }

  /**
   * @inheritDoc
   * @param {Number?} opt_pos
   * @param {Transaction?} opt_tr
   * @return {StageplayIterator}
   */
  update(opt_pos = this.data.pointer, opt_tr = null) {
    return /** @type {StageplayIterator} */ super.update(opt_pos, opt_tr);
  }

  /**
   * @inheritDoc
   * @return {StageplayIterator}
   */
  clone() {
    return new StageplayIterator(this.tr, this.data.clone(), this.data.depth);
  }
}

export enum SPDepth {
  Page = 1,
  Element,
  DualDialogChild,
  DualDialogElement
}

if (process.env.NODE_ENV === 'development') {
  global["$StageplayIterator"] = StageplayIterator;
}