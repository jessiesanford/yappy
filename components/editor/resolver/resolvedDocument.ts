import { Node as ProsemirrorNode, ResolvedPos } from 'prosemirror-model';

export class ResolvedDocument {
  private readonly before_ = null;
  private readonly after_ = null;
  private readonly index_ = null;
  protected node_: ProsemirrorNode | undefined;
  private start_: number | undefined;
  private end_: number | undefined;
  /**
   * ResolvedDocument type
   * @param {ResolvedPos|ResolvedDocument|null} pos
   */
  constructor(pos: ResolvedPos | ResolvedDocument = null) {
    if (pos) {
      if (pos instanceof ResolvedPos) {
        this.node_ = pos.path[0];
        this.start_ = 0;
        this.end_ = pos.path[0].content.size;
      } else if (pos instanceof ResolvedDocument) {
        this.node_ = pos.node_;
        this.start_ = pos.start_;
        this.end_ = pos.end_;
      } else {
        throw new Error('Invalid Input');
      }
    }
  }
  
  /**
   * The number of children that the ProsemirrorNode actually has.
   * @variation 1
   * @return {Number}
   */
  get childCount() {
    return this.PMNode ? this.PMNode.childCount: -1;
  }
  
  /**
   * Return the number of children in a node that are all guaranteed to be nodes and not text/brs/etc.
   * @variation 1
   * @return {Number}
   */
  get nodeCount() {
    return this.childCount;
  }
  
  /**
   * @see ProsemirrorNode.attrs
   * @return {ProsemirrorNode.attrs|null}
   */
  get attrs() {
    return this.PMNode ? this.PMNode.attrs : null;
  }
  
  /**
   * @see ProsemirrorNode.type
   * @return {ProsemirrorNode.type|null}
   */
  get type() {
    return this.PMNode ? this.PMNode.type : null;
  }
  
  /**
   * @see ProsemirrorNode.content
   * @return {ProsemirrorNode.content|null}
   */
  get content() {
    return this.PMNode ? this.PMNode.content : null;
  }
  
  /**
   * @see ProsemirrorNode.textContent
   * @return {ProsemirrorNode.textContent|null}
   */
  get textContent() {
    return this.PMNode ? this.PMNode.textContent : null;
  }
  
  /**
   * return the Document node pointed to by this data type
   * @return {ProsemirrorNode}
   */
  get PMNode() {
    return this.node_;
  }
  
  /**
   * return the start position of the node.
   * This position is the start of the document, always 0.
   * @return {Number}
   */
  get start() {
    return this.start_;
  }
  
  /**
   * Set the document start position this data represents
   * Should be considered private
   * @param {Number} pos
   */
  set start(pos: number) {
    this.start_ = pos;
  }
  
  /**
   * return the end position of the node.
   * This position is the end of the document.
   * @return {Number}
   */
  get end() {
    return this.end_;
  }
  
  /**
   * Set the document end position this data represents
   * Should be considered private
   * @param {Number} pos
   */
  set end(pos: number) {
    this.end_ = pos;
  }
  
  /**
   * Set the shallow node reference this data represents
   * Should be considered private
   * @param {ProsemirrorNode} n
   */
  set node(n: ProsemirrorNode) {
    this.node_ = n;
  }
  
  /**
   * @see ProsemirrorNode.child
   * @return {ProsemirrorNode|null}
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
   * Return a clone of this data. Nodes are shallow, numbers are deep.
   * @return {ResolvedDocument}
   */
  clone() {
    return new ResolvedDocument(this);
  }
}