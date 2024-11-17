"use client";
import { useState, useEffect, useMemo } from "react";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import useProductStore from "@/stores/useProductStore";

const ProductosBuscador = ({ selectedProducts = [], onChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { products, fetchAllProducts, loading } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter((product) =>
      product.attributes.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, products]);

  const getProductName = (id) => {
    const product = products.find((p) => p.id === id);
    return product ? product.attributes.nombre : `Producto ${id}`;
  };

  const toggleProducto = (producto) => {
    const updatedSelection = selectedProducts.includes(producto.id)
      ? selectedProducts.filter((id) => id !== producto.id)
      : [...selectedProducts, producto.id];
    onChange(updatedSelection);
  };

  const removeProducto = (id) => {
    onChange(selectedProducts.filter((productId) => productId !== id));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedProducts.map((id) => (
          <Badge
            key={id}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {getProductName(id)}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => removeProducto(id)}
            />
          </Badge>
        ))}
      </div>
      <Input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2"
      />
      {filteredProducts.length > 0 && (
        <ul className="max-h-32 overflow-y-auto border rounded-lg">
          {filteredProducts.map((producto) => (
            <li
              key={producto.id}
              onClick={() => toggleProducto(producto)}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
            >
              <Check
                className={`mr-2 h-4 w-4 ${
                  selectedProducts.includes(producto.id)
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
              {producto.attributes.nombre}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductosBuscador;
