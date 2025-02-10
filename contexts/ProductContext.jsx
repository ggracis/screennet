"use client";

import { createContext, useContext, useEffect } from "react";
import useProductStore from "@/stores/useProductStore";

export const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const {
    products,
    loading,
    error,
    fetchAllProducts,
    initializePolling,
    cleanup,
  } = useProductStore();

  useEffect(() => {
    const loadProducts = async () => {
      if (products.length === 0) {
        await fetchAllProducts();
      }
      initializePolling();
    };

    loadProducts();
    return () => cleanup();
  }, [fetchAllProducts, initializePolling, cleanup, products.length]);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        fetchAllProducts,
      }}
    >
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
