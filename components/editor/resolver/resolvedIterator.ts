import { ResolvedPos } from 'prosemirror-model';
import { ReplaceAroundStep, ReplaceStep } from 'prosemirror-transform';
import { ResolvedData } from './resolvedData';
import { ResolvedNode } from './resolvedNode';
import { Transaction } from 'prosemirror-state';
import { ResolvedDocument } from './resolvedDocument';

/**
 * This is an iterator built specifically for iterating depth 1 or 2. Depth 0 cannot be iterated because it is the whole
 * document itself and therefore is impossible. There are currently no nodes at deeper depth than 2.
 * Newly constructed iterators are guaranteed to start at the beginning of the depth they given.
 */
export class ResolvedIterator {
  private tr_: Transaction;
  private depth_: number;
  private data_: ResolvedData | null;
  private steps_: number;

  /**
   * ResolvedDocument node data
   * @see {@link ResolvedDocument}
   * @return {ResolvedDocument|null}
   */
  get doc() {
    return this.data.doc;
  }

  /**
   * The depth used by this iterator compared by the depth given by the ResolvedData
   * @return {Number}
   */
  get depth() {
    if (this.data_) {
      return Math.max(this.depth_, this.data_.depth);
    }
  }

  /**
   * The depth used by this iterator alone, not the ResolvedData;
   * @return {Number}
   */
  get iDepth() {
    return this.depth_;
  }

  /**
   * The depth used by the ResolvedData;
   * @return {Number}
   */
  get aDepth() {
    return this.data ? this.data.depth : null;
  }

  /**
   * The pointer position stored in the ResolvedData
   * @return {Number}
   */
  get pointer() {
    return this.data.pointer;
  }

  /**
   * Set the pointer position in the ResolvedData
   * @param {Number} p
   */
  set pointer(p) {
    this.data.pointer = p;
  }

  /**
   * Return the ResolvedData contained by this iterator
   * This can be stored and used as a return to point.
   * @return {ResolvedData}
   */
  get data(): ResolvedData {
    return this.data_;
  }

  /**
   * Set the ResolvedData for this iterator
   * Changing this data will cause the iterator to permanently acquire a different state.
   * Does nothing to the transaction stored by this iterator.
   * @param {ResolvedData} d
   */
  set data(d) {
    if (this.data_.constructor === d.constructor) {
      this.data_ = d;
    } else {
      throw new Error(`ResolvedIteratorError: Unexpected data type; ${this.data_.constructor['name']} === ${d.constructor['name']};`);
    }
  }

  /**
   * return the Transaction stored in this iterator
   * @return {Transaction}
   * @property
   */
  get tr() {
    return this.tr_;
  }

  /**
   * Set the Transaction used by this iterator
   * @param {Transaction} t
   * @property
   */
  set tr(t) {
    this.tr_ = t;
  }

  /**
   * Creates object with information about the indices in a ResolvedPos up to a depth of 2.
   * Passing optional depth will trigger a warning if the depth does not match.
   * Is completely dependent on the ResolvedPos path
   * Takes the transaction just incase it needs to update.
   * Accepts ResolvedIterators, ResolvedData or Number positions.
   * In the case of ResolvedIterator and ResolvedData, it will just clone these and use them as they are.
   * @constructor
   * @param {!Transaction} tr
   * @param {Number|ResolvedIterator|ResolvedData|ResolvedPos?} obj
   * @param {Number|null} opt_depth
   */
  constructor(tr: Transaction, obj: number | ResolvedIterator | ResolvedData | ResolvedPos, opt_depth: number = null) {
    /**
     * This is the transaction this iterator represents
     * @type {Transaction}
     * @protected
     */
    this.tr_ = tr;
    /**
     * This represents the desired depth the iterator should try to fulfill
     * @type {Number}
     * @protected
     */
    this.depth_ = null;
    /**
     * This is the data that a ResolvedIterator uses to track where it is pointing to. This can be swapped out and stored
     * like a pointer.
     * @type {ResolvedData}
     * @protected
     */
    this.data_ = null;
    /**
     * The number of steps present during the creation of this iterator. This is used to determine if the iterator has
     * changed during the operational use of this iterator. The iterator will not update by itself, but, this number is used
     * to determine if this necessary to update. Changing the transaction variable will guarantee an update needs to happen.
     * @type {Number}
     * @protected
     */
    this.steps_ = this.tr_.steps.length;
    switch (true) {
      case obj.constructor === Number:
        const N = obj as number;
        const res = this.tr_.doc.resolve(N);
        this.data_ = new ResolvedData();
        this.depth_ = opt_depth ? Math.min(Math.max(opt_depth, Depth.Document), Depth.Five) : res.depth;
        //If no optional depth, defaults to res.depth
        this.instantiate_(res);
        break;
      case obj instanceof ResolvedPos:
        const RP = obj as ResolvedPos;
        this.data_ = new ResolvedData();
        this.depth_ = opt_depth ? Math.min(Math.max(opt_depth, Depth.Document), Depth.Five) : RP.depth;
        //If no optional depth, defaults to res.depth
        this.instantiate_(RP);
        break;
      case obj instanceof ResolvedIterator:
        const RI = obj as ResolvedIterator;
        this.depth_ = opt_depth || RI.depth_;
        this.data_ = RI.data_.clone();
        break;
      case obj instanceof ResolvedData:
        const RD = obj as ResolvedData;
        this.depth_ = opt_depth || RD.depth;
        this.data_ = RD.clone();
        break;
      default:
        this.data_ = new ResolvedData();
        //Enforces range between -1 and 2; Inclusive; In this state calls on ResolvedIterator should do nothing.
        this.depth_ = opt_depth !== null && opt_depth !== undefined ? Math.min(Math.max(opt_depth, Depth.Nothing), Depth.Two) : Depth.Nothing;
    }
  }

  /**
   * Returned the node at the given depth
   * @param {Number} depth
   * @return {ResolvedNode|ResolvedDocument}
   */
  getNode<D extends number>(depth: D = this.depth as D) {
    return this.data ? this.data.getNode(depth) : null;
  }

  /**
   * @param {Number} depth
   * @return {Object<String, *>|ProsemirrorNode.attrs}
   *
   */
  attrs<D extends number>(depth: D = this.depth as D) {
    return this.data ? this.data.attrs(depth) : null;
  }

  /**
   * Returns the attrs.id of the node at the given depth
   * @param {number} depth
   * @return {null|string}
   */
  id<D extends number>(depth: D = this.depth as D) {
    return this.data && this.data.depth >= depth ? this.data.attrs(depth).id : null;
  }

  /**
   * Returns the NodeType at the given depth
   * @param {number} depth
   * @return {NodeType|null}
   */
  type<D extends number>(depth: D = this.depth as D) {
    return this.data && this.data.depth >= depth ? this.data.type(depth) : null;
  }

  /**
   *
   * @param {number} depth
   * @return {string|null}
   */
  textContent<D extends number>(depth: D = this.depth as D) {
    return this.data && this.data.depth >= depth ? this.data.textContent(depth) : null;
  }

  /**
   * Returns the NodeType.name at the given depth
   * @param {number} depth
   * @return {null|string}
   */
  name<D extends number>(depth: D = this.depth as D) {
    return this.data && this.data.depth >= depth ? this.data.type(depth).name : null;
  }

  /**
   * @param {Number} depth
   * @return {Number}
   */
  before<D extends number>(depth: D = this.depth as D) {
    return this.data ? this.data.before(depth) : null;
  }

  /**
   *
   * @param {Number} depth
   * @return {Number}
   */
  start<D extends number>(depth: D = this.depth as D) {
    return this.data ? this.data.start(depth) : null;
  }

  /**
   *
   * @param {Number} depth
   * @return {ProsemirrorNode}
   */
  firstChild<D extends number>(depth: D = this.depth as D) {
    return this.data ? this.data.firstChild(depth) : null;
  }

  /**
   *
   * @param {Number} depth
   * @return {ProsemirrorNode}
   */
  PMNode<D extends number>(depth: D = this.depth as D) {
    return this.data ? this.data.PMNode(depth) : null;
  }

  /**
   *
   * @param {Number} depth
   * @return {ProsemirrorNode}
   */
  lastChild<D extends number>(depth: D = this.depth as D) {
    return this.data ? this.data.lastChild(depth) : null;
  }

  /**
   *
   * @param {Number} depth
   * @return {Number}
   */
  nodeSize<D extends number>(depth: D = this.depth as D) {
    return this.data ? this.data.nodeSize(depth) : null;
  }

  nodeCount<D extends number>(depth: D = this.depth as D) {
    return this.data ? this.data.nodeCount(depth) : null;
  }

  childCount<D extends number>(depth: D = this.depth as D) {
    return this.data ? this.data.childCount(depth) : null;
  }

  /**
   *
   * @param depth
   * @return {any}
   */
  content<D extends number>(depth: D = this.depth as D) {
    return this.data ? this.data.content(depth) : null;
  }

  /**
   *
   * @param {Number} depth
   * @return {Number}
   */
  index<D extends number>(depth: D = this.depth as D) {
    return this.data ? this.data.index(depth) : null;
  }

  /**
   *
   * @param {Number} depth
   * @return {Number}
   */
  end<D extends number>(depth: D = this.depth as D) {
    return this.data ? this.data.end(depth) : null;
  }

  /**
   *
   * @param {Number} depth
   * @return {Number}
   */
  after<D extends number>(depth: D = this.depth as D) {
    return this.data ? this.data.after(depth) : null;
  }

  /**
   * Takes a resolved position and converts it to the required ResolvedData
   * Optional Zero sets the iterator to the start of the depth it is given.
   * @param {ResolvedPos} resolved
   * @private
   */
  instantiate_(resolved: ResolvedPos) {
    let depth = this.data.depth > Depth.Document ? Math.min(this.data.depth, this.iDepth) : this.depth;
    if (resolved.path[1] >= resolved.path[0].childCount) {
      depth = 0;
    } else {
      try {
        let data = new ResolvedData(resolved), current = null;
        let direction;
        if (resolved.pos < depth) {
          direction = 1;
        } else {
          direction = -1;
        }
        const i = data.depth, h = depth, k = this.depth_;
        let j = Math.abs(i - depth);
        if (i < depth) {
          while (data.depth !== depth && j !== 0) {
            current = new ResolvedData(this.tr.doc.resolve(Math.max(0, data.pointer + direction)));
            if (Math.max(current.depth, data.depth) > Math.min(depth, current.depth)) {
              direction *= -1;
              current = new ResolvedData(this.tr.doc.resolve(Math.min(this.tr.doc.content.size, data.pointer + direction)));
            }
            data = current;
            --j;
          }
        } else {
          if (i > depth) {
            data = new ResolvedData(this.tr.doc.resolve(Math.max(0, data.getNode(depth).start)));
          }
        }
        if (data.depth !== depth) {
          this.data_ = new ResolvedData(resolved, Depth.Nothing);
          if (h === k) {
            console.warn('ResolveWarning: Failed to resolve position');
            return;
          } else {
            this.instantiate_(resolved);
            return;
          }
        } else {
          this.data_ = data;
          return;
        }
      } catch (ex) {
        this.data_ = new ResolvedData(resolved, Depth.Nothing);
        console.warn('ResolveWarning: Failed to resolve position');
        return;
      }
    }
    this.data_ = new ResolvedData(resolved, depth);
  }

  node<D extends number>(depth: D = this.depth as D) {
    return this.data.getNode(depth);
  }

  /**
   * For incrementing data at a given depth.
   * Has no error handling or logical handling.
   * @param {!Number} depth
   */
  increment<D extends number>(depth: D) {
    this.data.increment(depth);
  }

  /**
   * For decrementing data at a given depth.
   * Has no error handling or logical handling.
   * @param {!Number} depth
   */
  decrement<D extends number>(depth: D) {
    this.data.decrement(depth);
  }

  /**
   * Determines if there is a node after the current one at the specific depth
   * There may be nodes at specific depths not seen by this function.
   * This function only details the nodes near the current position of iterator.
   * @param {Number=} depth
   * @return {Boolean}
   */
  hasNext<D extends number>(depth?: D) {
    if (depth != null) {
      if (this.data.depth >= depth) {
        if (depth > Depth.Document) {
          const n = this.data.getNode(depth) as ResolvedNode;
          return n.index + 1 !== this.data.getNode(depth - 1).childCount;
        } else {
          throw new Error(`DepthException: Bad depth of ${depth}`);
        }
      } else {
        return false;
      }
    } else {
      let res = false;
      for (let i = this.data.depth; i > 0; --i) {
        if (this.hasNext(i)) {
          res = true;
          break;
        }
      }
      return res;
    }
  }

  /**
   * Determines if there is a node after the current one at the specific depth
   * There may be nodes at specific depths not seen by this function.
   * This function only details the nodes near the current position of iterator.
   * @param {Number=} depth
   * @return {Boolean}
   */
  hasPrev<D extends number>(depth?: D) {
    if (depth != null) {
      if (this.data.depth >= depth) {
        if (depth > Depth.Document) {
          const n = this.data.getNode(depth) as ResolvedNode;
          return n.index - 1 >= 0;
        } else {
          throw new Error(`DepthException: Bad depth of ${depth}`);
        }
      } else {
        return false;
      }
    } else {
      let res = false;
      for (let i = this.data.depth; i > 0; --i) {
        if (this.hasPrev(i)) {
          res = true;
          break;
        }
      }
      return res;
    }
  }

  /**
   * Returns the node directly before the current node within the same depth
   * @param {Number} depth
   * @return {ProsemirrorNode}
   */
  PMNodeBefore<D extends number>(depth: D = this.depth as D) {
    return this.data.PMNodeBefore(depth);
  }

  /**
   * Returns the node directly after the current node within the same depth
   * @param {Number} depth
   * @return {ProsemirrorNode}
   */
  PMNodeAfter<D extends number>(depth: D = this.depth as D) {
    return this.data.PMNodeAfter(depth);
  }

  /**
   * This function is built to return the next node at the desired depth no matter how far it is from the current element.
   * Permanently changes the iterator and the nodes it points to.
   * Preserve prevents the data from being destroyed if nothing can be iterated
   * Returns a boolean detailing the success or failure
   * @param {!Number} depth
   * @param {Boolean=} opt_preserve
   * @return {Boolean}
   */
  next<D extends number>(depth: D, opt_preserve: boolean = true) {
    if (opt_preserve) {
      const clone = this.data.clone();
      if (this.next_(depth)) {
        this.pointer = this.data.start(this.data.depth);
        return true;
      } else {
        this.data = clone;
        return false;
      }
    } else {
      if (this.next_(depth)) {
        this.pointer = this.data.start(this.data.depth);
        return true;
      } else {
        return false;
      }
    }
  }

  next_<D extends number>(depth: D) {
    if (depth > Depth.Document) {
      while (true) {
        if (this.hasNext(depth)) {
          this.increment(depth);
          this.first(depth + 1);
          return true;
        } else {
          this.data.destroy(depth);
          if (this.next_(depth - 1)) {
            this.first(depth);
            if (this.node(depth)) {
              return true;
            }
          } else {
            return false;
          }
        }
      }
    }
    return false;
  }

  /**
   * This function is built to return the previous node at the desired depth no matter how far it is from the current element.
   * Permanently changes the iterator and the nodes it points to.
   * Preserve prevents the data from being destroyed if nothing can be iterated
   * Returns a boolean detailing the success or failure
   * @param {!Number} depth
   * @param {Boolean=} opt_preserve
   * @return {Boolean}
   */
  prev<D extends number>(depth: D, opt_preserve: boolean = true) {
    if (opt_preserve) {
      const clone = this.data.clone();
      if (this.prev_(depth)) {
        return true;
      } else {
        this.data = clone;
        return false;
      }
    } else {
      return this.prev_(depth);
    }
  }

  /**
   *
   * @param depth
   * @return {boolean}
   * @private
   */
  prev_<D extends number>(depth: D) {
    if (depth > Depth.Document) {
      while (true) {
        if (this.hasPrev(depth)) {
          this.decrement(depth);
          this.last(depth + 1);
          return true;
        } else {
          this.data.destroy(depth);
          if (this.prev_(depth - 1)) {
            this.last(depth);
            if (this.node(depth)) {
              return true;
            }
          } else {
            return false;
          }
        }
      }
    }
    return false;
  }

  /**
   * Used to put the iterator on the first node at the depth given
   * Permanently changes the iterator and the nodes it points to.
   * Adjusts the pointer automatically if opt_magnet is false and tries to expand depth as much as possible
   * @param {!Number} depth
   * @param {Boolean?} opt_magnet
   * @return {ResolvedIterator}
   */
  first<D extends number>(depth: D, opt_magnet: boolean = false) {
    if (this.data.depth >= depth - 1 && depth > 0) {
      const parent = this.node(depth - 1);
      if (parent && parent.nodeCount > 0) {
        const node = (this.node(depth) || new ResolvedNode) as ResolvedNode, PMNode = parent.maybeChild(0);
        if (PMNode && node) {
          node.index = 0;
          node.PMNode = PMNode;
          node.before = parent.start;
          node.start = node.before + 1;
          node.end = node.start + node.content.size;
          node.after = node.end + 1;
          this.data.setNode(depth, node);
          if (!opt_magnet && !this.first(depth + 1)) {
            this.data.destroy(depth + 1);
            this.pointer = node.start;
          }
          return this;
        }
      } else {
        this.data.destroy(depth);
      }
    } else {
      if (opt_magnet && depth > 0) {
        const parent = this.node(depth - 1);
        if (parent && parent.nodeCount > 0) {
          const node = new ResolvedNode;
          node.index = 0;
          node.before = parent.start;
          node.start = node.before + 1;
          node.PMNode = parent.child(node.index);
          node.end = node.start + node.content.size;
          node.after = node.end + 1;
          this.data.setNode(depth, node);
          return this;
        } else {
          this.data.destroy(depth);
        }
      }
    }
    return null;
  }

  /**
   * Used to put the iterator on the last node at the depth given
   * Permanently changes the iterator and the nodes it points to.
   * Adjusts the pointer automatically if opt_magnet is false
   * @param {!Number} depth
   * @param {Boolean?} opt_magnet
   * @return {ResolvedIterator}
   */
  last<D extends number>(depth: D, opt_magnet: boolean = false) {
    if (this.data.depth >= depth - 1 && depth > 0) {
      const parent = this.node(depth - 1);
      if (parent && parent.nodeCount > 0) {
        const node = (this.node(depth) || new ResolvedNode()) as ResolvedNode, PMNode = parent.maybeChild(parent.nodeCount - 1);
        if (PMNode && node) {
          node.index = parent.childCount - 1;
          node.after = parent.end;
          node.end = node.after - 1;
          node.PMNode = PMNode;
          node.start = node.end - node.content.size;
          node.before = node.start - 1;
          this.data.setNode(depth, node);
          if (!opt_magnet && !this.last(depth + 1)) {
            this.pointer = node.start;
          }
          return this;
        }
      } else {
        this.data.destroy(depth);
      }
    } else {
      if (opt_magnet && depth > 0) {
        const parent = this.node(depth - 1);
        if (parent && parent.nodeCount > 0) {
          const node = new ResolvedNode();
          node.index = parent.childCount - 1;
          node.after = parent.end;
          node.end = node.after - 1;
          node.PMNode = parent.child(node.index);
          node.start = node.end - node.content.size;
          node.before = node.start - 1;
          this.data.setNode(depth, node);
          return this;
        } else {
          this.data.destroy(depth);
        }
      }
    }
    return null;
  }

  /**
   * Use this to move the iterator forward or backwards.
   * The offset is the number of nodes at a particular depth the iterator will move.
   * The optional depth given will be the depth it should iterate with.
   * Specifically iterating pages will reset the element (if it has it) to the first element on a page if offset > 0 or last element on a page if offset < 0
   * The optional force will avoid removing data when hitting boundaries and instead keep the last data found.
   * Force will also move across nodes at a particular depth without stopping.
   * Will cause infinite loops without extra logic.
   * @param {!Number} offset
   * @param {Number|undefined?} opt_depth
   * @param {boolean|undefined?} opt_force
   * @return {ResolvedIterator}
   */
  seek<D extends number>(offset: number, opt_depth: D = this.depth_ as D, opt_force: boolean = false) {
    if (offset === 0) {
      return this;
    }
    opt_depth = Math.max(opt_depth, Depth.Document) as D;
    let try_expand = false;
    let clone = this.data.clone();
    this.data.destroy(opt_depth + 1);
    if (offset > 0) {
      if (opt_force) {
        for (let i = 0; i < offset; ++i) {
          if (this.hasNext() && this.next(opt_depth)) {
            try_expand = true;
            this.pointer = this.node(opt_depth).start;
            clone = this.data.clone();
          } else {
            this.data = clone;
            break;
          }
        }
      } else {
        for (let i = 0; i < offset; ++i) {
          if (this.hasNext(opt_depth)) {
            this.increment(opt_depth);
            this.pointer = this.node(opt_depth).start;
            try_expand = true;
          } else {
            this.data.destroy(opt_depth);
            try_expand = false;
            break;
          }
        }
      }
      try_expand && this.first(opt_depth + 1);
    } else {
      if (offset < 0) {
        if (opt_force) {
          for (let i = 0; i > offset; --i) {
            if (this.hasPrev() && this.prev(opt_depth)) {
              try_expand = true;
              this.pointer = this.node(opt_depth).start;
              clone = this.data.clone();
            } else {
              this.data = clone;
              break;
            }
          }
        } else {
          for (let i = 0; i > offset; --i) {
            if (this.hasPrev(opt_depth)) {
              this.decrement(opt_depth);
              this.pointer = this.node(opt_depth).start;
              try_expand = true;
            } else {
              this.data.destroy(opt_depth);
              try_expand = false;
              break;
            }
          }
        }
        try_expand && this.last(opt_depth + 1);
      }
    }
    return this;
  }

  /**
   * Used to peek the next element in the iterator without permanently changed the ResolvedData.
   * Guaranteed to be very fast and efficient.
   * return the ResolvedData that is related to the peek. Works like seek, only not permanent.
   * @param {Number} offset
   * @param {Number|undefined?} opt_depth
   * @param {boolean|undefined?} opt_force
   * @return {ResolvedData|null}
   */
  peek<D extends number>(offset: number, opt_depth: D = this.depth_ as D, opt_force: boolean = false) {
    let data, depth, result = null, reset = false;
    if (this.data.depth >= opt_depth && opt_depth > Depth.Document) {
      data = this.data_;
      depth = this.depth_;
      this.data_ = this.data_.clone();
      result = this.seek(offset, opt_depth, opt_force).data_;
      reset = true;
    }
    if (reset) {
      this.data_ = data;
      this.depth_ = depth;
    }
    return result;
  }

  /**
   * Resolves the position given or uses the current pointer to update the iterator.
   * Expects the depth to remain the same.
   * Auto-detects depth in certain cases
   * @param {Number?} opt_pos
   * @param {Transaction?} opt_tr
   * @return {ResolvedIterator}
   */
  update(opt_pos: number = this.data.pointer, opt_tr: Transaction = null) {
    if (opt_tr) {
      this.tr_ = opt_tr;
      this.steps_ = this.tr_.steps.length;
    } else {
      if (this.steps_ !== this.tr_.steps.length) {
        this.steps_ = this.tr_.steps.length;
      } else {
        //If the data is good, this should be okay.
        this.data.restore();
        return this;
      }
    }
    if (opt_pos >= 0 && opt_pos <= this.tr_.doc.content.size) { //Safety Range
      this.instantiate_(this.tr_.doc.resolve(opt_pos));
    }
    return this;
  }

  /**
   * If the steps the iterator has does not match the steps that the stored tr has, this iterator has unsafe positions for doing changes to the model.
   * Ignoring the accuracy of an iterator is only recommended if it is handled or behavior is reasonably expected.
   * @return {boolean}
   */
  isAccurate() {
    return this.steps_ === this.tr_.steps.length;
  }

  /**
   * Returns true if lazy update was successful
   * Updates all the node structures in the iterator to match what the tr.doc looks like currently.
   * @return {boolean}
   */
  lazyUpdate() {
    if (this.data.depth > Depth.Document) {
      if (this.steps_ < this.tr_.steps.length) {
        const lazyPointer = this.node(this.data.depth).start;
        let replaceSteps = 0, canLazyUpdate = true;
        check:
          for (let i = this.steps_; i < this.tr_.steps.length; ++i) {
            switch (true) {
              case this.tr_.steps[i] instanceof ReplaceStep:
                ++replaceSteps;
                if (lazyPointer > this.tr_.steps[i].from) {
                  canLazyUpdate = false;
                  break check;
                }
              case this.tr_.steps[i] instanceof ReplaceAroundStep:
                break;
              default:
                canLazyUpdate = false;
                break check;
            }
          }
        if (canLazyUpdate) {
          //TODO: Fix the api so that this doesnt need to mess with privates
          //Thats why it's any
          let n = this.data.getNode(Depth.Document) as any;
          n.node_ = this.tr.doc;
          if (replaceSteps === 0) {
            for (let depth = 1; depth <= this.data.depth; ++depth) {
              n = this.data.getNode(depth);
              n.node_ = this.data.getNode(depth - 1).maybeChild(n.index);
            }
          } else {
            n.start = 0, n.end = n.PMNode.content.size;
            for (let depth = 1; depth <= this.data.depth; ++depth) {
              n = this.data.getNode(depth);
              n.node_ = this.data.getNode(depth - 1).maybeChild(n.index);
              n.end_ = n.start_ + n.PMNode.content.size;
              n.after_ = n.end_ + 1;
            }
          }
          this.steps_ = this.tr_.steps.length;
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Relative less than other. Check to see if a particular page/element index is less than other
   * No verification if the two Iterators are equal in structure
   * @param {ResolvedIterator} other
   * @param {Number} depth
   * @return {Boolean}
   */
  lt<T extends ResolvedIterator, D extends number>(other: T, depth: D = this.depth_ as D) {
    if (this.constructor === other.constructor) {
      return this.data.lt(other.data_, depth);
    } else {
      return false;
    }
  }

  /**
   * Relative less than or equal to other. Check to see if a particular page/element index is less than or equal to other
   * No verification if the two Iterators are equal in structure
   * @param {ResolvedIterator} other
   * @param {Number} depth
   * @return {Boolean}
   */
  lte<T extends ResolvedIterator, D extends number>(other: T, depth: D = this.depth_ as D) {
    if (this.constructor === other.constructor) {
      return this.data.lte(other.data_, depth);
    } else {
      return false;
    }
  }

  /**
   * Relative greator than other. Check to see if a particular page/element index is greater than other
   * No verification if the two Iterators are equal in structure
   * @param {ResolvedIterator} other
   * @param {Number} depth
   * @return {Boolean}
   */
  gt<T extends ResolvedIterator, D extends number>(other: T, depth: D = this.depth_ as D) {
    if (this.constructor === other.constructor) {
      return this.data.gt(other.data_, depth);
    } else {
      return false;
    }
  }

  /**
   * Relative greator than or equal to other. Check to see if a particular page/element index is greater than or equal to other
   * No verification if the two Iterators are equal in structure
   * @param {ResolvedIterator} other
   * @param {Number} depth
   * @return {Boolean}
   */
  gte<T extends ResolvedIterator, D extends number>(other: T, depth: D = this.depth_ as D) {
    if (this.constructor === other.constructor) {
      return this.data.gte(other.data_, depth);
    } else {
      return false;
    }
  }

  /**
   * Relative equal to other. Check to see if a particular page/element index is equal to other
   * @param {ResolvedIterator} other
   * @param {Number} depth
   * @return {Boolean}
   */
  eq<T extends ResolvedIterator, D extends number>(other: T, depth: D = this.depth_ as D) {
    if (this.constructor === other.constructor) {
      return this.data.eq(other.data_, depth);
    } else {
      return false;
    }
  }

  /**
   * Returns a clone of the iterator
   * @return {ResolvedIterator}
   */
  clone(): ResolvedIterator {
    return new ResolvedIterator(this.tr_, this.data_.clone(), this.data_.depth);
  }
}

export enum Depth {
  Nothing = -1,
  Document,
  One,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Eleven,
  Twelve,
  Thirteen,
  Fourteen,
  Fifteen,
  Sixteen,
}

