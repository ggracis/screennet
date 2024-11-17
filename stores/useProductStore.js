import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const POLLING_INTERVAL = 10000; // 10 segundos

const useProductStore = create(
  persist(
    (set, get) => ({
      products: [],
      lastUpdate: Date.now(),
      pollingInterval: null,
      loading: false,

      fetchAllProducts: async () => {
        try {
          set({ loading: true });
          let allProducts = [];
          let page = 1;
          const pageSize = 100;

          while (true) {
            const response = await fetch(
              `/api/productos?page=${page}&pageSize=${pageSize}&populate=*`
            );

            if (!response.ok) throw new Error("Error fetching products");

            const { data, meta } = await response.json();
            allProducts = [...allProducts, ...data];

            if (page >= meta.pagination.pageCount) break;
            page++;
          }

          set({
            products: allProducts,
            lastUpdate: Date.now(),
            loading: false,
          });
        } catch (error) {
          console.error("Error fetching all products:", error);
          set({ loading: false });
        }
      },

      getProduct: (id) => {
        return get().products.find((product) => product.id === id);
      },

      searchProducts: (term) => {
        const products = get().products;
        if (!term) return products;
        return products.filter((product) =>
          product.attributes.nombre.toLowerCase().includes(term.toLowerCase())
        );
      },

      initializePolling: () => {
        if (typeof window !== "undefined") {
          const interval = setInterval(async () => {
            try {
              const response = await fetch(
                `/api/productos/actualizados?lastUpdate=${get().lastUpdate}`
              );
              if (!response.ok) throw new Error("Error fetching updates");
              const { data } = await response.json();

              if (data && data.length > 0) {
                set((state) => ({
                  products: state.products.map((product) => {
                    const updated = data.find((p) => p.id === product.id);
                    return updated ? { ...product, ...updated } : product;
                  }),
                  lastUpdate: Date.now(),
                }));
              }
            } catch (error) {
              console.error("Error polling updates:", error);
            }
          }, POLLING_INTERVAL);
          set({ pollingInterval: interval });
        }
      },

      cleanup: () => {
        const { pollingInterval } = get();
        if (pollingInterval) {
          clearInterval(pollingInterval);
          set({ pollingInterval: null });
        }
      },

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
            product.id === updatedProduct.id
              ? {
                  ...product,
                  ...updatedProduct,
                  attributes: {
                    ...product.attributes,
                    ...updatedProduct.attributes,
                  },
                }
              : product
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
    }
  )
);

export default useProductStore;
