import React, { useState } from 'react';

import { createContext, useContext } from 'react';

const ModalContextProps = {
  showModal: () => {},
  hideModal: () => {},
  store: {},
};

export const ModalContext = createContext(ModalContextProps);
export const useModalContext = () => useContext(ModalContext);

export const ModalProvider: React.FC<{}> = ({ children }) => {
  const [store, setStore] = useState();
  const { modalType, modalProps } = store || {};

  const showModal = (modalType: string, modalProps: any = {}) => {
    setStore({
      ...store,
      modalType,
      modalProps,
    });
  };

  const hideModal = () => {
    setStore({
      ...store,
      modalType: null,
      modalProps: {},
    });
  };

  const renderComponent = () => {
    const ModalComponent = modalType;
    if (!modalType || !ModalComponent) {
      return null;
    }
    return <ModalComponent id="global-modal" {...modalProps} />;
  };

  return (
    <ModalContext.Provider value={{ store, showModal, hideModal }}>
      {renderComponent()}
      {children}
    </ModalContext.Provider>
  );
};