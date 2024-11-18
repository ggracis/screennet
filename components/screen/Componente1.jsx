import { memo, useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { Separator } from "@/components/ui/separator";

const Componente1 = memo(({ productos, titulo, rowSpan = 1 }) => {
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
      <div className="grid grid-cols-1">
        {displayProducts.map((product, index) => (
          <div key={`${product.id}-${product.attributes?.updatedAt}`}>
            <div className="flex justify-between items-center py-1">
              <div className="text-md font-semibold">
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
                      <span className="text-md font-bold">${precio}</span>
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

Componente1.displayName = "Componente1";

export default Componente1;
