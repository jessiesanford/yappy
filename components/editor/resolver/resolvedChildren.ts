/**
 * This class contains static accessors to all the nodes which contain content that can be
 * iterated into.
 */
export class ResolvedChildren {
  /**
   * Every editor has a doc node and there is only one of them
   * @return {boolean}
   */
  static get doc() {
    return true;
  }
  
  /**
   * Some editors have a cxpage node
   * @return {boolean}
   */
  static get cxpage() {
    return true;
  }
  
  /**
   * Some editors have a cxdualdialog node
   * @return {boolean}
   */
  static get cxdualdialog() {
    return true;
  }
  
  /**
   * An editor that has a cxdualdialog node most likely should have a cxdualdialogchild
   * @return {boolean}
   */
  static get cxdualdialogchild() {
    return true;
  }
  
  /**
   * The gem editor has a node called cxsequence which contains nodes
   * @return {boolean}
   */
  static get cxsequence() {
    return true;
  }

  static get cxav_table() {
    return true;
  }

  static get cxav_row() {
    return true;
  }

  static get cxheading_col() {
    return true;
  }
  
  static get cxaudio_col() {
    return true;
  }
  
  static get cxvideo_col() {
    return true;
  }

  static get cxmetadata() {
    return true;
  }

  static get cxcatalog() {
    return true;
  }

  static get cxtemplate() {
    return true;
  }

  static get cxconditions() {
    return true;
  }
}