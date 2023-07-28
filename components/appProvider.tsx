import React, { createContext, ReactElement, useContext, useEffect } from 'react';
import { StoreController } from '../store/storeController';

interface IAppContext {
  store: StoreController;
}

export const AppContext = createContext<IAppContext>({
  store: null,
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{children: ReactElement}> = ({ children }) => {
  const store = new StoreController();

  useEffect(() => {
    window.store = store;
  });

  return (
    <AppContext.Provider value={{ store }}>
      {children}
    </AppContext.Provider>
  );
};