import { memo, useMemo } from "react";
import { useProductContext } from "@/contexts/ProductContext";
import { ProductCard } from "../ProductCard";
import { formatPrice } from "@/utils/formatters";

const Simple3 = memo(
  ({ productos: productosIds = [], titulo, rowSpan = 1 }) => {
    const { products, loading, error } = useProductContext();
    const baseItemsPerPage = 5;
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
              className="flex flex-col p-1 rounded-lg bg-gray-800/20"
            >
              <div className="flex flex-wrap justify-center gap-2">
                <div className="text-l texto font-bold leading-5">
                  {product.attributes.nombre}
                </div>
                {Object.entries(product.attributes.precios || {})
                  .filter(([_, precio]) => precio)
                  .map(([titulo, precio]) => (
                    <div
                      key={`${product.id}-${titulo}`}
                      className="p-1 bg-gray-700/40 rounded-md"
                    >
                      <span className="text-gray-300">{titulo}: </span>
                      <span className="text-md texto text-white">
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

Simple3.displayName = "Simple3";
export default Simple3;
