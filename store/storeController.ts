import { ContextMenuStore } from './contextMenuStore';
import { StudioStore } from './studioStore';
import { ModalStore } from "./modalStore";

export class StoreController {
  contextMenuStore: ContextMenuStore = new ContextMenuStore();
  studioStore: StudioStore = new StudioStore();
  modalStore: ModalStore = new ModalStore();

  constructor() {
  }

  get ContextMenu() {
    return this.contextMenuStore;
  }

  get Studio() {
    return this.studioStore;
  }

  get Modal() {
    return this.modalStore;
  }
}