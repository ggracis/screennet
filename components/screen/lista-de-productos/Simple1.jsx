//components\screen\lista-de-productos\Simple-1.jsx

import { memo, useMemo, useEffect, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "../ProductCard";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/utils/formatters";

const Simple1 = memo(({ productos, titulo, rowSpan = 1 }) => {
  const [cachedProducts, setCachedProducts] = useState({});
  const { loading, error, products } = useProducts(productos);
  const baseItemsPerPage = 6;
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
      <div className="grid grid-cols-1">
        {displayProducts.map((product, index) => (
          <div key={`${product.id}-${product.attributes?.updatedAt}`}>
            <div className="flex justify-between items-center py-1">
              <div className="text-md texto font-bold leading-5">
                {product.attributes.nombre}
              </div>
              <div className="flex gap-2">
                {Object.entries(product.attributes.precios || {})
                  .filter(([_, precio]) => precio)
                  .map(([titulo, precio]) => (
                    <div
                      key={`${product.id}-${titulo}`}
                      className="flex items-center gap-1"
                    >
                      <span className="text-gray-300 text-sm">{titulo}:</span>
                      <span className="text-md texto font-bold">
                        {formatPrice(precio)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            {index < displayProducts.length - 1 && (
              <Separator className="my-1 opacity-30" />
            )}
          </div>
        ))}
      </div>
    </ProductCard>
  );
});

Simple1.displayName = "Simple1";

export default Simple1;
