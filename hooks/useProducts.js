import { useState, useCallback, useEffect } from "react";
import useProductStore from "@/stores/useProductStore";

export function useProducts(productIds) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { products, addProduct } = useProductStore();

  const fetchProductData = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/productos/${id}`);
      if (!response.ok) throw new Error(`Error fetching product ${id}`);
      const data = await response.json();
      return {
        id: data.data.id,
        attributes: {
          nombre: data.data.attributes.nombre,
          descripcion: data.data.attributes.descripcion,
          unidadMedida: data.data.attributes.unidadMedida,
          precios: data.data.attributes.precios,
          categoria: data.data.attributes.categoria,
          subcategoria: data.data.attributes.subcategoria,
          activo: data.data.attributes.activo,
          foto: data.data.attributes.foto,
        },
      };
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }, []);

  useEffect(() => {
    const fetchMissingProducts = async () => {
      setLoading(true);
      try {
        const missingProducts = productIds.filter(
          (id) => !products.some((p) => p.id === id)
        );

        if (missingProducts.length > 0) {
          const newProducts = await Promise.all(
            missingProducts.map(fetchProductData)
          );
          newProducts.forEach(addProduct);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMissingProducts();
  }, [productIds, products, fetchProductData, addProduct]);

  return { loading, error, products };
}
