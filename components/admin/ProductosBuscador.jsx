"use client";
import { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check } from "lucide-react";

const ProductosBuscador = ({ selectedProducts = [], onChange }) => {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 3) {
      fetchProductos(searchTerm);
    } else if (searchTerm.length === 0) {
      fetchProductos();
    }
  }, [searchTerm]);

  const fetchProductos = async (search = "") => {
    try {
      const url = search
        ? `/api/productos?search=${search}&pageSize=100`
        : "/api/productos?pageSize=10";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al cargar productos");
      const data = await response.json();
      setProductos(data.data || []);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setProductos([]);
    }
  };

  const toggleProducto = (productoId) => {
    const updatedSelection = (selectedProducts || []).includes(productoId)
      ? (selectedProducts || []).filter((id) => id !== productoId)
      : [...(selectedProducts || []), productoId];
    onChange(updatedSelection);
  };

  return (
    <Command className="border rounded-lg">
      <CommandInput
        placeholder="Buscar productos..."
        value={searchTerm}
        onValueChange={setSearchTerm}
      />
      <CommandEmpty>No se encontraron productos.</CommandEmpty>
      <CommandGroup className="max-h-64 overflow-y-auto">
        {productos.map((producto) => (
          <CommandItem
            key={producto.id}
            onSelect={() => toggleProducto(producto.id)}
            className="cursor-pointer"
          >
            <Check
              className={`mr-2 h-4 w-4 ${
                (selectedProducts || []).includes(producto.id)
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            />
            {producto.attributes.nombre}
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
};

export default ProductosBuscador;
