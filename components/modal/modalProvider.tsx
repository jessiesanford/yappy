import React, { ReactElement, useState } from 'react';
import { createContext, useContext } from 'react';
import { EmptyModal } from './emptyModal';
import { useAppContext } from "../appProvider";
import { observer } from "mobx-react-lite";

export interface ModalContextProps {
  doAction: (data? : {}) => void,
  doCancel: (data?: {}) => void,
  handleInputFocus: (e: KeyboardEvent) => void,
  handleKeyDown: (e: KeyboardEvent) => void,
  handleError: (msg: string, opt_obj: any, opt_refs: any) => void,
}

export const ModalContext = createContext<ModalContextProps>({
  doAction: () => {},
  doCancel: () => {},
  handleInputFocus: () => {},
  handleKeyDown: () => {},
  handleError: () => {}
});

export const useModalContext = () => useContext(ModalContext);

export const ModalProvider: React.FC<{children: ReactElement}> = observer(({ children }) => {
  const {
    store
  } = useAppContext();

  // const [store, setStore] = useState({});
  // const modalType = EmptyModal;
  // const modalProps = {};
  // const { modalType, modalProps } = store || {};

  const MODAL_STORE = store.Modal;
  const {
    modalType,
    modalProps,
    hideModal,
  } = MODAL_STORE;
  const ModalComponent = modalType; // allows us to render this as a functional component
  let isCalled = false;

  function doAction(opt_data?: any) {
    if (!isCalled) {
      modalProps.action?.(opt_data);
      isCalled = true;
    }
    hideModal();
  }

  function doCancel(opt_data?: any) {
    if (!isCalled) {
      modalProps.cancel?.(opt_data);
      isCalled = true;
    }
    hideModal();
  }

  function handleKeyDown(e: KeyboardEvent) {
    // confirm action on enter keypress
    let key = e.which || e.keyCode;
    switch (key) {
      case 13:
        e.preventDefault();
        doAction();
        break;
      case 27:
        doCancel();
        break;
      default:
        break;
    }
  }

  function handleError(msg: string, opt_obj = {}, opt_refs = []) {
    _.each(opt_refs, (ref) => {
      if (ref) {
        ref.classList.add('input-error');
      }
    });

    MODAL_STORE.setError({ msg, hidden: false });
  }

  function removeError(input: HTMLInputElement) {
    if (input) {
      input.classList.remove('input-error');
    }

    MODAL_STORE.setError({ msg: '', hidden: true });
  }

  function handleInputFocus(e: Event) {
    if (e) {
      removeError(e.target);
    }
  }

  const renderComponent = () => {
    if (!modalType || !ModalComponent) {
      return null;
    }
    return <ModalComponent id="global-modal" {...modalProps} />;
  };

  const provided = {
    doAction,
    doCancel,
    handleKeyDown,
    handleInputFocus,
    handleError,
  };

  return (
    <ModalContext.Provider value={provided}>
      {renderComponent()}
      {children}
    </ModalContext.Provider>
  );
});