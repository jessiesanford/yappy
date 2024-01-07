export class ResolvedChildren {
  /**
   * Every editor has a doc node and there is only one of them
   * @return {boolean}
   */
  static get doc() {
    return true;
  }

  /**
   * Some editors have a page node
   * @return {boolean}
   */
  static get page() {
    return true;
  }

  /**
   * The editor has a node called sequence which contains nodes
   * @return {boolean}
   */
  static get sequence() {
    return true;
  }
}