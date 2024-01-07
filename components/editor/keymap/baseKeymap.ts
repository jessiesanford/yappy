import * as _ from 'lodash';
import { chainCommands, exitCode, toggleMark } from 'prosemirror-commands';
import { redo, undo } from 'prosemirror-history';
import { UnusedUtils } from '../utils/unusedUtils';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { KeyStroke } from '../../../static/enums';

/*
  Ctrl = Ctrl on Windows
  Control = Control on Mac
  Shift = Shift on Windows & Mac
  Alt = Alt on Windows
  Alt = Option on Mac
  Mod = Command/Meta on Mac
  Mod = Ctrl on Windows
*/

/**
 * Add key strokes that are not handled which can cause problems here
 * @type {string[]}
 */
const BLOCKED_KEYS = [
  //Windows
  'Ctrl-Delete',         //Deletes an entire element
  'Ctrl-Backspace',      //Deletes an entire element
  'Shift-Insert',        //Is a paste
  'Shift-Delete',        //Is a cut
  'Shift-Backspace',     //Unnecessary blocking?
  'Ctrl-Insert',         //Is a copy
  //Mac
  'Control-h',           //Backspace
  'Control-d',           //Delete
  'Alt-Delete',          //Delete entire words
  'Alt-Backspace',       //Backspace entire words
  'Control-k',           //Delete text to end of line
  'Mod-Delete',          //Delete
  'Mod-Backspace',       //Backspace
  'Control-Alt-Delete'   //Delete
];

export class BaseKeymap {
  constructor(schema: Schema) {
    this.block_(BLOCKED_KEYS);
    // if (browser.mac) {
    //   //For Selenium tests.
    //   this.unblock_(["Shift-Insert", "Ctrl-Delete", "Ctrl-Insert"]);
    // }
    this.bind_(KBCmd.Create(KeyStroke.Z, undo, Modifier.MOD));
    this.bind_(KBCmd.Create(KeyStroke.Z, redo, [Modifier.SHIFT, Modifier.MOD]));
    this.bind_(KBCmd.Create(KeyStroke.S, onSaveRequest, Modifier.MOD));
    // this.bind_(KBCmd.Create(KeyStroke.P, onPrintRequest, browser.mac ? Modifier.MOD : Modifier.CTRL));
    // if (!browser.mac) this.bind_(KBCmd.Create(KeyStroke.Y, redo, Modifier.MOD));
    if (schema.marks.strong) {
      this.bind_(KBCmd.Create(KeyStroke.B, toggleMark(schema.marks.strong), Modifier.MOD, true));
    }
    if (schema.marks.em) {
      this.bind_(KBCmd.Create(KeyStroke.I, toggleMark(schema.marks.em), Modifier.MOD, true));
    }
    if (schema.marks.underline) {
      this.bind_(KBCmd.Create(KeyStroke.U, toggleMark(schema.marks.underline), Modifier.MOD, true));
    }
    if (schema.nodes.hard_break) {
      const cmd = chainCommands(exitCode, onHardBreak);
      this.bind_(KBCmd.Create(KeyStroke.ENTER, cmd, Modifier.MOD));
      this.bind_(KBCmd.Create(KeyStroke.ENTER, cmd, Modifier.SHIFT));
      // if (browser.mac) {
      //   this.bind_(KBCmd.Create(KeyStroke.ENTER, cmd, Modifier.CONTROL));
      // }
    }
  }

  /**
   * Bind a command to a key sequence
   * Blocked keybinds will be ignored when binding.
   * Trying to bind twice will produce an error.
   * @param {Array<String>|Array<KBCmd>|String|KBCmd} obj
   * @param {function=} CMD
   * @protected
   */
  bind_(obj: _.Many<string | KBCmd>, CMD?: Function) {
    switch (true) {
      case obj.constructor === KBCmd:
        const OBJ = obj as KBCmd;
        this.bind_(OBJ.Keybinds, OBJ.Command || CMD);
        break;
      case obj.constructor === Array:
        const ARR = _.castArray(obj);
        for (const Key in ARR) {
          this.bind_(ARR[Key], CMD);
        }
        break;
      case obj.constructor === String:
        const Key = obj as string;
        const mapped = this[Key];
        if (mapped === false) return;
        if (mapped && mapped !== Prevent) {
          throw new KeybindException(`Concurrent mapping; ${Key}`);
        }
        this[Key] = CMD;
        break;
      case !CMD:
        throw new KeybindException('Missing Parameter; No function passed');
      default:
        throw new KeybindException('Bad or Missing Parameter; Must be Array or String');
    }
  }

  /**
   * Rebinds a command to a key sequence
   * Blocked keybinds will be ignored when binding.
   * Previously binded keys will be ignored.
   * @param {Array<String>|Array<KBCmd>|String|KBCmd} obj
   * @param {function=} CMD
   * @protected
   */
  rebind_(obj, CMD?) {
    this.unbind_(obj);
    this.bind_(obj, CMD);
  }

  /**
   * These keys will be blocked from being used in the editor.
   * @param {Array<String>|String} obj
   * @protected
   * @constant
   */
  block_(obj) {
    this.bind_(obj, Prevent);
  }

  /**
   * Unbind a key sequence or array of key sequences.
   * @param {Array<String>|String|KBCmd} obj
   * @protected
   */
  unbind_(obj) {
    switch (true) {
      case obj.constructor === KBCmd:
        this.unbind_(obj.Keybinds);
        break;
      case obj.constructor === Array:
        for (const Key in obj) {
          this.unbind_(obj[Key]);
        }
        break;
      case obj.constructor === String:
        delete this[obj];
        break;
      default:
        throw new KeybindException('Bad or Missing Parameter; Must be Array or String');
    }
  }

  /**
   * Unblock a key sequence or array of key sequences
   * @param {Array<String>|String} obj
   * @protected
   */
  unblock_(obj) {
    this.unbind_(obj);
  }
}

/**
 * @return {boolean}
 */
function Prevent() {
  return true;
};

class KeybindException extends Error {
  /**
   *
   * @param {String?} message
   */
  constructor(message: string) {
    super(message);
  }
}

export class KBCmd {
  private key_: KeyStroke;
  private case_: boolean;
  private meta_: boolean;
  private modifier_: string[];
  private cmd_: (state: EditorState, dispatch: EditorView['dispatch'], view?: EditorView) => void;

  /**
   * @return {string | Array<string>}
   */
  get Keybinds() {
    if (_.chain(null).thru(val => val && val.length === 1).plant(this.key_).value()) {
      if (this.case_) {
        const upper = _.join([...this.modifier_, this.key_.toUpperCase()], '-');
        const lower = _.join([...this.modifier_, this.key_.toLowerCase()], '-');
        if (upper === lower) {
          return upper;
        } else {
          return [upper, lower];
        }
      } else {
        return _.join([...this.modifier_, this.key_.toLowerCase()], '-');
      }
    } else {
      return _.join([...this.modifier_, this.key_], '-');
    }
  }

  /**
   *
   * @return {function}
   */
  get Command() {
    if (this.meta_ && this.cmd_) {
      const base = _.join([...this.modifier_, this.key_], '-');
      return (state: EditorState, dispatch: EditorView['dispatch'], view: EditorView) => this.cmd_(state, tr => dispatch(tr.setMeta('KeyStroke', base)), view);
    }
    return this.cmd_;
  }

  /**
   *
   * @param {KeyStroke} KEY
   * @param {function(state: EditorState, function(tr: Transaction):*, view: EditorView, event=):*=} opt_CMD
   * @param {Modifier[]=} opt_MODS
   * @param {boolean=} opt_case
   * @param {boolean=} opt_meta
   */
  constructor(KEY: KeyStroke, opt_CMD: any = null, opt_MODS: _.Many<Modifier> = [], opt_case: boolean = false, opt_meta: boolean = true) {
    const i = _.findKey(KeyStroke, _.partial(_.isEqual, KEY, _.partial.placeholder));
    if (i) {
      /**
       *
       * @type {string}
       * @private
       */
      this.key_ = KeyStroke[i];
      /**
       * If true, the generated output will contain two keybinds if necessary.
       * One for uppercase, One for lowercase
       * @type {boolean}
       * @private
       */
      this.case_ = opt_case;
      /**
       * If true, the CMD will be wrapped in a lambda that sets meta to be the keybinding.
       * @type {boolean}
       * @private
       */
      this.meta_ = opt_meta;
      /**
       * @type {Array<string>}
       * @private
       */
      this.modifier_ = [];
      /**
       * @type {Function}
       * @private
       */
      this.cmd_ = opt_CMD;
      this.Modifiers(..._.castArray(opt_MODS));
    } else {
      throw new KeybindException('Unknown KeyStroke');
    }
  }

  /**
   *
   * @param {KeyStroke} KEY
   * @param {function(EditorState, (function(tr: Transaction):void)?, EditorView?, Event?):*=} opt_CMD
   * @param {Modifier[]=} opt_MODS
   * @param {boolean=} opt_case
   * @param {boolean=} opt_meta
   */
  static Create(KEY: KeyStroke, opt_CMD: any = null, opt_MODS: _.Many<Modifier> = [], opt_case: boolean = false, opt_meta: boolean = true) {
    return new this(KEY, opt_CMD, opt_MODS, opt_case, opt_meta);
  }


  /**
   *
   * @param {...Modifier[]} M
   * @returns
   */
  Modifiers(...M: Modifier[]) {
    const MODS = _.chain([]).concat(...M).compact().filter(MOD => _.some(Modifier, VAL => _.isEqual(VAL, MOD))).value();
    if (_.isEmpty(MODS) && !_.isEmpty(M)) {
      throw new KeybindException('Unknown Mod');
    } else {//!MODS || M
      this.modifier_.push(...MODS);
    }
    return this;
  }

  /**
   * @param {boolean} truthy
   * @return {KBCmd}
   */
  Case(truthy: boolean) {
    this.case_ = truthy || false;
    return this;
  }

  /**
   *
   * @param {Modifier|Array.<Modifier|String>} Mods
   * @param {Function=} opt_CMD
   * @param {boolean=} opt_case
   * @param {boolean=} opt_meta
   * @return {KBCmd}
   */
  Clone(Mods: _.Many<Modifier>, opt_CMD = this.cmd_, opt_case: boolean = this.case_, opt_meta: boolean = this.meta_) {
    return new KBCmd(this.key_, opt_CMD, Mods, opt_case, opt_meta);
  }

}

enum Modifier {
  SHIFT = 'Shift',
  CONTROL = 'Control',
  ALT = 'Alt',
  MOD = 'Mod',
  CTRL = 'Control',
  OPTION = 'Alt',
  COMMAND = 'Mod',
  META = 'Mod'
}

const DefaultModifiers = [];

// if (browser.mac) {
//   DefaultModifiers.push(Modifier.MOD);
//   if (browser.safari) {
//     DefaultModifiers.push(Modifier.CONTROL)
//   }
// }

DefaultModifiers.push(Modifier.CONTROL);


function onSaveRequest(state: EditorState, dispatch: EditorView['dispatch'], view: EditorView) {
  return true;
}

function onHardBreak(state: EditorState, dispatch: EditorView['dispatch']) {
  dispatch(state.tr.replaceSelectionWith(state.schema.nodes.hard_break.create({})).scrollIntoView());
  return true;
}
export {Modifier, DefaultModifiers, KeyStroke};
