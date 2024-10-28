import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const CACHE_DURATION = 1000 * 60 * 60; // 1 hora de caché

const useProductStore = create(
  persist(
    (set, get) => ({
      products: [],
      lastUpdate: Date.now(),
      isStale: () => Date.now() - get().lastUpdate > CACHE_DURATION,

      setProducts: (products) =>
        set({
          products,
          lastUpdate: Date.now(),
        }),

      addProduct: (product) =>
        set((state) => {
          const index = state.products.findIndex((p) => p.id === product.id);
          if (index !== -1) {
            const updatedProducts = [...state.products];
            updatedProducts[index] = { ...updatedProducts[index], ...product };
            return {
              products: updatedProducts,
              lastUpdate: Date.now(),
            };
          }
          return {
            products: [...state.products, product],
            lastUpdate: Date.now(),
          };
        }),

      addManyProducts: (newProducts) =>
        set((state) => {
          const uniqueProducts = newProducts.filter(
            (newProduct) => !state.products.some((p) => p.id === newProduct.id)
          );
          return {
            products: [...state.products, ...uniqueProducts],
            lastUpdate: Date.now(),
          };
        }),

      updateProduct: (updatedProduct) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          ),
          lastUpdate: Date.now(),
        })),

      deleteProduct: (productId) =>
        set((state) => ({
          products: state.products.filter(
            (product) => product.id !== productId
          ),
          lastUpdate: Date.now(),
        })),

      getProduct: (id) => get().products.find((product) => product.id === id),

      clearStaleData: () => {
        if (get().isStale()) {
          set({ products: [], lastUpdate: Date.now() });
          return true;
        }
        return false;
      },
    }),
    {
      name: "product-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products,
        lastUpdate: state.lastUpdate,
      }),
    }
  )
);

export default useProductStore;
