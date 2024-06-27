import { EditorView } from 'prosemirror-view';
import { DOMSerializer, Node } from 'prosemirror-model';

export class BaseNodeView {
  dom: HTMLElement;
  contentDOM: HTMLElement | null;
  node: Node;
  type: string;
  editorView: EditorView;

  get DOM() {
    return this.dom;
  }

  get ContentDOM() {
    return this.contentDOM;
  }

  get View() {
    return this.editorView;
  }

  get Node() {
    return this.node;
  }

  get Type() {
    return this.type;
  }

  constructor(node: Node, view: EditorView) {
    this.node = node;
    this.type = this.node.type.name;
    this.editorView = view;
    this.dom = this.createDOM();
    this.contentDOM = this.node.type.isInline || this.node.type.name == 'comment' ? null : this.dom.querySelector(`.${this.type}-content`) || this.dom;

    if (this.Node.type.spec.placeholder) {
      if (this.Node.content.size && this.DOM.classList.contains('placeholder')) {
        this.DOM.classList.remove('placeholder');
      } else if (!this.node.content.size && !this.DOM.classList.contains('placeholder')) {
        this.DOM.classList.add('placeholder');
      }
    }
  }

  createDOM() {
    const schema = this.editorView.state.schema;

    // what does this do?
    if (!schema.cached.domSerializer) {
      schema.cached.domSerializer = DOMSerializer.fromSchema(schema);
    }

    const isMark = schema.marks[this.type];

    if (isMark) {
      const mark = schema.marks[this.type].create(this.node.attrs);
      return schema.cached.domSerializer.serializeMark(mark);
    } else {
      const node = schema.nodes[this.type].create(this.node.attrs, this.node.content);
      return schema.cached.domSerializer.serializeNode(node);
    }
  }

  create() {
    this.ContentDOM && (this.ContentDOM.innerHTML = '');
    return {
      dom: this.DOM,
      contentDOM: this.ContentDOM,
      update: (node: Node) => this.update(node),
      destroy: () => this.destroy(),
      ignoreMutation: (record: any) => this.ignore(record)
    };
  }

  update(node: Node) {
    let result = false;
    const prev = this.node;
    const next = node || prev;
    if (next) {
      //I'm assuming the usual case, we clone attrs everytime.
      // TODO: this is causing issues with the placeholder text, I think because id is null this.Type used to be this.type and always return false
      result = this.Type === next.type.name;
      if (result && (prev !== next || prev.attrs !== next.attrs)) {
        this.node = next;
        if (this.Node.attrs.id) {
          this.DOM.id !== this.Node.attrs.id && (this.DOM.id = this.Node.attrs.id);
        } else {
          this.DOM.removeAttribute('id');
        }

      }
    }

    if (result) {
      if (this.Node.type.spec.placeholder) {
        if (this.Node.content.size && this.DOM.classList.contains('placeholder')) {
          this.DOM.classList.remove('placeholder');
        } else if (!this.Node.content.size && !this.DOM.classList.contains('placeholder')) {
          this.DOM.classList.add('placeholder');
        }
      } else {
        if (this.DOM.classList.contains('placeholder')) {
          this.DOM.classList.remove('placeholder');
        }
      }
    }

    // if (this.innerView) {
    //   let state = this.innerView.state
    //   let start = node.content.findDiffStart(state.doc.content)
    //   if (start != null) {
    //     let {a: endA, b: endB} = node.content.findDiffEnd(state.doc.content)
    //     let overlap = start - Math.min(endA, endB)
    //     if (overlap > 0) { endA += overlap; endB += overlap }
    //     this.innerView.dispatch(
    //       state.tr
    //         .replace(start, endB, node.slice(start, endA))
    //         .setMeta("fromOutside", true))
    //   }
    // }

    return result;
  }

  ignore(record?: MutationRecord) {
    return false;
  }

  destroy() {
  }
}