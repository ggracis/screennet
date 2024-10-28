"use client";
import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import useProductStore from "@/stores/useProductStore";

const ProductosBuscador = ({ selectedProducts = [], onChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { products, setProducts } = useProductStore();

  const fetchAllProductos = async () => {
    try {
      const response = await fetch(`/api/productos/buscar?search=%%%`);
      if (!response.ok) throw new Error("Error al cargar todos los productos");
      const data = await response.json();

      if (Array.isArray(data)) {
        // Obtener los detalles completos de cada producto
        const fullProducts = await Promise.all(
          data.map(async (product) => {
            const detailResponse = await fetch(`/api/productos/${product.id}`);
            const detailData = await detailResponse.json();
            return {
              id: detailData.data.id,
              nombre: detailData.data.attributes.nombre,
              descripcion: detailData.data.attributes.descripcion,
              unidadMedida: detailData.data.attributes.unidadMedida,
              precios: detailData.data.attributes.precios,
              categoria: detailData.data.attributes.categoria,
              subcategoria: detailData.data.attributes.subcategoria,
              activo: detailData.data.attributes.activo,
              foto: detailData.data.attributes.foto,
            };
          })
        );
        setProducts(fullProducts);
        setSearchResults(fullProducts);
      }
    } catch (error) {
      console.error("Error al cargar todos los productos:", error);
    }
  };

  const checkAndFetchProducts = async () => {
    if (products.length === 0) {
      await fetchAllProductos(); // Solo busca si no hay productos en el store
    } else {
      setSearchResults(products); // Si ya hay productos, simplemente los muestra
    }
  };

  useEffect(() => {
    checkAndFetchProducts(); // Llama a la función para verificar y cargar productos
  }, []);

  useEffect(() => {
    console.log("Search term changed:", searchTerm);
    if (searchTerm.length >= 3) {
      const filteredResults = products.filter((producto) =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults(products);
    }
  }, [searchTerm, products]);

  const toggleProducto = (producto) => {
    const updatedSelection = selectedProducts.includes(producto.id)
      ? selectedProducts.filter((id) => id !== producto.id)
      : [...selectedProducts, producto.id];
    onChange(updatedSelection);
  };

  const removeProducto = (id) => {
    onChange(selectedProducts.filter((productId) => productId !== id));
  };

  const getProductName = (id) => {
    const product = products.find((p) => p.id === id);
    return product ? product.nombre : `Producto ${id}`;
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
      {searchResults.length > 0 && (
        <ul className="max-h-32 overflow-y-auto border rounded-lg">
          {searchResults.map((producto) => (
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
              {producto.nombre}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductosBuscador;
