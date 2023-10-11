

const calcYChangeStyle = ychange => {
  switch (ychange.type) {
    case 'removed':
      return `color:${ychange.color.dark}`
    case 'added':
      return `background-color:${ychange.color.light}`
    case null:
      return ''
  }
}

/**
 * @param {any} ychange
 * @param {Array<any>}
 */
const hoverWrapper = (ychange, els) =>
  ychange === null ? els : [['span', { class: 'ychange-hover', style: `background-color:${ychange.color.dark}` }, ychange.user || 'Unknown'], ['span', ...els]]


export const YChangeMark = {
  attrs: {
    user: { default: null },
    type: { default: null },
    color: { default: null }
  },
  inclusive: false,
  parseDOM: [{ tag: 'ychange' }],
  toDOM(mark: ProsemirrorMark) {
    return ['ychange', {
      ychange_user: mark.attrs.user,
      ychange_type: mark.attrs.type,
      style: calcYChangeStyle(mark.attrs),
      ychange_color: mark.attrs.color.light
    }, ...hoverWrapper(mark.attrs, [0])]
  }
}


const defaultGameAttributes = {
  id: { default: null as string },
  custom_id: { default: null as string }
};
const CXGameDoc = {
  content: "(cxsequence|cxinteractive)",
  selectable: false //So that select all from the browser level functionality is handled.
};
const CXGameSequence = {
  attrs: _.merge({
    name: { default: "Untitled Sequence" },
  }, defaultGameAttributes),
  parseDOM: [{
    tag: "div.sequence",
    getAttrs: dom => ({
      id: dom.getAttribute("id"),
      first: !!dom.getAttribute("first"),
      node_x: dom.getAttribute("node_x"),
      node_y: dom.getAttribute("node_y"),
      shape: dom.getAttribute("shape"),
      color: dom.getAttribute("color"),
    })
  }],
  content: "cxpage{1}",
  selectable: false,
  isolating: true,
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ["div", {
    id: node.attrs.id,
    class: 'sequence',
    node_x: node.attrs.node_x,
    node_y: node.attrs.node_y,
    shape: node.attrs.shape,
    color: node.attrs.color,
  }, 0],
  catalogDataType: 'sequence',
  hasCatalogChildren: true,  // indicate the node has child nodes that have catalog items (optimize)
  catalogNameAttr: 'name',
  menuLabel: 'Sequence',
  iconClass: 'sequence',
  isLockable: true,
  conventionTarget: () => "sequence",
};
const CXGameInteractiveDialog = {
  attrs: {
    id: { default: null },
    branch_ref: { default: null },
    name: { default: "" },
    node_x: { default: 0 },
    node_y: { default: 0 }
  },
  parseDOM: [{
    tag: "div.interactive",
    getAttrs: CXDefaults.getAttrs
  }],
  content: "cxinteractive_root{1}",
  selectable: false,
  isolating: true,
  group: "celtx",
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ["div", {
    id: node.attrs.id,
    class: `interactive`,
    contenteditable: "false"
  },
    ["div", { class: `${node.type.name}-network` }],
    ["div", { class: `${node.type.name}-content` }, 0]
  ],
  menuLabel: 'Interactive Dialogue',
  iconClass: 'int-dialog',
  conventionTarget: () => "interactive_branch",
};
const CXGameBranch = {
  attrs: _.merge({
    name: { default: "Untitled Branch", searchable: true },
    branchType: { default: "" },
    branchEndPoint: { default: null },
    desc: { default: "", searchable: true },
    sequence_ref: { default: null },
    sequence_color: { default: null },
    sequence_dashes: { default: null },
    linked: { default: [] },
    catalog_id: { default: null },
    node_x: { default: 0 },
    node_y: { default: 0 },
    level: { default: 0 },
    shape: { default: 'circle' },
    color: { default: '#5fc2d9' },
    dashes: { default: true },
    lock: { default: { isLocked: false, lockedBy: null, timestamp: null } }
  }, defaultGameAttributes),
  parseDOM: [{
    tag: "div.branch",
    getAttrs: CXDefaults.getAttrs
  }],
  selectable: true,
  isolating: false,
  draggable: true,
  group: "game",
  content: 'cxvoid',
  code: false,
  atom: false,
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => {
    let branch_links = [];
    if (node.attrs.linked) {
      for (let l in node.attrs.linked) {
        let link = node.attrs.linked[l];
        branch_links.push(['div', { class: 'branch-sequence' },
          ['div', {
            class: 'branch-sequence-name',
            style: `color: ${link.color}`
          }, link.name],
          ['div', { class: 'branch-sequence-desc' }, link.desc || ['br']]
        ]);
      }
    }
    const branchName = node.attrs.branchType === "prompt" ? "Choice" : node.attrs.name;
    return ["div", {
      id: node.attrs.id,
      class: "branch " + CXDefaults.element_class,
      contenteditable: "false"
    }, ["div", {
      class: "branch-name",
      style: `color: ${node.attrs.color}`
    }, branchName],
      ["div", { class: "branch-desc" }, node.attrs.desc],
      ["div", { class: "branch-delete-btn" }, ['i', { class: 'cxi-cancel_delete' }]],
      ["div", { class: "branch-links" }, ...branch_links],
      ["div", {
        class: `${node.type.name}-content`,
        style: "display: none;"
      }, 0]
    ]
  },
  // Custom celtx spec
  catalogDataType: 'branch',
  catalogNameAttr: 'name',
  catalogDescAttr: 'desc',
  menuLabel: 'Branch',
  iconClass: 'branch',
  isLockable: true,
  conventionTarget: () => "branch"
};
const CXJump = {
  attrs: _.merge({
    name: { default: "Untitled Jump", searchable: true },
    desc: { default: "", searchable: true },
    sequence_ref: { default: null },
    sequence_color: { default: null },
    sequence_dashes: { default: null },
    linked: { default: null },
    catalog_id: { default: null },
    node_x: { default: 0 },
    node_y: { default: 0 },
    shape: { default: 'dot' },
    color: { default: '#50c19c' },
    dashes: { default: true },
    lock: { default: { isLocked: false, lockedBy: null, timestamp: null } }
  }, defaultGameAttributes),
  parseDOM: [{
    tag: "div.jump",
    getAttrs: CXDefaults.getAttrs
  }],
  selectable: true,
  isolating: false,
  draggable: true,
  group: "game",
  content: 'cxvoid',
  code: false,
  atom: false,

  toDOM: (node: ProsemirrorNode): DOMOutputSpec => {
    let linked_sequence = [];
    if (node.attrs.linked && !_.isEmpty(node.attrs.linked)) {
      let link = node.attrs.linked;
      linked_sequence.push(['div', { class: 'jump-sequence' },
        ['div', {
          class: 'jump-sequence-name',
          style: `color: ${link.color}`
        }, link.name],
        ['div', { class: 'jump-sequence-desc' }, link.desc || ['br']]
      ]);
    }
    return ["div", {
      id: node.attrs.id,
      class: "jump " + CXDefaults.element_class,
      contenteditable: "false"
    }, ["div", {
      class: "jump-name",
      style: `color: ${node.attrs.sequence_color}`
    }, node.attrs.name],
      ["div", { class: "jump-desc" }, node.attrs.desc],
      ["div", { class: "jump-delete-btn" }, ['i', { class: 'cxi-cancel_delete' }]],
      ["div", { class: "jump-links" }, ...linked_sequence],
      ["div", {
        class: `${node.type.name}-content`,
        style: "display: none;"
      }, 0]
    ]
  },

  // Custom celtx spec
  catalogDataType: 'jump',
  catalogNameAttr: 'name',
  catalogDescAttr: 'desc',
  menuLabel: 'Jump',
  iconClass: 'jump',
  isLockable: true,
  conventionTarget: () => "jump",
};
const CXGameInteractiveBranch = {
  attrs: _.merge({
    name: { default: "Interactive Dialogue", searchable: true },
    desc: { default: "", searchable: true },
    linked: { default: [] },
    interactive_ref: { default: null },
    sequence_ref: { default: null },
    sequence_color: { default: null },
    catalog_id: { default: null },
    node_x: { default: 0 },
    node_y: { default: 0 },
    level: { default: 0 },
    shape: { default: 'circle' },
    color: { default: '#8363a8' },
    dashes: { default: false },
    lock: { default: { isLocked: false, lockedBy: null, timestamp: null } },
  }, defaultGameAttributes),
  parseDOM: [{
    tag: "div.interactive-branch",
    getAttrs: CXDefaults.getAttrs
  }],
  selectable: true,
  isolating: false,
  draggable: true,
  group: "game",
  content: 'cxvoid',
  code: false,
  atom: false,
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => {
    let linked_sequences = [];
    if (node.attrs.linked) {
      for (let l in node.attrs.linked) {
        let link = node.attrs.linked[l];
        linked_sequences.unshift(
          ["div", { class: "interactive-sequence" },
            ['div', { class: 'interactive-sequence-icon' }, ['i', {
              class: 'cxi-sequence',
              style: `color: ${link.color}`
            }]],
            ['div', { class: 'interactive-sequence-info' },
              ['div', {
                class: 'interactive-sequence-name',
                style: `color: ${link.color}`
              }, link.name],
              ['div', { class: 'interactive-sequence-desc' }, !_.isNil(link.desc) ? link.desc : ""]
            ]
          ]
        );
      }
    }
    return ["div", {
      id: node.attrs.id,
      class: "interactive-branch " + CXDefaults.element_class,
      contenteditable: "false",
    }, ["div", {
      class: "interactive-branch-name",
      style: `color: ${node.attrs.color}`
    }, node.attrs.name],
      ["div", { class: "interactive-branch-desc" }, node.attrs.desc],
      ["div", { class: "interactive-delete-btn" }, ['i', { class: 'cxi-cancel_delete' }]],
      ["div", { class: "interactive-branch-links" }, ...linked_sequences],
      ["div", {
        class: `${node.type.name}-content`,
        style: "display: none;"
      }, 0]
    ]
  },
  // Custom celtx spec
  catalogDataType: 'interactive-branch',
  catalogNameAttr: 'name',
  catalogDescAttr: 'desc',
  menuLabel: 'Branch',
  iconClass: 'branch',
  isLockable: true,
  conventionTarget: () => "interactive_branch"
};
const CXGameInteractiveDialogSequence = {
  attrs: _.merge({
    seqId: { default: null },
    seqName: { default: null, searchable: true },
    lock: { default: { isLocked: false, lockedBy: null, timestamp: null } }
  }, defaultGameAttributes),
  parseDOM: [{
    tag: "div.dialog-sequence",
    getAttrs: CXDefaults.getAttrs
  }],
  selectable: false,
  isolating: true,
  content: "id_content*",
  group: "id_content",
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ["div", {
    id: node.attrs.id,
    class: "dialog-sequence"
  }, 0],
  IDGroup: 'Sequence',
  font: {
    multi: 'html',
    mono: true,
    face: 'courier',
    size: 14,
    align: 'center'
  },
  isLockable: true,
};
const CXGameInteractiveDialogRoot = {
  attrs: _.merge({
    seqId: { default: null },
    seqName: { default: null }
  }, defaultGameAttributes),
  parseDOM: [{
    tag: "div.dialog-root",
    getAttrs: CXDefaults.getAttrs
  }],
  selectable: false,
  isolating: true,
  content: "cxinteractive_nonplayer{1}",
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ["div", {
    id: node.attrs.id,
    class: "dialog-root"
  }, 0],
  IDGroup: 'RootSequence',
  font: {
    multi: 'html',
    mono: true,
    face: 'courier',
    size: 14,
    align: 'center'
  }
};
const CXGameInteractiveDialogNonPlayer = {
  attrs: _.cloneDeep(defaultGameAttributes),
  parseDOM: [{
    tag: "div.dialog-non-player",
    getAttrs: CXDefaults.getAttrs
  }],
  selectable: false,
  isolating: true,
  content: "id_content*id_inner",
  group: "id_content",
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ["div", {
    id: node.attrs.id,
    class: "dialog-non-player"
  }, 0],
  IDGroup: 'NonPlayer',
  font: {
    multi: 'html',
    mono: true,
    face: 'courier',
    size: 14,
    align: 'center'
  }
};
const CXGameInteractiveDialogPlayer = {
  attrs: _.cloneDeep(defaultGameAttributes),
  parseDOM: [{
    tag: "div.dialog-player",
    getAttrs: CXDefaults.getAttrs
  }],
  selectable: false,
  isolating: true,
  content: "id_content*id_inner",
  group: "id_content",
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ["div", {
    id: node.attrs.id,
    class: `dialog-player`
  }, 0],
  IDGroup: 'Player',
  font: {
    multi: 'html',
    mono: true,
    face: 'courier',
    size: 14,
    align: 'center'
  }
};
const CXGameInteractiveDialogInner = {
  attrs: _.cloneDeep(defaultGameAttributes),
  parseDOM: [{
    tag: "div.dialog-inner",
    getAttrs: dom => ({
      id: dom.getAttribute("id")
    })
  }],
  selectable: false,
  isolating: true,
  content: "(cxcharacter|cxparenthetical|cxdialog)+",
  group: "id_inner",
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ["div", {
    id: node.attrs.id,
    class: `dialog-inner`
  }, 0]
};
const CXGamePage = {
  parseDOM: [{
    tag: "div.page"
  }],
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ["div", {
    class: 'page'
  }, 0],
  content: "game+",
  group: "page",
  selectable: false
};
const CXGameplay = _.merge({
  attrs: _.merge({
    catalog_id: { default: null as string },
    counter: { default: null as number },
    customIDData: { default: {} as object },
    ychange: { default: null as any },
  }, defaultGameAttributes),
  parseDOM: [{
    tag: "p.gameplay",
    getAttrs: CXDefaults.getAttrs
  }],
  toDOM: CXDefaults.toGameDOM,
  // Custom celtx spec
  menuLabel: 'Gameplay',
  placeholder: true,
  conventionTarget: () => "gameplay",
}, CXDefaults.game_paragraph_properties);
const CXDirective = _.merge({
  attrs: _.merge({
    catalog_id: { default: null as string },
    counter: { default: null },
    customIDData: { default: {} },
    ychange: { default: null },
  }, defaultGameAttributes),
  parseDOM: [{
    tag: "p.directive",
    getAttrs: CXDefaults.getAttrs
  }],
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ['p', {
    id: node.attrs.id,
    class: `${node.type.name.substr(2)} ${CXDefaults.element_class}`
  },
    ['span', {
      class: `${node.type.name}-left`,
      contenteditable: "false"
    }, ['span', { class: `${node.type.name}-left-bracket` }, '[']],
    ['span', { class: `${node.type.name}-content` }, 0],
    ['span', {
      class: `${node.type.name}-right`,
      contenteditable: "false"
    }, ['span', { class: `${node.type.name}-right-bracket` }, ']']]
  ],
  // Custom celtx spec
  menuLabel: 'Directive',
  placeholder: true,
  conventionTarget: () => "directive",
}, CXDefaults.game_paragraph_properties);
const CXParenthetical = _.merge({
  attrs: _.merge({
    counter: { default: null },
    customIDData: { default: {} },
  }, defaultGameAttributes),
  parseDOM: [{
    tag: "p.parenthetical",
    getAttrs: CXDefaults.getAttrs
  }],
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ['p', {
    id: node.attrs.id,
    class: `${node.type.name.substr(2)} ${CXDefaults.element_class}`
  },
    ['span', {
      class: `${node.type.name}-left`,
      contenteditable: "false"
    }, ['span', { class: `${node.type.name}-left-bracket` }, '(']],
    ['span', { class: `${node.type.name}-content` }, 0],
    ['span', {
      class: `${node.type.name}-right`,
      contenteditable: "false"
    }, ['span', { class: `${node.type.name}-right-bracket` }, ')']]
  ],
  // Custom celtx spec
  menuLabel: 'Parenthetical',
  placeholder: true,
  conventionTarget: () => "parenthetical",
}, CXDefaults.game_paragraph_properties);
const CXDialog = _.merge({
  attrs: _.merge(_.cloneDeep(defaultGameAttributes), {
    counter: { default: null },
    customIDData: { default: {} },
  }),
  parseDOM: [{
    tag: "p.dialog",
    getAttrs: CXDefaults.getAttrs
  }],
  toDOM: CXDefaults.toGameDOM,
  // Custom celtx spec
  menuLabel: 'Dialogue',
  placeholder: true,
  conventionTarget: () => "dialog",
}, CXDefaults.game_paragraph_properties);
const CXCharacter = _.merge({
  attrs: _.merge({
    catalog_id: { default: null as string }
  }, CXDefaults.autocomplete_paragraph_attributes, defaultGameAttributes),
  parseDOM: [{
    tag: "p.character",
    getAttrs: CXDefaults.getAttrs
  }],

  toDOM: CXDefaults.toGameDOM,

  // Custom celtx spec
  autoCompleteList: 'characterNames',
  autoCompleteType: 'characterNames',
  // catalogDataType: 'character',
  catalogAutoPopulate: false,
  catalogOverride: true, //Disable certain portions of the massive handler in gemCatalog
  menuLabel: 'Character',
  isPrimary: true,
  isUpperCase: true,
  placeholder: true,
  conventionTarget: () => "character",
}, CXDefaults.game_paragraph_properties);
const CXCharacterItem = _.merge({
  attrs: _.merge({
    catalog_id: { default: null as string }
  }, CXDefaults.autocomplete_paragraph_attributes, defaultGameAttributes),
  selectable: false,
  contenteditable: false,
  parseDOM: [{
    tag: "p.character_item",
    getAttrs: dom => (_.merge(CXDefaults.getAttrs, {
      catalog_id: dom.getAttribute("catalog_id")
    })),
  }],
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ["p", {
    id: node.attrs.id,
    catalog_id: node.attrs.catalog_id,
    class: `${node.type.name.substr(2)} ${'el'}`
  },
    ['span', {
      class: `${node.type.name}-content`,
    }, 0],
    ['span', {
      class: `${node.type.name}-id`,
    }],
  ],
  // Custom celtx spec
  autoCompleteList: 'characterNames',
  autoCompleteType: 'characterNames',
  catalogDataType: 'character_item',
  catalogAutoPopulate: false,
  catalogOverride: true, //Disable certain portions of the massive handler in gemCatalog
  menuLabel: 'Character',
  isPrimary: true,
  isUpperCase: true,
  placeholder: true,
  conventionTarget: () => "character_item",
}, CXDefaults.game_paragraph_properties);
const CXDualDialog = {
  attrs: _.cloneDeep(defaultGameAttributes),
  parseDOM: [{
    tag: "div.dualdialog",
    getAttrs: CXDefaults.getAttrs
  }],
  group: "game",
  content: "cxdualdialogchild{2}",
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ["div", {
    id: node.attrs.id,
    class: `${node.type.name.substr(2)} ${CXDefaults.element_class}`
  }, 0],
  menuLabel: 'Dual-Dialogue',
  placeholder: true
};
const CXDualDialogChild = {
  parseDOM: [{
    tag: "div.dualdialogchild",
    getAttrs: dom => ({})
  }],
  content: '((cxcharacter_item | cxcharacter){1}(cxparenthetical | cxdialog)*) | (cxdialog | cxparenthetical)*',
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ["div", {
    class: `${node.type.name.substr(2)} ${CXDefaults.element_class}`
  }, 0],
  menuLabel: 'Dual-Dialogue'
};
const CXVoid = {
  selectable: false,
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ["div", {
    class: 'void'
  }]
};
const CXCatalog = {
  selectable: false,
  content: "cxcatalog_item*",
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ["div", {
    class: `${node.type.name.substr(2)}`
  }, 0]
};
const CXCatalogItem = {
  selectable: false,
  attrs: {
    id: { default: null },
    title: { default: null, searchable: true },
    type: { default: null },
    item_data: { default: {}, searchable: true },
    customVars: { default: [], searchable: true },
    lock: { default: { isLocked: false, lockedBy: null, timestamp: null } },
    custom_id: { default: null },
    counter: { default: null },
    customIDData: { default: {} },
  },
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ["div", {
    id: node.attrs.id,
    class: `${node.type.name.substr(2)}`,
    title: node.attrs.title,
    type: node.attrs.type
  }, JSON.stringify(node.attrs.item_data, null, 2)],
  isLockable: true,
  conventionTarget: (node) => {
    return node.attrs.type;
  }
}
const CXTemplate = {
  selectable: false,
  content: "cxtemplate_item*",
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ["div", {
    class: `${node.type.name.substr(2)}`
  }, 0]
};
const CXTemplateItem = {
  selectable: false,
  attrs: {
    id: { default: null },
    name: { default: "Unnamed Template" },
    N_ids: { default: 0 },
    N_names: { default: 0 },
    item_data: { default: "" }
  },
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ["div", {
    id: node.attrs.id,
    class: `${node.type.name.substr(2)}`,
    name: node.attrs.name,
    type: node.attrs.type
  }, 0]
};
const CXMetaData = {
  selectable: false,
  content: "cxcatalog{1}cxtemplate{1}cxconditions{1}cxconventions?",
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ['metadata', {
    contentEditable: "false"
  }, 0]
};
const CXConventions = {
  selectable: false,
  attrs: {
    items: { default: {} },
  },
  content: "cxvoid",
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ["div", {
    class: `${node.type.name.substr(2)}`
  }, 0]
};
/* Game related marks */
const CXBreakdownMark = {
  attrs: {
    id: { default: null as null | string },
    catalog_id: { default: null as null | string },
    custom_id: { default: null as null | string },
    type: { default: null as null | string },
    instance_desc: { default: null as null | string, searchable: true },
    design_notes: { default: null as null | string, searchable: true },
    dev_notes: { default: null as null | string, searchable: true },
    media: { default: null as null | string }
  },
  parseDOM: [{ tag: 'span.breakdown' }],
  toDOM: (mark: ProsemirrorMark): DOMOutputSpec => ["span", {
    id: mark.attrs.id,
    class: `breakdown ${mark.attrs.type}`
  }],
  inclusive: false,
  conventionTarget: (mark: ProsemirrorMark) => {
    return mark.attrs.type;
  }
};
const CXMultiTagBreakdownMark = {
  // look for TBreakdownItemAttrsMarkType for attrs mark type
  attrs: {
    id: { default: null as null | string },
    assetList: { default: [] as string[] },
    name: { default: null as null | string },
    parent_ref: { default: null as null | string },
    type: { default: null as null | string },
  },
  parseDOM: [{
    tag: 'span.multiTagBreakdown',
    getAttrs: dom => {
      const id = dom.id || null;
      const classes = dom.getAttribute('class') || "";
      const type = /\S+ \S+/i.test(classes) && classes.split(" ").pop() || null;
      const catalog_id = dom.getAttribute('catalog_id') || null;
      const assetList = dom.getAttribute('assetList').split(',') || [];
      return { id, type, catalog_id, assetList };
    }
  }],
  toDOM: (mark: ProsemirrorMark) => {
    return ["span", {
      id: mark.attrs.id,
      class: `multiTagBreakdown ${mark.attrs.type}`,
      assetList: mark.attrs.assetList,
    }]
  },
  inclusive: false,
  conventionTarget: (mark: ProsemirrorMark) => {
    return mark.attrs.type;
  }
};
const CXConditions = {
  selectable: false,
  attrs: {
    variables: { default: [], searchable: true }
  },
  content: "cxcondition_item*",
  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ["div", {
    class: `${node.type.name.substr(2)}`
  }, 0]
};
const CXConditionItem = {
  selectable: false,
  attrs: {
    id: { default: null },
    catalog_id: { default: null },
    name: { default: null, searchable: true },
    desc: { default: null, searchable: true },
    literals: { default: null, searchable: true },
    clause: { default: null },
    on: { default: [] }, //array to support re-use of conditions
    lock: { default: { isLocked: false, lockedBy: null, timestamp: null } }
  },

  toDOM: (node: ProsemirrorNode): DOMOutputSpec => ["div", {
    class: `${node.type.name.substr(2)}`,
  }, 0],

  // Custom celtx spec
  catalogDataType: 'condition',
  catalogNameAttr: 'name',
  catalogDescAttr: 'desc',
  menuLabel: 'Condition',
  iconClass: 'condition',
  isLockable: true,
  conventionTarget: () => "condition",
};
const CXStrikethroughMark = {
  parseDOM: [{ tag: "del" }, { tag: "b" }, { style: "text-decoration: line-through" }],
  toDOM: (mark: ProsemirrorMark, inline: boolean): DOMOutputSpec => ["del"]
};

const shared = CXBaseSchema.SPEC;
const nodes = {
  doc: CXGameDoc,
  cxmetadata: CXMetaData,
  cxcatalog: CXCatalog,
  cxcatalog_item: CXCatalogItem,
  cxtemplate: CXTemplate,
  cxtemplate_item: CXTemplateItem,
  cxconventions: CXConventions,
  cxpage: CXGamePage,
  cxsequence: CXGameSequence,
  cxinteractive: CXGameInteractiveDialog,
  cxinteractive_root: CXGameInteractiveDialogRoot,
  cxinteractive_nonplayer: CXGameInteractiveDialogNonPlayer,
  cxinteractive_player: CXGameInteractiveDialogPlayer,
  cxinteractive_sequence: CXGameInteractiveDialogSequence,
  cxinteractive_inner: CXGameInteractiveDialogInner,
  cxgameplay: CXGameplay,
  cxcharacter: CXCharacter,
  cxcharacter_item: CXCharacterItem,
  cxdialog: CXDialog,
  cxparenthetical: CXParenthetical,
  cxdirective: CXDirective,
  cxdualdialog: CXDualDialog,
  cxdualdialogchild: CXDualDialogChild,
  cxbranch: CXGameBranch,
  cxinteractive_branch: CXGameInteractiveBranch,
  cxjump: CXJump,
  cxnote: shared.nodes.cxnote,
  cxmedia: shared.nodes.cxmedia,
  cxconditions: CXConditions,
  cxcondition_item: CXConditionItem,
  cxvoid: CXVoid,
  text: shared.nodes.text,
  hard_break: shared.nodes.hard_break,
}
const marks = {
  cxbreakdown: CXBreakdownMark, //DO NOT CHANGE ORDERING
  cxmultitagbreakdown: CXMultiTagBreakdownMark,
  cxcomment: shared.marks.cxcomment,
  em: shared.marks.em,
  strong: shared.marks.strong,
  underline: shared.marks.underline,
  strikethrough: CXStrikethroughMark,
  ychange: YChangeMark,
}

export namespace CXGVRSchema {
  export const SPEC = {
    nodes,
    marks
  }
  export type TNodes = typeof SPEC.nodes;
  export type KNodes = keyof TNodes;
  export type TMarks = typeof SPEC.marks;
  export type KMarks = keyof TMarks;
  export type KElements = Extract<KNodes, "cxgameplay" | "cxcharacter" | "cxdirective" | "cxcharacter" | "cxcharacter_item" | "cxparenthetical" | "cxdialog">
  export class Class extends CXBaseSchema.Class<TNodes, TMarks> {
    private static serializer_: CXGEMJSONSerializer;
    private static parser_: CXGEMDOMParser;
    constructor(s = SPEC) {
      super(s);
    }

    /**
     * @return {CXScriptEditorType}
     */
    static get Type() {
      return super.Types.GAME;
    }

    static get MIMEType() {
      return super.MIMETypes.GAME;
    }

    static get Serializer() {
      if (!this.serializer_) {
        this.serializer_ = celtxGEMSerializer(this.Schema);
      }
      return this.serializer_;
    }

    static get Parser() {
      if (!this.parser_) {
        this.parser_ = celtxGEMParser(this.Schema);
      }
      return this.parser_;
    }

    static override get Nodes() {
      return this.Schema.nodes;
    }

    static override get Marks() {
      return this.Schema.marks;
    }

    static override get Json() {
      return this.Schema.json;
    }

    static override get Schema() {
      return super.Schema as Class;
    }
  }
  export type NodeTypes = PMNodeTypes<Class>;
  export type NodeType<K extends keyof NodeTypes> = PMNodeType<Class, K>;
  export type NodeAttrsType<K extends keyof NodeTypes> = PMNodeAttrsType<Class, K>;

  export type MarkTypes = PMMarkTypes<Class>;
  export type MarkType<K extends keyof MarkTypes> = PMMarkType<Class, K>;
  export type MarkAttrsType<K extends keyof MarkTypes> = PMMarkAttrsType<Class, K>;
}