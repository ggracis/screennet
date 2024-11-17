import { memo, useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";

const Componente3 = memo(({ productos, titulo, rowSpan = 1 }) => {
  const { loading, error, products } = useProducts(productos);
  const baseItemsPerPage = 6;
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
                    className="px-2 py-1 bg-gray-700/50 rounded-md"
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

Componente3.displayName = "Componente3";

export default Componente3;
