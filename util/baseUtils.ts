import { v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash';
import { Point, Rectangle } from './mathUtils';
import crypto from 'crypto';

/**
 * Generates a random UUID using the uuidv4 library
 */
export const generateId = () => {
  return uuidv4(); // a formality
};

/**
 * Capitalize the first letter of each word in a string
 * @param str
 */
export const capitalizeEachWord = (str: string) => {
  return str.split(' ').map((word) => {
    return word[0].toUpperCase() + word.slice(1);
  }).join(' ');
};

export function buildQuery(url: string, params: { [key: string]: any }) {
  let parsedUrl = url + '?';
  let paramKeys = Object.keys(params);

  paramKeys.forEach((key, index) => {
    let paramValue = params[key] ? params[key] : '';
    let paramStringForQuery = `${key}=${paramValue}`;
    let isLast = index === paramKeys.length - 1;
    parsedUrl = `${parsedUrl}${paramStringForQuery}${isLast ? '' : '&'}`;
  })

  return parsedUrl;
}
/**
 * Make draggable function with optional boundaries, and options for creating a dynamically updating
 * scrollable (or variable height; like the breakdown items) element
 * when dragging occurs (so the area doesn't go below the viewport);
 * @param {string} dragEl
 * @param {string | string[]} triggerEls
 * @param {object} opt_containerSelectors keep the draggable element within certain box boundaries
 *  left, right, top, bottom
 * all boundary numbers need to be pixel units
 * @param {function?} opt_callback opt_callback a callback function to execute on a drag mouse up events
 */
export function makeDraggable(dragSelector: string, opt_triggerSelectors: _.Many<string> = null, opt_containerSelectors: _.Many<string> = null, opt_callback: (top: string) => void = _.stubObject) {
  const dragEl = document.querySelector<HTMLElement>(dragSelector);
  const triggerSelectors = _.compact(_.castArray(opt_triggerSelectors)).join(", ");
  const containerSelectors = _.compact(_.castArray(opt_containerSelectors)).join(", ");
  const triggerEls = _.isEmpty(triggerSelectors) ? [] : Array.from(document.querySelectorAll<HTMLElement>(triggerSelectors));

  const OFFSET = {
    TOP: 0,
    LEFT: 0
  };

  let BOUNDARY = new Rectangle(document.body.getBoundingClientRect());
  function onMouseDown(e: MouseEvent) {
    const TARGET = e.target as HTMLElement;
    if (!_.some(triggerEls, triggerEl => triggerEl.className.includes(TARGET.className))) {
      return;
    }
    const containerEls = _.isEmpty(containerSelectors) ? [] : Array.from(document.querySelectorAll<HTMLElement>(containerSelectors));
    if (!_.isEmpty(containerEls)) {
      const RECTANGLES = _.map(_.concat(containerEls, document.body), element => new Rectangle(element.getBoundingClientRect()));
      const CORNERS = _.map(RECTANGLES, r => r.Corners).flat();
      const VALUES = {
        X: _.map(CORNERS, c => c.x),
        Y: _.map(CORNERS, c => c.y)
      };
      const AVERAGE = {
        X: _.sum(VALUES.X) / _.size(VALUES.X),
        Y: _.sum(VALUES.Y) / _.size(VALUES.Y)
      }
      const [LEFT, RIGHT, TOP, BOTTOM] = [
        _.filter(VALUES.X, X => X <= AVERAGE.X),
        _.filter(VALUES.X, X => X >= AVERAGE.X),
        _.filter(VALUES.Y, Y => Y <= AVERAGE.Y),
        _.filter(VALUES.Y, Y => Y >= AVERAGE.Y)
      ];
      BOUNDARY = new Rectangle({
        left: _.max(LEFT),
        right: _.min(RIGHT),
        top: _.max(TOP),
        bottom: _.min(BOTTOM)
      });
    }
    const DRAG = new Rectangle(dragEl.getBoundingClientRect());
    OFFSET.LEFT = e.clientX - DRAG.Left;
    OFFSET.TOP = e.clientY - DRAG.Top;
    e.preventDefault();
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("pointerup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
  }

  function onMouseMove(e: MouseEvent) {
    e.preventDefault();
    const CHANGED = {
      HORIZONTAL: false,
      VERTICAL: false
    };
    const SIZE = new Point(dragEl.offsetWidth, dragEl.offsetHeight);
    const [LEFT, TOP, RIGHT, BOTTOM] = [
      e.clientX - OFFSET.LEFT,
      e.clientY - OFFSET.TOP,
      e.clientX - OFFSET.LEFT + SIZE.x,
      e.clientY - OFFSET.TOP + SIZE.y
    ];
    switch (true) {
      case TOP > BOUNDARY.Top && BOTTOM < BOUNDARY.Bottom:
        dragEl.style.top = `${TOP}px`;
        CHANGED.VERTICAL = true;
        break;
      case TOP <= BOUNDARY.Top:
        dragEl.style.top = `${BOUNDARY.Top}px`;
        CHANGED.VERTICAL = true;
        break;
      case BOTTOM >= BOUNDARY.Bottom:
        dragEl.style.top = `${BOUNDARY.Bottom - SIZE.y}px`;
        CHANGED.VERTICAL = true;
        break;
    }
    switch (true) {
      case LEFT > BOUNDARY.Left && RIGHT < BOUNDARY.Right:
        dragEl.style.left = `${LEFT}px`;
        CHANGED.HORIZONTAL = true;
        break;
      case LEFT <= BOUNDARY.Left:
        dragEl.style.left = `${BOUNDARY.Left}px`;
        CHANGED.HORIZONTAL = true;
        break;
      case RIGHT >= BOUNDARY.Right:
        dragEl.style.left = `${BOUNDARY.Right - SIZE.x}px`;
        CHANGED.HORIZONTAL = true;
        break;
    }
    if (CHANGED.HORIZONTAL || CHANGED.VERTICAL) {
      const STYLE = {
        get BOTTOM() { return dragEl.style.bottom; },
        set BOTTOM(v: string) { dragEl.style.bottom = v; },
        get RIGHT() { return dragEl.style.right; },
        set RIGHT(v: string) { dragEl.style.right = v; }
      };
      if (CHANGED.VERTICAL && STYLE.BOTTOM !== "initial") {
        STYLE.BOTTOM = 'initial';
      }
      if (CHANGED.HORIZONTAL && STYLE.RIGHT !== "initial") {
        STYLE.RIGHT = 'initial';
      }
    }
  }

  function onMouseUp(e: MouseEvent)  {
    /* stop moving when mouse button is released */
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("pointerup", onMouseUp);
    if (opt_callback) {
      opt_callback(dragEl.style.top);
    }
  }

  if (triggerEls) {
    /* if present, the header is where you move the DIV from:*/
    _.each(triggerEls, el => {
      el.onmousedown = onMouseDown;
      el.onmouseup = onMouseUp;
    })
  }
}

export function isValidEmail(str: string) {
  const VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return !!str.match(VALID_EMAIL_REGEX);
}

// write a function that converts postgres timestamp to javascript date
export function convertDateFormat(inputDate: Date) {
  const date = new Date(inputDate);

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  return date.toLocaleString('en-US', options);
}

// give a string, generate a color based on it
export function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const c = (hash & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();

  return '#' + '00000'.substring(0, 6 - c.length) + c;
}


export const hashPassword = (password: string = '', opt_salt?: string) => {
  const salt = opt_salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
};

export const sortObjectArrayByDate = (array: object[], key: string, asc: boolean) => {
  array.sort((a, b) => {
    const dateA = new Date(a[key]);
    const dateB = new Date(a[key]);
    if (asc) {
      return dateA.getTime() - dateB.getTime();
    } else {
      return dateB.getTime() - dateA.getTime();
    }
  });
};

export function debounce(func: () => void, delay: number) {
  let timeoutId;

  return function() {
    const context = this;
    const args = arguments;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

export function isDescendant(child, parent) {
  let node = child.parentNode;

  while (node !== null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }

  return false;
}

export function clone_safe_null (value, key, object, stack) {
  if (_.isNil(value)) {
    return null;
  }
}

export function stringToHexColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const normalizedHash = (hash >>> 0) / (2**32 - 1);

  const r = Math.floor(normalizedHash * 255);
  const g = Math.floor(normalizedHash * 255);
  const b = Math.floor(normalizedHash * 255);

  // Convert RGB values to hexadecimal
  const hexR = r.toString(16).padStart(2, '0');
  const hexG = g.toString(16).padStart(2, '0');
  const hexB = b.toString(16).padStart(2, '0');

  // Concatenate the hex values
  const hexColor = `#${hexR}${hexG}${hexB}`;

  return hexColor;
}