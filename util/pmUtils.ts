import { ResolvedData } from '../components/editor/resolver/resolvedData';
import { BaseIterator, EditorDepth } from '../components/editor/resolver/baseIterator';
import { TextSelection, Transaction } from 'prosemirror-state';
import { Mark, Node, Fragment,  } from 'prosemirror-model';
import { yCursorPluginKey } from "y-prosemirror";
import { EditorSchema } from '../components/editor/schema/schema';
import { clone_safe_null, generateId } from './baseUtils';
import * as _ from 'lodash';

export function safeDeleteSelection(tr: Transaction, predicate: (data: ResolvedData) => boolean) {
  let iter = new BaseIterator(tr, tr.selection.$to, EditorDepth.Element);
  let from, to;
  let result = false;
  let selection = tr.selection;
  let fromPos = selection.from;
  let toPos = selection.to;
  if (selection.$from.node().type === EditorSchema.nodes.character_item) {
    fromPos = selection.$from.before();
  }
  if (selection.$to.node().type === EditorSchema.nodes.character_item) {
    toPos = selection.$to.after();
  }
  let all = isAllSelection(tr, predicate);
  do {
    if (predicate(iter.data)) {
      from = iter.element.start + Math.max(0, fromPos - iter.element.start);
      to = iter.element.start + Math.min(iter.element.content.size, iter.element.content.size - iter.element.end + toPos);
      if (from >= iter.element.start && to <= iter.element.end) {
        let delta = to - from;
        if (delta === iter.element.content.size && fromPos < from) {
          tr.deleteRange(from - 1, to + 1);
        }
        else if (delta !== 0) {
          tr.deleteRange(from, to);
        } else {
          //Nope
        }
        result = true;
      }
    }
  } while (iter.prev(EditorDepth.Element) && (iter.element.start >= fromPos || fromPos >= iter.element.start && fromPos <= iter.element.end));
  iter.update(fromPos, tr);
  if (all) {
    if (predicate(iter.data)) {
      tr.setNodeMarkup(
        iter.element.before,
        iter.element.type,
        mergeAttrs(iter.PMNode(EditorDepth.Element), { id: generateId() })
      );
    } else {
      tr.insert(iter.element.before, EditorSchema.nodes.action.createAndFill({ id: generateId() }));
      tr.setSelection(TextSelection.create(tr.doc, iter.element.before + 1));
    }
  }
  tr.setMeta('safe_delete', true);
  return result;
}

/**
 * "AllSelection" meaning there is nothing else that can be selected before or after the current selection based
 * on the predicate returning true for things that are allowed to be selected logically.
 * Branch style nodes do not get selected the same way as other nodes. The overridden AllSelection keybind
 * only selects as much as the predicate allows, assuming the same predicate is shared across all functionality.
 * @param {Transaction} tr
 * @param {function(x: ResolvedData): boolean} predicate
 * @returns {{from: number, to: number} | null}
 */
function isAllSelection(tr: Transaction, predicate: (data: ResolvedData) => boolean) {
  let { from, to } = tr.selection;
  switch (true) {
    case tr.selection instanceof TextSelection:
      let iter = new BaseIterator(tr, tr.selection.$from, 3);
      if (tr.selection.$from.start(3) === tr.selection.$from.pos && predicate(iter.data)) {
        if (iter.hasPrev(EditorDepth.Element)) {
          iter.prev(EditorDepth.Element);
          do {
            if (predicate(iter.data)) {
              return null;
            }
          } while (iter.hasPrev(EditorDepth.Element) && iter.prev(EditorDepth.Element));
        }
      } else {
        return null;
      }
      from = iter.element.start;
      iter = new BaseIterator(tr, tr.selection.$to, 3);
      if (tr.selection.$to.end(3) === tr.selection.$to.pos && predicate(iter.data)) {
        if (iter.hasNext(EditorDepth.Element)) {
          iter.next(EditorDepth.Element);
          do {
            if (predicate(iter.data)) {
              return null;
            }
          } while (iter.hasNext(EditorDepth.Element) && iter.next(EditorDepth.Element));
        }
      } else {
        return null;
      }
      to = iter.element.end;
      return { from, to };
    default:
      return null;
  }
}

function Clone(object) {
  if (object) {
    switch (true) {
      case _.isBoolean(object):
      case _.isNumber(object):
      case _.isString(object):
        return object.constructor(object);
      case object instanceof Node:
        if (object.type === object.type.schema.nodes.doc) {
          return _.merge(
            object.type.schema.nodeFromJSON(JSON.parse(JSON.stringify(object.toJSON()))),
            { attrs: Clone(object.attrs) }
          );
        }
        return object.type.schema.nodeFromJSON(JSON.parse(JSON.stringify(object.toJSON())));
      case object instanceof Mark:
        return object.type.schema.markFromJSON(JSON.parse(JSON.stringify(object.toJSON())));
      case object instanceof Fragment:
        if (object.size) {
          return Fragment.fromJSON(object.firstChild.type.schema, JSON.parse(JSON.stringify(object.toJSON())));
        } else {
          return Fragment.empty;
        }
      case object instanceof Array:
        return _.transform<any, any[]>(object, (T, V) => {
          return (T.push(Clone(V)), true);
        });
      default:
      case _.isObjectLike(object):
        return _.transform(object, (T, V, K) => {
          return (T[K] = Clone(V), true);
        });
    }
  } else {
    return _.cloneWith(object, clone_safe_null);
  }
}

const attrs_safe_null = (objValue, srcValue) => {
  switch (true) {
    case !_.isNil(objValue) && !_.isNil(srcValue):
      return _.clone(srcValue);
    case _.isNil(objValue) && _.isNil(srcValue):
    case !_.isNil(objValue) && _.isNull(srcValue):
      return null;
  }
};

/**
 * Clones node.attrs and returns an object with new attrs assigned into the object.
 * Works like Object.assign, but, Recursively.
 * Ensures that no attrs contain Null fields by calling Clone on them.
 * @param {ProsemirrorNode} node
 * @param {Object=} attrs
 * @return {Object|null}
 */
export function mergeAttrs(node: Node, attrs: _.Dictionary<any> = {}) {
  if (node instanceof Node) {
    return _.mergeWith(Clone(node.attrs), attrs, attrs_safe_null);
  } else {
    return null;
  }
}

/**
 *
 * Returns true if the transaction only had cursor updates
 * @export
 * @param {Transaction} tr
 */
export function isOnlyCollabCursorUpdate(tr: Transaction) {
  if (tr.docChanged) return false;
  const cursorMeta = tr.getMeta(yCursorPluginKey);
  return Boolean(cursorMeta && cursorMeta.awarenessUpdated);
}