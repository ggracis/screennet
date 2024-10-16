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
import { useToast } from "@/hooks/use-toast";

import { Label } from "./ui/label";

export default function ProductoEditDrawer({
  productId,
  isOpen,
  onClose,
  onProductUpdated,
}) {
  const { toast } = useToast();

  const [producto, setProducto] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const { register, handleSubmit, setValue, watch, reset } = useForm();

  const isNewProduct = !productId;

  const [unidadMedida, setUnidadMedida] = useState("Kg."); // Estado para unidad de medida
  const [titulosVariantes, setTitulosVariantes] = useState([]); // Estado para títulos de variantes
  const [precios, setPrecios] = useState({}); // Estado para precios

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
      setValue("categoria", data.attributes.categoria.data?.id.toString());
      setValue(
        "subcategoria",
        data.attributes.subcategoria.data?.id.toString()
      );

      // Establecer precios y unidad de medida
      const preciosData = data.attributes.precios || {};
      setPrecios(preciosData);
      const unidad = data.attributes.unidadMedida || "Kg.";
      setUnidadMedida(unidad);
      setTitulosVariantes(generarTitulosVariantes(unidad));
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
      // Crear un objeto de precios en el formato correcto
      const preciosFormateados = {};
      titulosVariantes.forEach((titulo) => {
        preciosFormateados[titulo] = precios[titulo] || ""; // Asignar el precio correspondiente
      });

      const productData = {
        ...data,
        precios: preciosFormateados, // Enviar precios como objeto
        unidadMedida, // Asegurarse de enviar la unidad de medida
      };

      const url = isNewProduct
        ? "/api/productos"
        : `/api/productos/${productId}`;
      const method = isNewProduct ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(
          isNewProduct
            ? "Error al crear el producto"
            : "Error al actualizar el producto"
        );
      }

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
        isNewProduct
          ? "Error creando producto:"
          : "Error actualizando producto:",
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

  const generarTitulosVariantes = (unidad) => {
    switch (unidad) {
      case "Kg.":
        return ["1/4 Kg.", "1/2 Kg.", "1 Kg."];
      case "Unidad":
        return ["C/U", "1/2 Doc.", "1 Doc."];
      case "Porcion":
        return ["Chico", "Mediano", "Grande"];
      default:
        return [];
    }
  };

  // Actualizar el efecto para establecer los títulos y precios
  useEffect(() => {
    if (producto) {
      const unidad = producto.attributes.unidadMedida || "Kg.";
      setUnidadMedida(unidad);
      setTitulosVariantes(generarTitulosVariantes(unidad));
      setPrecios(producto.attributes.precios || {});
    }
  }, [producto]);

  // En la función handleUnidadMedidaChange
  const handleUnidadMedidaChange = (value) => {
    const unidad = value; // Cambiar a recibir el valor directamente
    setUnidadMedida(unidad);
    const nuevosTitulos = generarTitulosVariantes(unidad);
    setTitulosVariantes(nuevosTitulos);

    // Inicializar precios como un objeto vacío
    const nuevosPrecios = {};
    nuevosTitulos.forEach((titulo) => {
      nuevosPrecios[titulo] = ""; // Inicializar cada precio como vacío
    });
    setPrecios(nuevosPrecios); // Guardar precios como objeto
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
              <div className="flex gap-3">
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

              <div className="flex gap-3">
                <div className="flex-1 w-1/2">
                  <Label>Unidad de Medida</Label>
                  <Select
                    onValueChange={handleUnidadMedidaChange}
                    value={unidadMedida}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una unidad de medida" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kg.">Kg.</SelectItem>
                      <SelectItem value="Unidad">Unidad</SelectItem>
                      <SelectItem value="Porcion">Porción</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3">
                {titulosVariantes.map((titulo, index) => (
                  <div className="flex-1" key={index}>
                    <Label>{titulo}</Label>
                    <Input
                      {...register(`precios.${titulo}`)}
                      type="number"
                      step="0.25"
                      min="0"
                      max="999999.99"
                      placeholder="0.00"
                      inputMode="decimal"
                      defaultValue={precios[titulo] || ""}
                      onChange={(e) => {
                        setPrecios((prev) => ({
                          ...prev,
                          [titulo]: e.target.value,
                        }));
                      }}
                    />
                  </div>
                ))}
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
