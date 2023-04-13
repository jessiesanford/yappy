import { ContextMenuStore } from './contextMenuStore';
import { StudioStore } from './studioStore';

export class StoreController {
  contextMenuStore: ContextMenuStore = new ContextMenuStore();
  studioStore: StudioStore = new StudioStore();

  constructor() {
  }

  get ContextMenu() {
    return this.contextMenuStore;
  }

  get Studio() {
    return this.studioStore;
  }
}