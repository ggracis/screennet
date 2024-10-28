"use client";

import React, { useState, useEffect, useRef } from "react";
import useProductStore from "@/stores/useProductStore";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Plus, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProductoEditDrawer from "@/components/admin/ProductoEditDrawer";

export default function ProductosLista() {
  const { products, addProduct, updateProduct, deleteProduct } =
    useProductStore();

  const router = useRouter();
  const { toast } = useToast();

  const [editProductId, setEditProductId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [categorias, setCategorias] = React.useState([]);
  const [subcategorias, setSubcategorias] = React.useState([]);

  const [selectedCategoria, setSelectedCategoria] = React.useState(""); // Inicializa como cadena vacía
  const [selectedSubcategoria, setSelectedSubcategoria] = React.useState(""); // Inicializa como cadena vacía

  const handleCategoriaChange = (value) => {
    setSelectedCategoria(value);
    fetchProductos(1); // Refresca la lista al cambiar la categoría
  };

  const handleSubcategoriaChange = (value) => {
    setSelectedSubcategoria(value);
    fetchProductos(1); // Refresca la lista al cambiar la subcategoría
  };

  const clearFilters = () => {
    setSearchTerm(""); // Limpia el término de búsqueda
    setSelectedCategoria(""); // Limpia la categoría seleccionada
    setSelectedSubcategoria(""); // Limpia la subcategoría seleccionada
    fetchProductos(1); // Refresca la lista
  };
  const [sorting, setSorting] = React.useState({
    column: "nombre",
    direction: "asc",
  });

  const handleEditProduct = (productId) => {
    setEditProductId(productId);
    setIsDrawerOpen(true);
  };

  const handleNewProduct = () => {
    setEditProductId(null);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditProductId(null);
  };

  const handleProductUpdated = (updatedProduct) => {
    updateProduct(updatedProduct); // Actualiza el producto en el store
    fetchProductos(currentPage); // Opcional: refresca la lista desde la API
  };

  const handleDeleteProduct = async (productId) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/productos/${productToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      toast({
        title: "Éxito",
        description: "Producto eliminado correctamente",
      });

      // Actualizar la lista de productos en el store
      deleteProduct(productToDelete);
      fetchProductos(currentPage); // Opcional: refresca la lista desde la API
    } catch (error) {
      console.error("Error deleting producto:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const [productos, setProductos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentSearchTerm, setCurrentSearchTerm] = React.useState("");

  const inputRef = useRef(null);

  const [totalProducts, setTotalProducts] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);

  // Fetch para obtener categorías y subcategorías
  const fetchCategorias = async () => {
    const response = await fetch("/api/categorias");
    const data = await response.json();
    setCategorias(data);
  };

  const fetchSubcategorias = async () => {
    const response = await fetch("/api/subcategorias");
    const data = await response.json();
    setSubcategorias(data);
  };

  React.useEffect(() => {
    fetchCategorias();
    fetchSubcategorias();
    fetchProductos(1);
  }, []);

  const columns = [
    {
      id: "nombre",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => {
            handleSort("nombre");
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      accessorFn: (row) => row.attributes.nombre,
      cell: ({ row }) => <div className="ml-2">{row.attributes.nombre}</div>,
    },
    {
      id: "descripcion",
      header: "Descripción",
      accessorFn: (row) => row.attributes.descripcion,
      cell: ({ row }) => (
        <div className="ml-2">{row.attributes.descripcion}</div>
      ),
    },
    {
      id: "unidadMedida",
      header: "Unidad de Medida",
      accessorFn: (row) => row.attributes.unidadMedida,
      cell: ({ row }) => (
        <div className="text-left pl-4">{row.attributes.unidadMedida}</div>
      ),
    },
    {
      id: "precio1",
      header: "Precio 1",
      accessorFn: (row) => Object.values(row.attributes.precios)[0] || "N/A", // Accede al primer precio
      cell: ({ row }) => (
        <div className="text-left pl-4">
          {Object.values(row.attributes.precios)[0] || "N/A"}
        </div>
      ),
    },
    {
      id: "precio2",
      header: "Precio 2",
      accessorFn: (row) => Object.values(row.attributes.precios)[1] || "N/A", // Accede al segundo precio
      cell: ({ row }) => (
        <div className="text-left pl-4">
          {Object.values(row.attributes.precios)[1] || "N/A"}
        </div>
      ),
    },
    {
      id: "precio3",
      header: "Precio 3",
      accessorFn: (row) => Object.values(row.attributes.precios)[2] || "N/A", // Accede al tercer precio
      cell: ({ row }) => (
        <div className="text-left pl-4">
          {Object.values(row.attributes.precios)[2] || "N/A"}
        </div>
      ),
    },
    {
      id: "categoria",
      header: "Categoría",
      accessorFn: (row) =>
        row.attributes.categoria?.data?.attributes?.nombre || "N/A",
      cell: ({ row }) => (
        <div className="text-left pl-4">
          {row.attributes.categoria?.data?.attributes?.nombre || "N/A"}
        </div>
      ),
    },
    {
      id: "subcategoria",
      header: "Subcategoría",
      accessorFn: (row) =>
        row.attributes.subcategoria?.data?.attributes?.nombre || "N/A",
      cell: ({ row }) => (
        <div className="text-left pl-4">
          {row.attributes.subcategoria?.data?.attributes?.nombre || "N/A"}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditProduct(row.id)}
              title="Editar producto"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteProduct(row.id)}
              title="Eliminar producto"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Actualiza la función fetchProductos para incluir filtros
  const fetchProductos = async (page = 1, search = "") => {
    setLoading(true);
    try {
      let url = `/api/productos?page=${page}&pageSize=25`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      if (selectedCategoria) {
        url += `&filters[categoria][id][$eq]=${selectedCategoria}`;
      }
      if (selectedSubcategoria) {
        url += `&filters[subcategoria][id][$eq]=${selectedSubcategoria}`;
      }
      // Agregar ordenamiento a la URL
      url += `&sort=${sorting.column}:${sorting.direction}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Error al obtener los productos");
      }
      const data = await response.json();
      setProductos(data.data);
      setTotalPages(data.meta.pagination.pageCount);
      setCurrentPage(data.meta.pagination.page);
      setTotalProducts(data.meta.pagination.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (columnId) => {
    setSorting((prev) => {
      const isAsc = prev.column === columnId && prev.direction === "asc";
      return { column: columnId, direction: isAsc ? "desc" : "asc" };
    });
    fetchProductos(1);
  };

  const handleSearch = () => {
    //setCurrentSearchTerm(searchTerm);
    fetchProductos(1, searchTerm);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  React.useEffect(() => {
    fetchProductos(1);
  }, [selectedCategoria, selectedSubcategoria, currentSearchTerm, sorting]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full space-y-2 p-6">
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

        <Separator orientation="vertical" />

        <Button onClick={handleNewProduct} variant="secondary" size="sm">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
        </Button>
      </div>
      <div className="rounded-md border h-[70vh] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="text-center">
                  {flexRender(column.header, { column })}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.length ? (
              productos.map((product) => (
                <TableRow key={product.id}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {flexRender(column.cell, { row: product })}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginador */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Mostrando {(currentPage - 1) * 25 + 1} a{" "}
          {Math.min(currentPage * 25, totalProducts)} de {totalProducts}{" "}
          productos
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => fetchProductos(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            Anterior
          </Button>
          <Button
            onClick={() => fetchProductos(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            Siguiente
          </Button>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              el producto.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ProductoEditDrawer
        productId={editProductId}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onProductUpdated={handleProductUpdated}
      />
    </div>
  );
}
