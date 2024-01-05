import { Depth } from './resolvedIterator';
import { ResolvedDocument } from './resolvedDocument';
import { ResolvedNode } from './resolvedNode';
import { ResolvedPos } from 'prosemirror-model';

type ResolvedArray = [ResolvedDocument?, ...ResolvedNode[]];

/**
 * Calculates and stores detailed data about a ResolvedPos up to a specific depth.
 * By itself it does nothing, except acting as a container, ResolvedIterator uses this class to iterate by depth.
 */
export class ResolvedData {
  private static null_: ResolvedData;
  private data_: ResolvedArray;
  private destroyed_: ResolvedArray;
  private pointer_: number;
  
  static get NULL() {
    if (!this.null_) {
      this.null_ = new ResolvedData;
    }
    return this.null_;
  }
  
  /**
   * return the document this data set contains at Depth === 0
   * @return {ResolvedDocument|null}
   */
  get doc() {
    return this.getNode(0) || null;
  }
  
  /**
   * This is the depth this data contains
   * @return {number}
   */
  get depth() {
    return this.data_.length - 1;
  }
  
  /**
   * return the position this data is pointing to
   * Not necessarily the start of a node, however, a ResolvedIterator will always try to put this at the start of
   * a node because it's the safest place to maintain the pointer under operation.
   * @return {*}
   */
  get pointer() {
    return this.pointer_;
  }
  
  /**
   * Set the pointer this data represents.
   * This should be considered private to the programmer but, not to the ResolvedIterator which changes this frequently.
   * Setting this will cause ResolvedIterator.update to resolve this pointer.
   * This shouldn't be necessary to call ever, or something is being done wrong.
   * @param {Number} p
   */
  set pointer(p) {
    this.pointer_ = p;
  }
  
  /**
   * Creates resolved data relating to the resolved position given
   * @param {ResolvedPos|null?} resolved
   * @param {Number?} opt_depth
   */
  constructor(resolved: ResolvedPos | null = null, opt_depth: number = resolved ? resolved.depth : Depth.Nothing) {
    this.data_ = [];
    this.destroyed_ = [];
    this.pointer_ = -1;
    if (opt_depth !== Depth.Nothing) {
      let i = opt_depth;
      for (; i >= 1; --i) {
        this.data_[i] = new ResolvedNode(resolved, i);
      }
      this.data_[i] = new ResolvedDocument(resolved);
      this.pointer_ = resolved.pos;
    }
  }
  
  /**
   * Increment the data forward by calculating the space between nodes.
   * @param {Number} depth
   */
  increment<D extends number>(depth: D) {
    if (this === ResolvedData.NULL) {
      return;
    }
    /** @type {ResolvedNode|null} */
    const node = this.getNode(depth) as ResolvedNode;
    node.index = node.index + 1;
    node.before = node.after;
    node.start = node.before + 1;
    node.PMNode = this.getNode(depth - 1).maybeChild(node.index);
    node.end = node.start + node.content.size;
    node.after = node.end + 1;
  }
  
  /**
   * Decrement the data backwards by calculating the space between nodes.
   * @param depth
   */
  decrement<D extends number>(depth: D) {
    if (this === ResolvedData.NULL) {
      return;
    }
    /** @type {ResolvedNode|null} */
    const node = this.getNode(depth) as ResolvedNode;
    node.index = node.index - 1;
    node.after = node.before;
    node.end = node.after - 1;
    node.PMNode = this.getNode(depth - 1).maybeChild(node.index);
    node.start = node.end - node.content.size;
    node.before = node.start - 1;
  }
  
  /**
   * Returns the node directly before the current node within the same depth
   * Does not work across depth gaps
   * @param {Number} depth
   * @return {ProsemirrorNode}
   */
  PMNodeBefore<D extends number = 0>(depth: D = Depth.Document as D) {
    const parent = this.getNode(depth - 1);
    if (depth > Depth.Document && parent.nodeCount > 1) {
      const node = this.getNode(depth) as ResolvedNode;
      return parent.maybeChild(node.index - 1);
    } else {
      return null;
    }
  }
  
  /**
   * Returns the node directly after the current node within the same depth
   * Does not work across depth gaps
   * @param {Number} depth
   * @return {ProsemirrorNode}
   */
  PMNodeAfter<D extends number = 0>(depth: D = Depth.Document as D) {
    const parent = this.getNode(depth - 1);
    if (depth > Depth.Document && parent.nodeCount > 1) {
      const node = this.getNode(depth) as ResolvedNode;
      return parent.maybeChild(node.index + 1);
    } else {
      return null;
    }
  }
  
  /**
   * Returned the node at the given depth
   * @param {Number} depth
   * @return {ResolvedNode|ResolvedDocument}
   */
  getNode<D extends number>(depth: D): ResolvedArray[D] {
    return depth >= 0 ? this.data_[depth] : null;
  }
  
  /**
   * @param {Number} depth
   * @return {Object<String, *>|ProsemirrorNode.attrs}
   */
  attrs<D extends number>(depth: D) {
    const rn = this.getNode(depth);
    return rn ? rn.attrs : null;
  }
  
  /**
   * @param {Number} depth
   * @return {NodeType|null}
   */
  type<D extends number>(depth: D) {
    const rn = this.getNode(depth);
    return rn ? rn.type : null;
  }
  
  /**
   * @param {Number} depth
   * @return {string|null}
   */
  textContent<D extends number>(depth: D) {
    const rn = this.getNode(depth);
    return rn ? rn.textContent : null;
  }
  
  /**
   * @param {Number} depth
   * @return {Number}
   */
  before<D extends number>(depth: D) {
    const rn = this.getNode(depth) as ResolvedNode;
    return rn ? rn.before : null;
  }
  
  /**
   *
   * @param {Number} depth
   * @return {Number}
   */
  start<D extends number>(depth: D) {
    const rn = this.getNode(depth);
    return rn ? rn.start : null;
  }
  
  /**
   *
   * @param {Number} depth
   * @return {ProsemirrorNode}
   */
  firstChild<D extends number>(depth: D) {
    const pmn = this.PMNode(depth);
    return pmn ? pmn.firstChild : null;
  }
  
  /**
   *
   * @param {Number} depth
   * @return {ProsemirrorNode}
   */
  PMNode<D extends number>(depth: D) {
    const rn = this.getNode(depth);
    return rn ? rn.PMNode : null;
  }
  
  /**
   *
   * @param {Number} depth
   * @return {ProsemirrorNode}
   */
  lastChild<D extends number>(depth: D) {
    const pmn = this.PMNode(depth);
    return pmn ? pmn.lastChild : null;
  }
  
  /**
   *
   * @param {Number} depth
   * @return {Number}
   */
  nodeSize<D extends number>(depth: D) {
    const pmn = this.PMNode(depth);
    return pmn ? pmn.nodeSize : null;
  }
  
  /**
   *
   * @param {Number} depth
   * @return {Number}
   */
  nodeCount<D extends number>(depth: D) {
    const node = this.getNode(depth);
    return node ? node.nodeCount : null;
  }
  
  childCount<D extends number>(depth: D) {
    const node = this.getNode(depth);
    return node ? node.childCount : null;
  }
  
  /**
   *
   * @param depth
   * @return {any}
   */
  content<D extends number>(depth: D) {
    const pmn = this.PMNode(depth);
    return pmn ? pmn.content : null;
  }
  
  /**
   *
   * @param {Number} depth
   * @return {Number}
   */
  index<D extends number>(depth: D) {
    const rn = this.getNode(depth) as ResolvedNode;
    return rn ? rn.index : null;
  }
  
  /**
   *
   * @param {Number} depth
   * @return {Number}
   */
  end<D extends number>(depth: D) {
    const rn = this.getNode(depth);
    return rn ? rn.end : null;
  }
  
  /**
   *
   * @param {Number} depth
   * @return {Number}
   */
  after<D extends number>(depth: D) {
    const rn = this.getNode(depth) as ResolvedNode;
    return rn ? rn.after : null;
  }
  
  /**
   * Sets the node at the depth of this ResolvedData to the given ResolvedNode
   * Nodes that already exist must be destroyed using the destroy functionality first before setting the node.
   * @param {!Number} depth
   * @param {!ResolvedNode} node
   */
  setNode<D extends number>(depth: D, node: ResolvedNode) {
    if (this === ResolvedData.NULL) {
      return;
    }
    if (depth >= 0 && !this.data_[depth]) {
      this.data_[depth] = node;
    }
  }
  
  /**
   * Return a clone of the data in this instance
   * The node instances are shallow, numbers are deep.
   * In other words changes to the node would be shared changes. So don't do that.
   * @return {!ResolvedData}
   */
  clone(): ResolvedData {
    if (this === ResolvedData.NULL) {
      return this;
    }
    const rd = new ResolvedData();
    rd.pointer_ = this.pointer_;
    for (const i in this.data_) {
      if (this.data_.hasOwnProperty(i)) {
        rd.data_[i] = this.data_[i].clone();
      }
    }
    for (const j in this.destroyed_) {
      rd.destroyed_[j] = this.destroyed_[j] && this.destroyed_[j].clone();
    }
    return rd;
  }
  
  /**
   * Physically destroys the data at the depth stored by this type.
   * Used to determine certain logical states.
   * @param {Number} depth
   */
  destroy<D extends number>(depth: D) {
    this.wipe();
    if (depth <= this.depth) {
      for (let i = depth; i <= this.depth; ++i) {
        this.destroyed_[i] = this.data_[i];
      }
      this.data_ = this.data_.slice(Depth.Document, depth) as ResolvedArray;
    }
  }
  
  /**
   * Wipes the saved nodes that were stored.
   * Iterators should call this when functions which contain logic are finished. Like seek.
   */
  wipe() {
    if (this === ResolvedData.NULL) {
      return;
    }
    if (this.destroyed_?.length) {
      this.destroyed_ = [];
    }
  }
  
  /**
   * Used to restore the physical data that was created from backup by 'destroy'
   */
  restore() {
    if (this === ResolvedData.NULL) {
      return;
    }
    for (const depth in this.destroyed_) {
      if (this.destroyed_[depth] && !this.data_[depth]) {
        this.data_[depth] = this.destroyed_[depth];
      }
    }
    this.wipe();
  }
  
  /**
   * Relative less than other. Check to see if a particular page/element index is less than other
   * No verification if the two Iterators are equal in structure
   * @param {ResolvedData} other
   * @param {Number} depth
   * @return {Boolean}
   */
  lt<D extends number>(other: ResolvedData, depth: D = this.depth as D) {
    depth = Math.min(depth, other.depth) as D;
    if (this.depth >= depth && depth > Depth.Document) {
      if (this.constructor === other.constructor) {
        let d: 1 = 1;
        let n: ResolvedNode, m: ResolvedNode;
        while (d <= depth) {
          n = this.getNode(d);
          m = other.getNode(d);
          if (n.index < m.index) {
            return true;
          } else {
            if (n.index > m.index) {
              return false;
            }
          }
          ++d;
        }
        return false;
      } else {
        return false;
      }
    } else {
      return false;
      //throw new Error('ResolvedException: Bad Depth');
    }
  }
  
  /**
   * Relative less than or equal to other. Check to see if a particular page/element index is less than or equal to other
   * No verification if the two Iterators are equal in structure
   * @param {ResolvedData} other
   * @param {Number} depth
   * @return {Boolean}
   */
  lte<D extends number>(other: ResolvedData, depth: D = this.depth as D) {
    if (this === other) {
      return true;
    }
    depth = Math.min(depth, other.depth) as D;
    if (this.depth >= depth && depth > Depth.Document) {
      if (this.constructor === other.constructor) {
        let d = 1;
        let n, m;
        while (d <= depth) {
          n = this.getNode(d);
          m = other.getNode(d);
          if (n.index < m.index) {
            return true;
          } else {
            if (n.index > m.index) {
              return false;
            }
          }
          ++d;
        }
        return n.index <= m.index;
      } else {
        return false;
      }
    } else {
      return false;
      //throw new Error('ResolvedException: Bad Depth');
    }
  }
  
  /**
   * Relative greator than other. Check to see if a particular page/element index is greater than other
   * No verification if the two Iterators are equal in structure
   * @param {ResolvedData} other
   * @param {Number} depth
   * @return {Boolean}
   */
  gt<D extends number>(other: ResolvedData, depth: D = this.depth as D) {
    depth = Math.min(depth, other.depth) as D;
    if (this.depth >= depth && depth > Depth.Document) {
      if (this.constructor === other.constructor) {
        let d = 1;
        let n, m;
        while (d <= depth) {
          n = this.getNode(d);
          m = other.getNode(d);
          if (n.index > m.index) {
            return true;
          } else {
            if (n.index < m.index) {
              return false;
            }
          }
          ++d;
        }
        return false;
      } else {
        return false;
      }
    } else {
      return false;
      //throw new Error('ResolvedException: Bad Depth');
    }
  }
  
  /**
   * Relative greator than or equal to other. Check to see if a particular page/element index is greater than or equal to other
   * No verification if the two Iterators are equal in structure
   * @param {ResolvedData} other
   * @param {Number} depth
   * @return {Boolean}
   */
  gte<D extends number>(other: ResolvedData, depth: D = this.depth as D) {
    if (this === other) {
      return true;
    }
    depth = Math.min(depth, other.depth) as D;
    if (this.depth >= depth && depth > Depth.Document) {
      if (this.constructor === other.constructor) {
        let d = 1;
        let n, m;
        while (d <= depth) {
          n = this.getNode(d);
          m = other.getNode(d);
          if (n.index > m.index) {
            return true;
          } else {
            if (n.index < m.index) {
              return false;
            }
          }
          ++d;
        }
        return n.index >= m.index;
      } else {
        return false;
      }
    } else {
      return false;
      //throw new Error('ResolvedException: Bad Depth');
    }
  }
  
  /**
   * Relative equal to other. Check to see if a particular page/element index is equal to other
   * @param {ResolvedData} other
   * @param {Number} depth
   * @return {Boolean}
   */
  eq<D extends number>(other: ResolvedData, depth: D = this.depth as D) {
    if (this === other) {
      return true;
    }
    depth = Math.min(depth, other.depth) as D;
    if (this.depth >= depth && depth > Depth.Document) {
      if (this.constructor === other.constructor) {
        let d = 1;
        let n, m;
        while (d <= depth) {
          n = this.getNode(d);
          m = other.getNode(d);
          if (n.index > m.index) {
            return false;
          } else {
            if (n.index < m.index) {
              return false;
            }
          }
          ++d;
        }
        return true;
      } else {
        return false;
      }
    } else {
      return false;
      //throw new Error('ResolvedException: Bad Depth');
    }
  }
}

if (process.env.NODE_ENV === 'development') {
  /**
   * Console Debugger visualization of the ResolvedData and what nodes it points to at each depth
   */
  ResolvedData.prototype['print'] = function () {
    let str = '';
    for (let i = 0; i < this.depth; ++i) {
      const node = this.getNode(i);
      const child = this.getNode(i + 1);
      str = (`${(child.index === 0 ? '' : `${child.index > 1 ? '0.. ' : '0, '}`)}`);
      str = (`${str}[${child.index}]`);
      str = (`${str}${(child.index === node.nodeCount - 1 ? '' : `${child.index < node.nodeCount - 2 ? ` ..${node.nodeCount - 1}` : `, ${node.nodeCount - 1}`}`)}`);
      str = (`Depth[${i + 1}]: ${str['padEnd'](20, ' ')}`);
      str = (`${str}\nNodeType@{i=${child.index}}: ${child.type.name}\nNodeAttrs@{i=${child.index}}: ${JSON.stringify(child.attrs)}`);
      console.log(str);
    }
  };
  /**
   * Checks ResolvedData for innaccuracy against some Transaction.
   * @param {!Transaction} tr
   * @param {Number?} opt_depth
   * @return {boolean}
   */
  ResolvedData.prototype['check'] = function (tr, opt_depth = this.depth) {
    let ResolvedPos, ResolvedNode, res = opt_depth >= 0;
    const chk = (depth) => {
      ResolvedNode = this.getNode(depth);
      ResolvedPos = ResolvedNode && tr.doc.resolve(ResolvedNode.start);
      return res && ResolvedPos && ResolvedPos.start() === ResolvedNode.start &&
        ResolvedPos.end() === ResolvedNode.end &&
        ResolvedPos.before() === ResolvedNode.before &&
        ResolvedPos.after() === ResolvedNode.after &&
        ResolvedPos.node() === ResolvedNode.PMNode;
    };
    try {
      for (let i = opt_depth; i >= 1; --i) {
        res = res && chk(i);
      }
      ResolvedNode = this.doc;
      ResolvedPos = ResolvedNode && tr.doc.resolve(ResolvedNode.start);
      res = res && ResolvedPos && ResolvedPos.start() === ResolvedNode.start &&
        ResolvedPos.end() === ResolvedNode.end &&
        ResolvedPos.node() === ResolvedNode.PMNode;
      return res;
    } catch (ex) {
      return false;
    }
  };
}
