import * as _ from "lodash";
var global = globalThis

function singleRect(object, bias) {
  let rects = object.getClientRects();
  return !rects.length ? object.getBoundingClientRect() : rects[bias < 0 ? 0 : rects.length - 1]
}

function textRange(node: ChildNode, from?: number, to?: number) {
  let range = document.createRange();
  range.setEnd(node, _.isNil(to) ? node.nodeValue.length : to);
  range.setStart(node, from || 0);
  return range
}

function findOffsetInText(node, coords) {
  let len = node.nodeValue.length;
  let range = document.createRange();
  for (let i = 0; i < len; i++) {
    range.setEnd(node, i + 1);
    range.setStart(node, i);
    let rect = singleRect(range, 1);
    if (rect.top === rect.bottom) {
      continue
    }
    if (rect.left - 1 <= coords.left && rect.right + 1 >= coords.left &&
      rect.top - 1 <= coords.top && rect.bottom + 1 >= coords.top) {
      return {
        node: node,
        offset: i + (coords.left >= (rect.left + rect.right) / 2 ? 1 : 0)
      }
    }
  }
  return {
    node: node,
    offset: 0
  }
}

function findOffsetInNode(node: ChildNode, coords: Partial<DOMRect>) {
  let closest: ChildNode;
  let dxClosest: number = 2e8;
  let coordsClosest: Partial<DOMRect>;
  let offset: number = 0;
  let rowBot: number = coords.top;
  let rowTop: number = coords.top;
  for (let child = node.firstChild, childIndex = 0; child; child = child.nextSibling, childIndex++) {
    let rects: DOMRectList;
    if (child.nodeType === document.ELEMENT_NODE) {
      rects = (child as Element).getClientRects();
    } else if (child.nodeType === document.TEXT_NODE) {
      rects = textRange(child).getClientRects();
    } else {
      continue;
    }

    for (let i = 0; i < rects.length; i++) {
      let rect = rects[i];
      if (rect.top <= rowBot && rect.bottom >= rowTop) {
        rowBot = Math.max(rect.bottom, rowBot);
        rowTop = Math.min(rect.top, rowTop);
        let dx = rect.left > coords.left ? rect.left - coords.left
          : rect.right < coords.left ? coords.left - rect.right : 0;
        if (dx < dxClosest) {
          closest = child;
          dxClosest = dx;
          coordsClosest = dx && closest.nodeType === 3 ? {
            left: rect.right < coords.left ? rect.right : rect.left,
            top: coords.top
          } : coords;
          if (child.nodeType === 1 && dx) {
            offset = childIndex + (coords.left >= (rect.left + rect.right) / 2 ? 1 : 0);
          }
          continue
        }
      }
      if (!closest && (coords.left >= rect.right && coords.top >= rect.top ||
        coords.left >= rect.left && coords.top >= rect.bottom)) {
        offset = childIndex + 1;
      }
    }
  }
  if (closest && closest.nodeType === 3) {
    return findOffsetInText(closest, coordsClosest)
  }
  if (!closest || (dxClosest && closest.nodeType === 1)) {
    return {
      node: node,
      offset: offset
    }
  }
  return findOffsetInNode(closest, coordsClosest)
}

function posFromElement(view, elt, coords) {
  if (!view.dom.contains(elt.nodeType !== 1 ? elt.parentNode : elt)) {
    return null
  }

  let ref = findOffsetInNode(elt, coords);
  let node = ref.node;
  let offset = ref.offset;
  let bias = -1;
  if (node.nodeType === 1 && !node.firstChild) {
    let rect = node.getBoundingClientRect();
    bias = rect.left !== rect.right && coords.left > (rect.left + rect.right) / 2 ? 1 : -1;
  }
  return view.docView.posFromDOM(node, offset, bias)
}

/**
 * Copied from Prosemirror. Do not change.
 * @param {EditorView} view
 * @param {HTMLElement} dom
 */
function captureCopy(view, dom) {
  // The extra wrapper is somehow necessary on IE/Edge to prevent the
  // content from being mangled when it is put onto the clipboard
  let doc = view.dom.ownerDocument;
  let wrap = doc.body.appendChild(doc.createElement("div"));
  wrap.appendChild(dom);
  wrap.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let sel = getSelection(), range = doc.createRange();
  range.selectNodeContents(dom);
  // Done because IE will fire a selectionchange moving the selection
  // to its start when removeAllRanges is called and the editor still
  // has focus (which will mess up the editor's selection state).
  view.dom.blur();
  sel.removeAllRanges();
  sel.addRange(range);
  setTimeout(() => {
    doc.body.removeChild(wrap);
    view.focus()
  }, 50)
}

let BROWSER = null;
/**
 * Copied from Prosemirror. Do not change.
 * @return {{ie: boolean, mac: boolean, ie_version: *, gecko: boolean, chrome: boolean, ios: boolean, webkit: boolean, safari: boolean}}
 */
function platform() {
  var userAgent = navigator.userAgent;
  var browserName = "Unknown";
  var browserVersion = "Unknown";

  if (userAgent.indexOf("Firefox") > -1) {
    browserName = "Mozilla Firefox";
    // Extract Firefox version from the user agent string
    browserVersion = userAgent.substring(userAgent.indexOf("Firefox") + 8);
  } else if (userAgent.indexOf("Chrome") > -1) {
    browserName = "Google Chrome";
    // Extract Chrome version from the user agent string
    browserVersion = userAgent.substring(userAgent.indexOf("Chrome") + 7);
  } else if (userAgent.indexOf("Safari") > -1) {
    browserName = "Apple Safari";
    // Extract Safari version from the user agent string
    browserVersion = userAgent.substring(userAgent.indexOf("Version") + 8);
  } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident/") > -1) {
    browserName = "Internet Explorer";
    // Detect IE version from the user agent string
    if (userAgent.indexOf("MSIE") > -1) {
      browserVersion = userAgent.substring(userAgent.indexOf("MSIE") + 5);
    } else {
      browserVersion = userAgent.substring(userAgent.indexOf("rv:") + 3);
    }
  }

  return browserName;
}

function brokenClipboardAPI() {
  let browser = platform();
  return browser && (browser.ie && browser.ie_version < 15 || browser.ios && browser.webkit_version < 604);
}

export const UnusedUtils = {
  posFromElement,
  captureCopy,
  platform,
  brokenClipboardAPI
};

if (process.env.NODE_ENV === "development") {
  global.$PMUtils = UnusedUtils;
}