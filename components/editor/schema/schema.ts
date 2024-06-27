import {
  Schema,
  Node,
  Node as ProsemirrorNode,
  Mark as ProsemirrorMark,
  DOMOutputSpec,
} from 'prosemirror-model';
import { AllAttrs } from '../../../types/prosemirrorTypes';
import * as _ from 'lodash';

const brDOM = ['br'];

// todo: is this proper typing?
const calcYchangeDomAttrs = (attrs: _.Dictionary<any> = {}, domAttrs: AllAttrs = {}) => {
  if (attrs.ychange !== null) {
    domAttrs.ychange_user = attrs.ychange.user;
    domAttrs.ychange_state = attrs.ychange.state;
    domAttrs.ychange_color = '#000000'
  }
  return domAttrs;
};

// :: NodeSpec The top level document node.
const doc = {
  // content: 'block+'
  content: 'sequence',
};

const sequence = {
  attrs: {
    name: { default: 'Untitled Sequence' },
  },
  parseDOM: [{
    tag: 'div.sequence',
    getAttrs: (node: HTMLElement) => ({
      id: node.getAttribute('id'),
    })
  }],
  content: 'page{1}',
  selectable: false,
  isolating: true,
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ['div', {
    id: node.attrs.id,
    class: 'sequence',
  }, 0],
  catalogDataType: 'sequence',
  hasCatalogChildren: true,  // indicate the node has child nodes that have catalog items (optimize)
  catalogNameAttr: 'name',
  menuLabel: 'Sequence',
  iconClass: 'sequence',
  isLockable: true,
  conventionTarget: () => 'sequence',
};

const page = {
  parseDOM: [{
    tag: 'div.page'
  }],
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ['div', {
    class: 'page'
  }, 0],
  content: 'block+',
  // content: 'block',
  selectable: false
};

// :: NodeSpec A plain paragraph textblock. Represented in the DOM
// as a `<p>` element.
const paragraph = {
  attrs: {
    id: { default: null as unknown as string },
    ychange: { default: null }
  },
  content: 'inline*',
  group: 'block',
  parseDOM: [{
    tag: 'p.paragraph',
    getAttrs: () => {} // this will be used to get attributes on the node element
  }],
  toDOM(node: ProsemirrorNode) {
    return ['p', Object.assign({ class: node.type.name }, calcYchangeDomAttrs(node.attrs)), 0];
  },
  placeholder: true,
};

const dialogue = {
  attrs: {
    id: { default: null as unknown as string },
    ychange: { default: null } },
  content: 'inline*',
  group: 'block',
  parseDOM: [{
    tag: 'p.paragraph',
    getAttrs: () => {} // this will be used to get attributes on the node element
  }],
  toDOM(node: ProsemirrorNode) {
    return ['p', Object.assign({ class: node.type.name }, calcYchangeDomAttrs(node.attrs)), 0];
  },
  placeholder: true,
};

const character = {
  attrs: {
    id: { default: null as unknown as string },
    ychange: {default: null }
  },
  content: 'inline*',
  group: 'block',
  parseDOM: [{ tag: 'p' }],
  toDOM(node: ProsemirrorNode) {
    return ['p', Object.assign({ class: node.type.name }, calcYchangeDomAttrs(node.attrs)), 0];
  },
  autoCompleteList: 'characterNames',
  autoCompleteType: 'characterNames',
  menuLabel: 'Character',
  isPrimary: true,
  isUpperCase: true,
  placeholder: true,
};

// :: NodeSpec A blockquote (`<blockquote>`) wrapping one or more blocks.
const blockquote = {
  attrs: { ychange: { default: null } },
  content: 'block+',
  group: 'block',
  defining: true,
  parseDOM: [{ tag: 'blockquote' }],
  toDOM(node: ProsemirrorNode) {
    return ['blockquote', calcYchangeDomAttrs(node.attrs), 0];
  }
};

// :: NodeSpec A horizontal rule (`<hr>`).
const horizontal_rule = {
  attrs: { ychange: { default: null } },
  group: 'block',
  parseDOM: [{ tag: 'hr' }],
  toDOM(node: ProsemirrorNode) {
    return ['hr', calcYchangeDomAttrs(node.attrs)];
  }
};

// :: NodeSpec A heading textblock, with a `level` attribute that
// should hold the number 1 to 6. Parsed and serialized as `<h1>` to
// `<h6>` elements.
const heading = {
  attrs: {
    level: { default: 1 },
    ychange: { default: null }
  },
  content: 'inline*',
  group: 'block',
  defining: true,
  parseDOM: [{ tag: 'h1', attrs: { level: 1 } },
    { tag: 'h2', attrs: { level: 2 } },
    { tag: 'h3', attrs: { level: 3 } },
    { tag: 'h4', attrs: { level: 4 } },
    { tag: 'h5', attrs: { level: 5 } },
    { tag: 'h6', attrs: { level: 6 } }],
  toDOM(node: ProsemirrorNode) {
    return ['h' + node.attrs.level, calcYchangeDomAttrs(node.attrs), 0];
  }
};

// :: NodeSpec A code listing. Disallows marks or non-text inline
// nodes by default. Represented as a `<pre>` element with a
// `<code>` element inside of it.
const code_block = {
  attrs: { ychange: { default: null } },
  content: 'text*',
  marks: '',
  group: 'block',
  code: true,
  defining: true,
  parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
  toDOM(node: ProsemirrorNode) {
    return ['pre', calcYchangeDomAttrs(node.attrs), ['code', 0]];
  }
};

// :: NodeSpec The text node.
const text = {
  group: 'inline'
};

// :: NodeSpec An inline image (`<img>`) node. Supports `src`,
// `alt`, and `href` attributes. The latter two default to the empty
// string.
const image = {
  inline: true,
  attrs: {
    ychange: { default: null },
    src: {},
    alt: { default: null },
    title: { default: null }
  },
  group: 'inline',
  draggable: true,
  parseDOM: [{
    tag: 'img[src]',
    getAttrs(dom: Element) {
      return {
        src: dom.getAttribute('src'),
        title: dom.getAttribute('title'),
        alt: dom.getAttribute('alt')
      };
    }
  }],
  toDOM(node: ProsemirrorNode) {
    const domAttrs = {
      src: node.attrs.src,
      title: node.attrs.title,
      alt: node.attrs.alt
    };
    return ['img', calcYchangeDomAttrs(node.attrs, domAttrs)];
  }
};

// :: NodeSpec A hard line break, represented in the DOM as `<br>`.
const hard_break = {
  inline: true,
  group: 'inline',
  selectable: false,
  parseDOM: [{ tag: 'br' }],
  toDOM() {
    return brDOM;
  }
};

// [Specs](#model.NodeSpec) for the nodes defined in this schema.
export const nodes = {
  doc,
  sequence,
  page,
  paragraph,
  dialogue,
  character,
  blockquote,
  horizontal_rule,
  heading,
  code_block,
  text,
  image,
  hard_break
};

const emDOM = ['em', 0];
const strongDOM = ['strong', 0];
const codeDOM = ['code', 0];

// :: Object [Specs](#model.MarkSpec) for the marks in the schema.
export const marks = {
  // :: MarkSpec A link. Has `href` and `title` attributes. `title`
  // defaults to the empty string. Rendered and parsed as an `<a>`
  // element.
  link: {
    attrs: {
      href: {},
      title: { default: null }
    },
    inclusive: false,
    parseDOM: [{
      tag: 'a[href]',
      getAttrs(dom: Element) {
        return { href: dom.getAttribute('href'), title: dom.getAttribute('title') };
      }
    }],
    toDOM(node: ProsemirrorNode) {
      return ['a', node.attrs, 0];
    }
  },

  // :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
  // Has parse rules that also match `<i>` and `font-style: italic`.
  em: {
    parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
    toDOM() {
      return emDOM;
    }
  },

  // :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
  // also match `<b>` and `font-weight: bold`.
  strong: {
    parseDOM: [{ tag: 'strong' },
      // This works around a Google Docs misbehavior where
      // pasted content will be inexplicably wrapped in `<b>`
      // tags with a font-weight normal.
      { tag: 'b', getAttrs: (node: HTMLElement) => node.style.fontWeight !== 'normal' && null },
      { style: 'font-weight', getAttrs: (value: string) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null }],
    toDOM() {
      return strongDOM;
    }
  },

  underline: {
    parseDOM: [{ tag: "u" }, {
      style: "text-decoration",
      getAttrs: (value: string) => value === "underline" && null
    }],
    toDOM: (mark: ProsemirrorMark, inline: boolean): DOMOutputSpec => ["span", { style: 'text-decoration: underline;' }]
  },

  strikethrough: {
    parseDOM: [{ tag: "del" }, { tag: "b" }, { style: "text-decoration: line-through" }],
    toDOM: (mark: ProsemirrorMark, inline: boolean): DOMOutputSpec => ["del"]
  },

  // :: MarkSpec Code font mark. Represented as a `<code>` element.
  code: {
    parseDOM: [{ tag: 'code' }],
    toDOM() {
      return codeDOM;
    }
  },
  ychange: {
    attrs: {
      user: { default: null },
      state: { default: null }
    },
    inclusive: false,
    parseDOM: [{ tag: 'ychange' }],
    toDOM(node: ProsemirrorNode) {
      return ['ychange', { ychange_user: node.attrs.user, ychange_state: node.attrs.state }, 0];
    }
  }
};

// :: Schema
// This schema rougly corresponds to the document schema used by
// [CommonMark](http://commonmark.org/), minus the list elements,
// which are defined in the [`prosemirror-schema-list`](#schema-list)
// module.
//
// To reuse elements from this schema, extend or read from its
// `spec.nodes` and `spec.marks` [properties](#model.Schema.spec).
/**
 * TODO: attempt to fix this later, I think prosemirror is actually typed wrong because this spits out nonsense
 * essentially it doesn't matter if we're using the correct type here (NodeSpec -> ParseDOM -> getAttrs(node: HTMLELement)
 * it still complains about a bunch of things
 */
// @ts-ignore
export const EditorSchema = new Schema({ nodes, marks });