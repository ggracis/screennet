// components\screen\lista-de-productos\Simple-2.jsx

import { memo, useMemo } from "react";
import { useProductContext } from "@/contexts/ProductContext";
import { ProductCard } from "../ProductCard";
import { formatPrice } from "@/utils/formatters";

const Simple2 = memo(
  ({ productos: productosIds = [], titulo, rowSpan = 1 }) => {
    const { products, loading, error } = useProductContext();
    const baseItemsPerPage = 3;
    const adjustedItemsPerPage = baseItemsPerPage * rowSpan;

    const displayProducts = useMemo(
      () =>
        productosIds
          .map((id) => products.find((p) => p.id === id))
          .filter(Boolean),
      [productosIds, products]
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
              className="flex flex-col items-center p-2 rounded-lg bg-gray-800/20"
            >
              <h2 className="text-xl texto font-bold mb-2 text-center leading-5">
                {product.attributes.nombre}
              </h2>
              <div className="flex flex-wrap justify-center gap-2">
                {Object.entries(product.attributes.precios || {})
                  .filter(([_, precio]) => precio)
                  .map(([titulo, precio]) => (
                    <div
                      key={`${product.id}-${titulo}`}
                      className="p-1 bg-gray-700/30 rounded-md"
                    >
                      <span className="text-gray-300">{titulo}: </span>
                      <span className="text-xl texto font-bold text-white">
                        {formatPrice(precio)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </ProductCard>
    );
  }
);

Simple2.displayName = "Simple2";

export default Simple2;
