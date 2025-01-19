import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const ProductosTable = ({
  productos,
  columns,
  handleEditProduct,
  handleDeleteProduct,
  selectedProducts,
  setSelectedProducts,
  sorting,
  fetchProductos,
  currentPage,
  setCurrentPage,
  totalPages,
  totalProducts,
  pageSize,
  setPageSize,
}) => {
  const handleProductSelect = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const visibleProductIds = productos.map((product) => product.id);
      setSelectedProducts((prev) => {
        const combined = [...new Set([...prev, ...visibleProductIds])];
        return combined;
      });
    } else {
      const visibleProductIds = productos.map((product) => product.id);
      setSelectedProducts((prev) =>
        prev.filter((id) => !visibleProductIds.includes(id))
      );
    }
  };

  const handleSort = (columnId) => {
    setSorting((prev) => {
      const isAsc = prev.column === columnId && prev.direction === "asc";
      return { column: columnId, direction: isAsc ? "desc" : "asc" };
    });
    fetchProductos(1);
  };

  return (
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
              {[10, 25, 50, 100].map((size) => (
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
    </div>
  );
};

export default ProductosTable;
