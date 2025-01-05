import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const POLLING_INTERVAL = 60000; // 1 minute
const PAGE_SIZE = 100; // Ajustado para mejor rendimiento

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
          let hasMore = true;
          const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "";
          const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

          while (hasMore) {
            const response = await fetch(
              `${baseUrl}/api/productos?pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}&populate=*`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                credentials: "include",
              }
            );

            if (!response.ok) {
              console.error("Response status:", response.status);
              console.error(
                "Response headers:",
                Object.fromEntries(response.headers)
              );
              throw new Error(`Error fetching products: ${response.status}`);
            }

            const { data, meta } = await response.json();

            if (!data) {
              console.error("No data received from API");
              break;
            }

            allProducts = [...allProducts, ...data];
            hasMore = page < (meta?.pagination?.pageCount || 1);
            page++;
          }

          set({
            products: allProducts,
            lastUpdate: Date.now(),
            loading: false,
          });

          return allProducts;
        } catch (error) {
          console.error("Error fetching all products:", error);
          set({ loading: false });
          return [];
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
          const fetchUpdatedProducts = async () => {
            try {
              const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "";
              const response = await fetch(
                `/api/productos/actualizados?lastUpdate=${get().lastUpdate}`,
                {
                  headers: {
                    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
                  },
                }
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
          };

          const intervalId = setInterval(
            fetchUpdatedProducts,
            POLLING_INTERVAL
          );
          set({ pollingInterval: intervalId });
        }
      },

      cleanup: () => {
        const { pollingInterval } = get();
        if (pollingInterval) {
          clearInterval(pollingInterval);
          set({ pollingInterval: null });
        }
      },

      isStale: () => Date.now() - get().lastUpdate > POLLING_INTERVAL,

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

      fetchProductsByIds: async (ids) => {
        try {
          const idsString = ids.join(",");
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/productos?filters[id][$in]=${idsString}&populate=*`,
            {
              headers: {
                Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
              },
            }
          );
          const { data } = await response.json();

          if (Array.isArray(data)) {
            set((state) => ({
              products: [...state.products, ...data],
            }));
          }
        } catch (error) {
          console.error("Error fetching products by IDs:", error);
        }
      },
    }),
    {
      name: "product-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useProductStore;
