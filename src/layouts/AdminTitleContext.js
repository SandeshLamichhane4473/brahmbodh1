// src/layouts/AdminTitleContext.js
import { createContext, useContext, useState } from 'react';

const AdminTitleContext = createContext();

export const useAdminTitle = () => useContext(AdminTitleContext);

export const AdminTitleProvider = ({ children }) => {
  const [title, setTitle] = useState('hellow hunny bynny');
  return (
    <AdminTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </AdminTitleContext.Provider>
  );
};
