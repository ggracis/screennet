import { memo, useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";

const Componente2 = memo(({ productos, titulo, rowSpan = 1 }) => {
  const { loading, error, products } = useProducts(productos);
  const baseItemsPerPage = 3;
  const adjustedItemsPerPage = baseItemsPerPage * rowSpan;

  const displayProducts = useMemo(
    () =>
      productos.map((id) => products.find((p) => p.id === id)).filter(Boolean),
    [productos, products]
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
            className="flex flex-col items-center p-2 rounded-lg bg-gray-800/40"
          >
            <h2 className="text-xl font-bold mb-2 text-center">
              {product.attributes.nombre}
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.entries(product.attributes.precios || {})
                .filter(([_, precio]) => precio)
                .map(([titulo, precio]) => (
                  <div
                    key={`${product.id}-${titulo}`}
                    className="p-1 bg-gray-700/50 rounded-md"
                  >
                    <span className="text-gray-300">{titulo}: </span>
                    <span className="text-xl font-bold text-white">
                      ${precio}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </ProductCard>
  );
});

Componente2.displayName = "Componente2";

export default Componente2;
