import React, { createContext, ReactElement, useContext, useEffect } from 'react';
import { StoreController } from '../store/';

interface IAppContext {
  store: StoreController;
}

export const AppContext = createContext<IAppContext>({
  // @ts-ignore
  store: null,
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{children: ReactElement}> = ({ children }) => {
  const store = new StoreController();

  return (
    <AppContext.Provider value={{ store }}>
      {children}
    </AppContext.Provider>
  );
};