import { memo, useMemo, useEffect, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "../ProductCard";

const Simple3 = memo(({ productos, titulo, rowSpan = 1 }) => {
  const [cachedProducts, setCachedProducts] = useState({});
  const { loading, error, products } = useProducts(productos);
  const baseItemsPerPage = 5;
  const adjustedItemsPerPage = baseItemsPerPage * rowSpan;

  useEffect(() => {
    setCachedProducts((prev) => {
      const newCache = { ...prev };
      products.forEach((product) => {
        newCache[product.id] = product;
      });
      return newCache;
    });
  }, [products]);

  const displayProducts = useMemo(
    () => productos.map((id) => cachedProducts[id]).filter(Boolean),
    [productos, cachedProducts]
  );

  return (
    <ProductCard
      loading={loading}
      error={error}
      title={titulo}
      itemsPerPage={adjustedItemsPerPage}
    >
      <div className="grid grid-cols-1 gap-2">
        {displayProducts.map((product) => (
          <div
            key={`${product.id}-${product.attributes?.updatedAt}`}
            className="flex flex-col p-1 rounded-lg bg-gray-800/40"
          >
            <div className="flex flex-wrap justify-center gap-2">
              <div className="text-l font-bold">
                {product.attributes.nombre}
              </div>
              {Object.entries(product.attributes.precios || {})
                .filter(([_, precio]) => precio)
                .map(([titulo, precio]) => (
                  <div
                    key={`${product.id}-${titulo}`}
                    className="p-1 bg-gray-700/50 rounded-md"
                  >
                    <span className="text-gray-300">{titulo}: </span>
                    <span className="text-md text-white">${precio}</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </ProductCard>
  );
});

Simple3.displayName = "Simple3";

export default Simple3;
