import { EditorView } from 'prosemirror-view';
import { DOMSerializer, Node } from 'prosemirror-model';

export class BaseNodeView {
  _dom: HTMLElement;
  _contentDOM: HTMLElement | null;
  _node: Node;
  _type: string;
  _editorView: EditorView;

  get DOM() {
    return this._dom;
  }

  get contentDOM() {
    return this._contentDOM;
  }

  get View() {
    return this._editorView;
  }

  get Node() {
    return this._node;
  }

  get Type() {
    return this._type;
  }

  constructor(node: Node, view: EditorView, getPos?: () => number | undefined) {
    this._node = node;
    this._type = this._node.type.name;
    this._editorView = view;
    this._dom = this.createDOM();
    this._contentDOM = this._node.type.isInline || this._node.type.name == 'comment' ? null : this._dom.querySelector(`.${this._type}-content`) || this._dom;

    if (this.Node.type.spec.placeholder) {
      if (this.Node.content.size && this.DOM.classList.contains('placeholder')) {
        this.DOM.classList.remove('placeholder');
      } else if (!this._node.content.size && !this.DOM.classList.contains('placeholder')) {
        this.DOM.classList.add('placeholder');
      }
    }
  }

  createDOM() {
    const schema = this._editorView.state.schema;

    // what does this do?
    if (!schema.cached.domSerializer) {
      schema.cached.domSerializer = DOMSerializer.fromSchema(schema);
    }

    const isMark = schema.marks[this._type];

    if (isMark) {
      const mark = schema.marks[this._type].create(this._node.attrs);
      return schema.cached.domSerializer.serializeMark(mark);
    } else {
      const node = schema.nodes[this._type].create(this._node.attrs, this._node.content);
      return schema.cached.domSerializer.serializeNode(node);
    }
  }

  create() {
    // if (this.config_.listeners) {
    //   this.addListeners_();
    // } //This function should not be overriden
    this.contentDOM && (this.contentDOM.innerHTML = '');
    return {
      dom: this.DOM,
      contentDOM: this.contentDOM,
      update: (node: Node) => this.update(node),
      destroy: () => this.destroy(),
      ignoreMutation: (record: any) => this.ignore(record)
    };
  }

  update(node: Node) {
    let result = false;
    this.prev_ = this.node_;
    let next_ = node || this.prev_;
    if (next_) {
      //I'm assuming the usual case, we clone attrs everytime.
      result = this.type === next_.type.name;
      if (result && (this.prev_ !== next_ || this.prev_.attrs !== next_.attrs)) {
        this.node_ = next_;
        if (this.node_.attrs.id) {
          this.DOM.id !== this.node_.attrs.id && (this.DOM.id = this.node_.attrs.id);
        } else {
          this.DOM.removeAttribute('id');
        }

      }
    }
    return result;
  }

  ignore(record?) {
    return false;
  }

  destroy() {
  }
}