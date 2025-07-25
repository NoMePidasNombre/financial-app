import React, { createContext, useState, useContext } from 'react';

interface MenuVisibilityContextType {
  menusVisible: boolean;
  setMenusVisible: (visible: boolean) => void;
}

const MenuVisibilityContext = createContext<MenuVisibilityContextType | undefined>(undefined);

export const MenuVisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menusVisible, setMenusVisible] = useState(true);
  return (
    <MenuVisibilityContext.Provider value={{ menusVisible, setMenusVisible }}>
      {children}
    </MenuVisibilityContext.Provider>
  );
};

export const useMenuVisibility = () => {
  const context = useContext(MenuVisibilityContext);
  if (!context) {
    throw new Error('useMenuVisibility must be used within a MenuVisibilityProvider');
  }
  return context;
};
