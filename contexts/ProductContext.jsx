import { createContext, useContext } from "react";
import useProductStore from "@/stores/useProductStore";

export const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const { products, loading, error } = useProductStore();

  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error(
      "useProductContext debe usarse dentro de un ProductProvider"
    );
  }
  return context;
};
