import { makeAutoObservable } from 'mobx';
import { ReactElement } from 'react';

export type BaseModalProps = {
  title?: string,
  readOnly?: boolean,
  action?: (data) => void,
  cancel?: (data) => void,
} & {
  [key: string]: unknown;
};

export class ModalStore {
  modalType: any;
  modalProps: any;
  error: { msg: string, hidden: boolean };

  constructor() {
    this.modalType = null;
    this.modalProps = {};
    this.error = {
      msg: '',
      hidden: true
    };

    makeAutoObservable(this);
  }

  showModal = (modalType: (props) => ReactElement, modalProps: BaseModalProps) => {
    this.hideModal();
    this.modalType = modalType;
    this.modalProps = modalProps;
  };

  hideModal = () => {
    this.modalType = null;
    this.modalProps = {};
  };

  setError = (error: { msg: string, hidden: boolean }) => {
    this.error = error;
  };
}
