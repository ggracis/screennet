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
import { Separator } from "@/components/ui/separator";
import ProductoEditDrawer from "@/components/admin/ProductoEditDrawer";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProductosLista() {
  const { products, addProduct, updateProduct, deleteProduct } =
    useProductStore();

  const router = useRouter();
  const { toast } = useToast();

  const [editProductId, setEditProductId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [categorias, setCategorias] = React.useState([]);
  const [subcategorias, setSubcategorias] = React.useState([]);

  const [selectedCategoria, setSelectedCategoria] = React.useState("");
  const [selectedSubcategoria, setSelectedSubcategoria] = React.useState("");

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
    fetchProductos(currentPage, searchTerm); // Refresca la lista manteniendo la búsqueda actual
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

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const [batchOperation, setBatchOperation] = useState("precio"); // 'precio', 'unidad', 'categoria' o 'subcategoria'
  const [percentageChange, setPercentageChange] = useState("");
  const [newUnidadMedida, setNewUnidadMedida] = useState("Kg.");
  const [previewProducts, setPreviewProducts] = useState([]);
  const [newCategoria, setNewCategoria] = useState(""); // Agregar este estado
  const [newSubcategoria, setNewSubcategoria] = useState(""); // Agregar este estado

  const [pageSize, setPageSize] = useState(50);
  const pageSizeOptions = [10, 25, 50, 100];

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
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center w-[20px]">
          <Checkbox
            checked={
              productos.length > 0 &&
              productos.every((product) =>
                selectedProducts.includes(product.id)
              )
            }
            onCheckedChange={handleSelectAll}
            aria-label="Seleccionar todos"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={selectedProducts.includes(row.id)}
            onCheckedChange={() => handleProductSelect(row.id)}
            aria-label={`Seleccionar ${row.attributes?.nombre}`}
          />
        </div>
      ),
    },
    {
      id: "nombre",
      header: ({ column }) => (
        <div className="w-[200px]">
          <Button
            variant="ghost"
            onClick={() => handleSort("nombre")}
            className="flex items-center"
          >
            Nombre
            {sorting.column === "nombre" && (
              <span className="ml-2">
                {sorting.direction === "asc" ? "↑" : "↓"}
              </span>
            )}
          </Button>
        </div>
      ),
      accessorFn: (row) => row.attributes.nombre,
      cell: ({ row }) => (
        <div className="w-[200px] truncate">{row.attributes.nombre}</div>
      ),
    },
    {
      id: "descripcion",
      header: "Descripción",
      accessorFn: (row) => row.attributes.descripcion,
      cell: ({ row }) => (
        <div className="w-[200px] truncate">{row.attributes.descripcion}</div>
      ),
    },
    {
      id: "unidadMedida",
      header: "Unidad de Medida",
      accessorFn: (row) => row.attributes.unidadMedida,
      cell: ({ row }) => (
        <div className="w-[50px] text-left">{row.attributes.unidadMedida}</div>
      ),
    },
    {
      id: "precio1",
      header: "Precio 1",
      accessorFn: (row) => Object.values(row.attributes.precios)[0] || "N/A", // Accede al primer precio
      cell: ({ row }) => (
        <div className="w-[50px] text-right">
          {Object.values(row.attributes.precios)[0] || "N/A"}
        </div>
      ),
    },
    {
      id: "precio2",
      header: "Precio 2",
      accessorFn: (row) => Object.values(row.attributes.precios)[1] || "N/A", // Accede al segundo precio
      cell: ({ row }) => (
        <div className="w-[50px] text-right">
          {Object.values(row.attributes.precios)[1] || "N/A"}
        </div>
      ),
    },
    {
      id: "precio3",
      header: "Precio 3",
      accessorFn: (row) => Object.values(row.attributes.precios)[2] || "N/A", // Accede al tercer precio
      cell: ({ row }) => (
        <div className="w-[50px] text-right">
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
        <div className="w-[100px] truncate">
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
        <div className="w-[100px] truncate">
          {row.attributes.subcategoria?.data?.attributes?.nombre || "N/A"}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="w-[50px] flex space-x-2">
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
      ),
    },
  ];

  // Actualiza la función fetchProductos para incluir filtros
  const fetchProductos = async (page = 1, search = searchTerm) => {
    setLoading(true);
    try {
      let url = `/api/productos?page=${page}&pageSize=${pageSize}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      if (selectedCategoria) {
        url += `&filters[categoria][id][$eq]=${selectedCategoria}`;
      }
      if (selectedSubcategoria) {
        url += `&filters[subcategoria][id][$eq]=${selectedSubcategoria}`;
      }
      url += `&sort=${sorting.column}:${sorting.direction}`;

      console.log("URL de fetch productos:", url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Error al obtener los productos");
      }
      const data = await response.json();

      // Agrega este log para verificar los datos
      console.log("Datos recibidos:", {
        totalProductos: data.data.length,
        paginacion: data.meta.pagination,
      });

      setProductos(data.data); // Asegúrate de que esto contenga el array correcto
      setTotalPages(data.meta.pagination.pageCount);
      setCurrentPage(data.meta.pagination.page);
      setTotalProducts(data.meta.pagination.total);
    } catch (err) {
      setError(err.message);
      console.error("Error en fetchProductos:", err);
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
    fetchProductos(currentPage);
  }, [
    selectedCategoria,
    selectedSubcategoria,
    currentSearchTerm,
    sorting,
    pageSize,
  ]);

  const handleProductSelect = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const calculateNewPrice = (currentPrice, percentage) => {
    const factor = 1 + percentage / 100;
    return (parseFloat(currentPrice) * factor).toFixed(2);
  };

  const handleShowPreview = () => {
    const selectedProductsData = productos
      .filter((product) => selectedProducts.includes(product.id))
      .slice(0, 5);

    const preview = selectedProductsData.map((product) => ({
      id: product.id,
      nombre: product.attributes.nombre,
      precios: {
        actuales: product.attributes.precios,
        nuevos: Object.fromEntries(
          Object.entries(product.attributes.precios || {}).map(
            ([key, value]) => [
              key,
              calculateNewPrice(value, parseFloat(percentageChange)),
            ]
          )
        ),
      },
    }));

    setPreviewProducts(preview);
  };

  const handleBatchUpdate = async () => {
    try {
      const updates = selectedProducts.map(async (productId) => {
        const product = productos.find((p) => p.id === productId);
        let updateData = {};

        switch (batchOperation) {
          case "precio":
            const newPrecios = Object.fromEntries(
              Object.entries(product.attributes.precios).map(([key, value]) => [
                key,
                calculateNewPrice(value, parseFloat(percentageChange)),
              ])
            );
            updateData = { precios: newPrecios };
            break;
          case "unidad":
            updateData = { unidadMedida: newUnidadMedida };
            break;
          case "categoria":
            updateData = { categoria: newCategoria };
            break;
          case "subcategoria":
            updateData = { subcategoria: newSubcategoria };
            break;
        }

        const response = await fetch(`/api/productos/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });

        if (!response.ok)
          throw new Error(`Error actualizando producto ${productId}`);
        return response.json();
      });

      await Promise.all(updates);

      toast({
        title: "Éxito",
        description: "Productos actualizados correctamente",
      });

      fetchProductos(currentPage);
      setShowBatchDialog(false);
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error en actualización por lotes:", error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar los productos",
        variant: "destructive",
      });
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      // Seleccionar todos los productos visibles
      const visibleProductIds = productos.map((product) => product.id);
      setSelectedProducts((prev) => {
        // Combinar los IDs ya seleccionados con los nuevos, evitando duplicados
        const combined = [...new Set([...prev, ...visibleProductIds])];
        return combined;
      });
    } else {
      // Deseleccionar solo los productos visibles
      const visibleProductIds = productos.map((product) => product.id);
      setSelectedProducts((prev) =>
        prev.filter((id) => !visibleProductIds.includes(id))
      );
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full space-y-2 p-6">
      {/* Barra de búsqueda */}
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

        <Button
          onClick={() => setShowBatchDialog(true)}
          variant="secondary"
          size="sm"
          disabled={selectedProducts.length === 0}
        >
          Edición por lotes ({selectedProducts.length})
        </Button>
      </div>

      {/* Tabla - Cuerpo */}
      <div className="rounded-md border max-h-[70vh] overflow-y-auto">
        <div className="relative">
          <Table>
            <TableHeader className=" border-b bg-muted/90">
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.id} className="font-bold text-l">
                    {typeof column.header === "function"
                      ? column.header({ column })
                      : column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="overflow-y-auto">
              {productos.length > 0 ? (
                productos.map((row) => (
                  <TableRow key={row.id}>
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        {column.cell({ row })}
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
      </div>

      {/* Paginador */}
      <div className="flex items-center justify-between px-2 mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Mostrar</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setCurrentPage(1);
              fetchProductos(1);
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-700">por página</span>
        </div>

        <div className="text-sm text-gray-700">
          Mostrando {(currentPage - 1) * pageSize + 1} a{" "}
          {Math.min(currentPage * pageSize, totalProducts)} de {totalProducts}{" "}
          productos
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchProductos(1)}
            disabled={currentPage === 1}
          >
            Primera
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchProductos(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <div className="flex items-center gap-1">
            <span className="text-sm">Página</span>
            <Input
              className="w-16 h-8"
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page > 0 && page <= totalPages) {
                  setCurrentPage(page);
                  fetchProductos(page);
                }
              }}
            />
            <span className="text-sm">de {totalPages}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchProductos(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchProductos(totalPages)}
            disabled={currentPage === totalPages}
          >
            Última
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

      <Dialog open={showBatchDialog} onOpenChange={setShowBatchDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edición por lotes</DialogTitle>
            <DialogDescription>
              Selecciona la operación que deseas realizar en los{" "}
              {selectedProducts.length} productos seleccionados
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-4">
              <Select value={batchOperation} onValueChange={setBatchOperation}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selecciona operación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="precio">Modificar precios</SelectItem>
                  <SelectItem value="unidad">
                    Cambiar unidad de medida
                  </SelectItem>
                  <SelectItem value="categoria">Asignar categoría</SelectItem>
                  <SelectItem value="subcategoria">
                    Asignar subcategoría
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {batchOperation === "categoria" ? (
              <Select value={newCategoria} onValueChange={setNewCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.attributes.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : batchOperation === "subcategoria" ? (
              <Select
                value={newSubcategoria}
                onValueChange={setNewSubcategoria}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona subcategoría" />
                </SelectTrigger>
                <SelectContent>
                  {subcategorias.map((subcategoria) => (
                    <SelectItem key={subcategoria.id} value={subcategoria.id}>
                      {subcategoria.attributes.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : batchOperation === "precio" ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    placeholder="Porcentaje de cambio"
                    value={percentageChange}
                    onChange={(e) => setPercentageChange(e.target.value)}
                  />
                  <Button onClick={handleShowPreview}>Vista previa</Button>
                </div>

                {previewProducts.length > 0 && (
                  <div className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-medium">Vista previa (5 productos)</h4>
                    {previewProducts.map((product) => (
                      <div key={product.id} className="text-sm ">
                        <p className="font-l font-bold mt-4">
                          {product.nombre}
                        </p>
                        {Object.entries(product.precios.actuales || {}).map(
                          ([key, value]) => (
                            <div key={key} className="flex space-x-2">
                              <span>{key}:</span>
                              <span>${value}</span>
                              <span>→</span>
                              <span>${product.precios.nuevos[key]}</span>
                            </div>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Select
                value={newUnidadMedida}
                onValueChange={setNewUnidadMedida}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona unidad de medida" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kg.">Kg.</SelectItem>
                  <SelectItem value="Unidad">Unidad</SelectItem>
                  <SelectItem value="Porcion">Porción</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBatchDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleBatchUpdate}>Aplicar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
