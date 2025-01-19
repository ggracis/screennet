import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const ProductosBatchDialog = ({
  showBatchDialog,
  setShowBatchDialog,
  batchOperation,
  setBatchOperation,
  percentageChange,
  setPercentageChange,
  newUnidadMedida,
  setNewUnidadMedida,
  previewProducts,
  setPreviewProducts,
  newCategoria,
  setNewCategoria,
  newSubcategoria,
  setNewSubcategoria,
  productos,
  selectedProducts,
  fetchProductos,
  currentPage,
  toast,
}) => {
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

  return (
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
                <SelectItem value="unidad">Cambiar unidad de medida</SelectItem>
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
            <Select value={newSubcategoria} onValueChange={setNewSubcategoria}>
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
                      <p className="font-l font-bold mt-4">{product.nombre}</p>
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
            <Select value={newUnidadMedida} onValueChange={setNewUnidadMedida}>
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
  );
};

export default ProductosBatchDialog;
