"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Label } from "./ui/label";

export default function ProductoEditDrawer({
  productId,
  isOpen,
  onClose,
  onProductUpdated,
}) {
  const [producto, setProducto] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const { register, handleSubmit, setValue, watch, reset } = useForm();

  const isNewProduct = !productId;

  useEffect(() => {
    if (isOpen) {
      fetchCategorias();
      fetchSubcategorias();
      if (!isNewProduct) {
        fetchProducto();
      } else {
        reset({
          nombre: "",
          descripcion: "",
          precioChico: "",
          precioMediano: "",
          precioGrande: "",
          categoria: "",
          subcategoria: "",
        });
      }
    }
  }, [isOpen, productId, isNewProduct, reset]);

  const fetchProducto = async () => {
    try {
      const response = await fetch(`/api/productos/${productId}`);
      if (!response.ok) throw new Error("Error al obtener el producto");
      const responseData = await response.json();
      const data = responseData.data;
      setProducto(data);
      // Establecer los valores del formulario
      setValue("nombre", data.attributes.nombre);
      setValue("descripcion", data.attributes.descripcion);
      setValue("precioChico", data.attributes.precios.Chico);
      setValue("precioMediano", data.attributes.precios.Mediano);
      setValue("precioGrande", data.attributes.precios.Grande);
      setValue("categoria", data.attributes.categoria.data?.id.toString());
      setValue(
        "subcategoria",
        data.attributes.subcategoria.data?.id.toString()
      );
    } catch (error) {
      console.error("Error fetching producto:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar el producto",
        variant: "destructive",
      });
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch("/api/categorias");
      if (!response.ok) throw new Error("Error al obtener las categorías");
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error fetching categorias:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las categorías",
        variant: "destructive",
      });
    }
  };

  const fetchSubcategorias = async () => {
    try {
      const response = await fetch("/api/subcategorias");
      if (!response.ok) throw new Error("Error al obtener las subcategorías");
      const data = await response.json();
      setSubcategorias(data);
    } catch (error) {
      console.error("Error fetching subcategorias:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las subcategorías",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      const url = isNewProduct
        ? "/api/productos"
        : `/api/productos/${productId}`;
      const method = isNewProduct ? "POST" : "PUT";

      const productData = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precioChico: data.precioChico,
        precioMediano: data.precioMediano,
        precioGrande: data.precioGrande,
        categoria: data.categoria,
        subcategoria: data.subcategoria,
      };

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok)
        throw new Error(
          isNewProduct
            ? "Error al crear el producto"
            : "Error al actualizar el producto"
        );

      const result = await response.json();
      toast({
        title: "Éxito",
        description: isNewProduct
          ? "Producto creado correctamente"
          : "Producto actualizado correctamente",
      });
      onProductUpdated(result);
      onClose();
    } catch (error) {
      console.error(
        isNewProduct ? "Error creating producto:" : "Error updating producto:",
        error
      );
      toast({
        title: "Error",
        description: isNewProduct
          ? "No se pudo crear el producto"
          : "No se pudo actualizar el producto",
        variant: "destructive",
      });
    }
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-3xl">
          <DrawerHeader>
            <DrawerTitle>
              {isNewProduct
                ? "Crear nuevo producto"
                : `Editar ${producto?.attributes.nombre || ""}`}
            </DrawerTitle>
            <DrawerDescription>
              {isNewProduct
                ? "Ingresa los detalles del nuevo producto."
                : "Realiza cambios en el producto aquí."}
            </DrawerDescription>
          </DrawerHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 p-4">
              <div className="flex  gap-3">
                <div className="flex-1 w-1/2">
                  <Label>Nombre</Label>
                  <Input
                    {...register("nombre")}
                    placeholder="Nombre del producto"
                    required
                    defaultValue={producto?.attributes.nombre || ""}
                  />
                </div>

                <div className="flex-1 w-1/2">
                  <Label>Descripción</Label>
                  <Input
                    {...register("descripcion")}
                    placeholder="Descripción"
                    defaultValue={producto?.attributes.descripcion || ""}
                  />
                </div>
              </div>

              <div className="flex  gap-3">
                <div className="flex-1 w-1/3">
                  <Label>Precio Chico</Label>
                  <Input
                    {...register("precioChico")}
                    type="number"
                    step="0.25"
                    min="0"
                    max="999999.99"
                    placeholder="0.00"
                    inputMode="decimal"
                    defaultValue={producto?.attributes.precios.Chico || ""}
                  />
                </div>
                <div className="flex-1 w-1/3">
                  <Label>Precio Mediano</Label>
                  <Input
                    {...register("precioMediano")}
                    type="number"
                    step="0.25"
                    min="0"
                    max="999999.99"
                    placeholder="0.00"
                    inputMode="decimal"
                  />
                </div>
                <div className="flex-1 w-1/3">
                  <Label>Precio Grande</Label>
                  <Input
                    {...register("precioGrande")}
                    type="number"
                    step="0.25"
                    min="0"
                    max="999999.99"
                    placeholder="0.00"
                    inputMode="decimal"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 w-1/2">
                  <Label>Categoría</Label>
                  <Select
                    onValueChange={(value) => setValue("categoria", value)}
                    value={watch("categoria")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.attributes.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 w-1/2">
                  <Label>Subcategoría</Label>
                  <Select
                    onValueChange={(value) => setValue("subcategoria", value)}
                    value={watch("subcategoria")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una subcategoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategorias.map((subcat) => (
                        <SelectItem
                          key={subcat.id}
                          value={subcat.id.toString()}
                        >
                          {subcat.attributes.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DrawerFooter>
                <div className="flex gap-3">
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-1/2">
                      Cancelar
                    </Button>
                  </DrawerClose>
                  <Button type="submit" className="w-1/2">
                    {isNewProduct ? "Crear producto" : "Guardar cambios"}
                  </Button>
                </div>
              </DrawerFooter>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
