import { create } from "zustand";
import { persist } from "zustand/middleware";

// Constantes de configuración
const POLLING_INTERVAL = 60000;
const PAGE_SIZE = 100;

// Validación de respuesta API
const validateApiResponse = (data) => {
  if (!Array.isArray(data)) {
    throw new Error("Invalid API response format");
  }
  return data;
};

const useProductStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      products: [],
      lastUpdate: Date.now(),
      pollingInterval: null,
      loading: false,
      error: null,

      // Métodos principales con mejor manejo de errores
      fetchAllProducts: async () => {
        console.log("🔄 Iniciando carga de productos...");
        try {
          set({ loading: true, error: null });
          const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
          const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

          // Mejor manejo de configuración
          if (!baseUrl || !token) {
            console.error("Configuration check:", {
              hasUrl: !!baseUrl,
              hasToken: !!token,
              url: baseUrl,
            });
            throw new Error(
              "Missing API configuration - Check environment variables"
            );
          }

          let allProducts = [];
          let page = 1;
          let hasMore = true;

          // Bucle para obtener todas las páginas de productos
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

          console.log(`📦 Productos cargados: ${allProducts.length}`);
          // Actualiza el store con los productos obtenidos
          set({
            products: allProducts,
            lastUpdate: Date.now(),
            loading: false,
            error: null,
          });

          return allProducts;
        } catch (error) {
          console.error("❌ Error cargando productos:", error.message);
          console.error("Detailed error:", {
            message: error.message,
            stack: error.stack,
            env: process.env.NODE_ENV,
          });
          set({
            loading: false,
            error: error.message,
          });
          return [];
        }
      },

      // Método para forzar actualización de todos los productos
      refreshProducts: async () => {
        try {
          set({ loading: true, error: null });
          const products = await get().fetchAllProducts();
          return products;
        } catch (error) {
          console.error("Error refreshing products:", error);
          return [];
        } finally {
          set({ loading: false });
        }
      },

      // Obtiene un producto específico por ID
      getProduct: (id) => {
        return get().products.find((product) => product.id === id);
      },

      // Métodos de búsqueda optimizados
      searchProducts: (term) => {
        const products = get().products;
        if (!term?.trim()) return products;

        const searchTerm = term.toLowerCase().trim();
        return products.filter((product) =>
          product?.attributes?.nombre?.toLowerCase().includes(searchTerm)
        );
      },

      // Inicializa el polling para actualizaciones automáticas
      initializePolling: () => {
        console.log("⏰ Iniciando polling de productos");
        if (typeof window !== "undefined") {
          const fetchUpdatedProducts = async () => {
            try {
              console.log("🔍 Verificando actualizaciones...");
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
                console.log(`🔄 Actualizando ${data.length} productos`);
                set((state) => ({
                  products: state.products.map((product) => {
                    const updated = data.find((p) => p.id === product.id);
                    return updated ? { ...product, ...updated } : product;
                  }),
                  lastUpdate: Date.now(),
                }));
              }
            } catch (error) {
              console.error("❌ Error en polling:", error.message);
            }
          };

          const intervalId = setInterval(
            fetchUpdatedProducts,
            POLLING_INTERVAL
          );
          set({ pollingInterval: intervalId });
        }
      },

      // Limpia el intervalo de polling cuando se desmonta el componente
      cleanup: () => {
        console.log("🧹 Limpiando polling de productos");
        const { pollingInterval } = get();
        if (pollingInterval) {
          clearInterval(pollingInterval);
          set({ pollingInterval: null });
        }
      },

      // Verifica si los datos están desactualizados
      isStale: () => Date.now() - get().lastUpdate > POLLING_INTERVAL,

      // Establece la lista completa de productos
      setProducts: (products) =>
        set({
          products,
          lastUpdate: Date.now(),
        }),

      // Agrega o actualiza un único producto
      addProduct: (product) => {
        if (!product?.id) {
          console.error("Invalid product data");
          return;
        }
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
        });
      },

      // Agrega múltiples productos evitando duplicados
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

      // Actualiza un producto existente
      updateProduct: (updatedProduct) => {
        if (!updatedProduct?.id) {
          console.error("Invalid product data for update");
          return;
        }
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
        }));
      },

      // Elimina un producto por ID
      deleteProduct: (productId) =>
        set((state) => ({
          products: state.products.filter(
            (product) => product.id !== productId
          ),
          lastUpdate: Date.now(),
        })),

      // Limpia datos desactualizados
      clearStaleData: () => {
        if (get().isStale()) {
          set({ products: [], lastUpdate: Date.now() });
          return true;
        }
        return false;
      },

      // Mejorar fetchProductsByIds para intentar fetchAll si no encuentra productos
      fetchProductsByIds: async (ids) => {
        try {
          const existingProducts = get().products;
          const missingProducts = ids.filter(
            (id) => !existingProducts.find((p) => p.id === id)
          );

          if (missingProducts.length === 0) {
            return existingProducts.filter((p) => ids.includes(p.id));
          }

          // Intentar primero obtener solo los productos faltantes
          const idsString = missingProducts.join(",");
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/productos?filters[id][$in]=${idsString}&populate=*`,
            {
              headers: {
                Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
              },
            }
          );
          const { data } = await response.json();

          if (!data || data.length < missingProducts.length) {
            // Si no se encuentran todos los productos, refrescar todo el catálogo
            return await get().refreshProducts();
          }

          set((state) => ({
            products: [...state.products, ...data],
            lastUpdate: Date.now(),
          }));

          return get().products.filter((p) => ids.includes(p.id));
        } catch (error) {
          console.error("Error fetching specific products:", error);
          return await get().refreshProducts(); // Fallback a refresh completo
        }
      },
    }),
    {
      name: "product-storage",
      version: 1,
    }
  )
);

export default useProductStore;
