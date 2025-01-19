import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

const ProductosFilters = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  handleCategoriaChange,
  handleSubcategoriaChange,
  clearFilters,
  categorias,
  subcategorias,
  selectedCategoria,
  selectedSubcategoria,
}) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="flex h-5 items-center space-x-4 text-sm mb-6">
      <Input
        placeholder="Buscar por nombre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        className="max-w-sm"
      />
      <Button
        onClick={handleSearch}
        className="ml-4"
        size="sm"
        variant="outline"
      >
        Buscar
      </Button>
      <Select onValueChange={handleCategoriaChange} value={selectedCategoria}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Seleccionar categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Seleccionar categoría</SelectLabel>
            {categorias.map((categoria) => (
              <SelectItem key={categoria.id} value={categoria.id}>
                {categoria.attributes.nombre}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        onValueChange={handleSubcategoriaChange}
        value={selectedSubcategoria}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Seleccionar subcategoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Seleccionar subcategoría</SelectLabel>
            {subcategorias.map((subcategoria) => (
              <SelectItem key={subcategoria.id} value={subcategoria.id}>
                {subcategoria.attributes.nombre}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        onClick={clearFilters}
        className="ml-4"
        size="sm"
        variant="outline"
      >
        Limpiar Búsqueda
      </Button>
    </div>
  );
};

export default ProductosFilters;
