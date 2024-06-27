import { ResolvedChildren } from "./resolvedChildren";
import { Node as ProsemirrorNode, ResolvedPos } from "prosemirror-model";
/**
 * Resolved nodes depth > 0
 */
export class ResolvedNode {
  private node_: ProsemirrorNode | null;
  private index_: number;
  private before_: number;
  private start_: number;
  private end_: number;
  private after_: number;
  /**
   * ResolvedPage type
   * @param {ResolvedPos|ResolvedNode|undefined?} pos
   * @param {Number?} depth
   */
  constructor(pos?: ResolvedPos | ResolvedNode, depth: number = 0) {
    if (pos) {
      if (pos instanceof ResolvedNode) {
        this.node_ = pos.node_;
        this.index_ = pos.index_;
        this.before_ = pos.before_;
        this.start_ = pos.start_;
        this.end_ = pos.end_;
        this.after_ = pos.after_;
      } else if (pos instanceof ResolvedPos && depth > 0) {
        let offset = 3 * (depth - 1);
        this.node_ = pos.path[3 + offset];
        this.index_ = pos.path[1 + offset];
        this.before_ = pos.path[2 + offset];
        this.start_ = this.before_ + 1;
        this.end_ = this.start_ + pos.path[3 + offset].content.size;
        this.after_ = this.end_ + 1;
      } else {
        this.node_ = this.index_ = this.before_ = this.start_ = this.end_ = this.after_ = null;
      }
    } else {
      this.node_ = this.index_ = this.before_ = this.start_ = this.end_ = this.after_ = null;
    }
  }
  
  /**
   * @see ProsemirrorNode.attrs
   * @return {Object.<String, *>|null}
   */
  get attrs() {
    return this.PMNode ? this.PMNode.attrs : null;
  }
  
  /**
   * @see ProsemirrorNode.type
   * @return {NodeType|null}
   */
  get type() {
    return this.PMNode ? this.PMNode.type : null;
  }
  
  /**
   * @see ProsemirrorNode.content
   * @return {Fragment|null}
   */
  get content() {
    return this.PMNode ? this.PMNode.content : null;
  }
  
  /**
   * @see ProsemirrorNode.textContent
   * @return {string|null}
   */
  get textContent() {
    return this.PMNode ? this.PMNode.textContent : null;
  }
  
  /**
   * Return the number of children in a node
   * @variation 2
   * @return {Number}
   */
  get childCount() {
    return this.PMNode ? this.PMNode.childCount : -1;
  }
  
  /**
   * Return the number of children in a node that are all guaranteed to be nodes and not text/brs/etc.
   * Guaranteed traversable nodes. Otherwise access directly using other means.
   * @variation 2
   * @return {Number}
   */
  get nodeCount() {
    // there was a conditional in here (&& ResolvedChildren[this.PMNode.type.name]) I don't think it serves a purpose
    return this.PMNode ? this.PMNode.childCount : -1;
  }
  
  /**
   * Return the node pointed to by this data type
   * @return {ProsemirrorNode}
   */
  get PMNode() {
    return this.node_;
  }
  
  /**
   * Set the shallow node reference this data represents
   * Should be considered private
   * @param {ProsemirrorNode} n
   */
  set PMNode(n: ProsemirrorNode) {
    this.node_ = n;
  }
  
  /**
   * return the index of this node in the depth it is located in.
   * @return {Number}
   */
  get index() {
    return this.index_;
  }
  
  /**
   * Sets the index of the node this data represents
   * Should be considered private
   * @param {Number} i
   */
  set index(i: number) {
    this.index_ = i;
  }
  
  /**
   * return the position before the node.
   * @return {Number}
   */
  get before() {
    return this.before_;
  }
  
  /**
   * Set the node before position this data represents
   * Should be considered private
   * @param {Number} pos
   */
  set before(pos: number) {
    this.before_ = pos;
  }
  
  /**
   * return the start position of the node.
   * @return {Number}
   */
  get start() {
    return this.start_;
  }
  
  /**
   * Set the node end position this data represents
   * Should be considered private
   * @param {Number} pos
   */
  set start(pos: number) {
    this.start_ = pos;
  }
  
  /**
   * return the end position of the node.
   * @return {Number}
   */
  get end() {
    return this.end_;
  }
  
  /**
   * Set the node end position this data represents
   * Should be considered private
   * @param {Number} pos
   */
  set end(pos) {
    this.end_ = pos;
  }
  
  /**
   * return the position after the node.
   * @return {Number}
   */
  get after() {
    return this.after_;
  }
  
  /**
   * Set the node after position this data represents
   * Should be considered private
   * @param {Number} pos
   */
  set after(pos: number) {
    this.after_ = pos;
  }
  
  /**
   *
   * @return {ProsemirrorNode}
   */
  get firstChild() {
    return this.PMNode ? this.PMNode.firstChild : null;
  }
  
  /**
   *
   * @return {ProsemirrorNode}
   */
  get lastChild() {
    return this.PMNode ? this.PMNode.lastChild : null;
  }
  
  /**
   * @see ProsemirrorNode.child
   * @return {ProsemirrorNode}
   */
  child(index: number) {
    return this.PMNode ? this.PMNode.child(index) : null;
  }
  
  /**
   * @see ProsemirrorNode.maybeChild
   * @return {ProsemirrorNode|null}
   */
  maybeChild(index: number) {
    return this.PMNode ? this.PMNode.maybeChild(index) : null;
  }
  
  /**
   * Return a clone of this data. Nodes are shallow, numbers are deep.
   * @return {ResolvedNode}
   */
  clone() {
    return new ResolvedNode(this);
  }
}