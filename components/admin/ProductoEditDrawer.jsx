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
import useProductStore from "@/stores/useProductStore";
import { Label } from "../ui/label";
import Image from "next/image";
import useFormatoMoneda from "@/hooks/useFormatoMoneda";
import formatoMoneda from "@/hooks/useFormatoMoneda";
import { formatPrice } from "@/utils/formatters";

export default function ProductoEditDrawer({
  productId,
  isOpen,
  onClose,
  onProductUpdated,
}) {
  const { toast } = useToast();
  const { addProduct, updateProduct } = useProductStore();

  const [producto, setProducto] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const { register, handleSubmit, setValue, watch, reset } = useForm();

  const isNewProduct = !productId;

  const [unidadMedida, setUnidadMedida] = useState("Kg."); // Estado para unidad de medida
  const [titulosVariantes, setTitulosVariantes] = useState([]); // Estado para títulos de variantes
  const [precios, setPrecios] = useState({}); // Estado para precios
  const [mediaFiles, setMediaFiles] = useState([]); // Estado para archivos multimedia
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga

  const formatPrice = useFormatoMoneda;

  useEffect(() => {
    if (isOpen) {
      resetForm();
      fetchCategorias();
      fetchSubcategorias();
      if (!isNewProduct) {
        fetchProducto();
      }
    }
  }, [isOpen, productId, isNewProduct, reset]);

  const resetForm = () => {
    reset({
      nombre: "",
      descripcion: "",
      categoria: "",
      subcategoria: "",
    });
    setProducto(null);
    setPrecios({});
    setUnidadMedida("Kg.");
    setTitulosVariantes([]);
    setMediaFiles([]);
  };

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

      // Establecer archivos multimedia
      setMediaFiles(data.attributes.foto?.data || []);
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
      const preciosFormateados = {};
      titulosVariantes.forEach((titulo) => {
        preciosFormateados[titulo] = precios[titulo] || "";
      });

      // Asegurarse de que los datos están en el formato correcto
      const productData = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precios: preciosFormateados,
        unidadMedida,
        categoria: data.categoria
          ? { connect: [parseInt(data.categoria)] }
          : null,
        subcategoria: data.subcategoria
          ? { connect: [parseInt(data.subcategoria)] }
          : null,
      };

      const response = await fetch(`/api/productos/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Error al actualizar el producto");
      }

      const result = await response.json();

      // Update product in store
      if (isNewProduct) {
        addProduct(result);
      } else {
        updateProduct(result);
      }

      onProductUpdated(result);
      onClose();
    } catch (error) {
      console.error("Error actualizando producto:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el producto",
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

  const handleFileChange = async (e) => {
    setIsLoading(true); // Iniciar carga
    const files = Array.from(e.target.files);
    const MAX_SIZE_MB = 20;
    const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024;

    const validFiles = files.filter((file) => file.size <= MAX_SIZE);

    if (validFiles.length !== files.length) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Algunos archivos superan los ${MAX_SIZE_MB}MB y no se subirán.`,
      });
    }

    try {
      console.log("=== INICIO CARGA DE ARCHIVOS ===");
      const formData = new FormData();
      validFiles.forEach((file) => {
        const timestamp = Date.now();
        const newFileName = `producto_${productId}_${timestamp}_${file.name}`;
        console.log("Preparando archivo:", newFileName);
        const renamedFile = new File([file], newFileName, { type: file.type });
        formData.append("files", renamedFile);
      });

      console.log("Enviando archivos al servidor...");
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("Error en la respuesta de upload:", errorText);
        throw new Error(
          `Error al subir los archivos: ${uploadResponse.status} - ${errorText}`
        );
      }

      const uploadResult = await uploadResponse.json();
      console.log(
        "Resultado de la subida:",
        JSON.stringify(uploadResult, null, 2)
      );

      const fileIds = uploadResult.flat().map((file) => file.id);
      console.log("IDs de archivos a conectar:", fileIds);

      // Modificar la estructura para Strapi v4
      const updateData = {
        data: {
          nombre: producto.attributes.nombre,
          descripcion: producto.attributes.descripcion,
          precios: producto.attributes.precios,
          unidadMedida: producto.attributes.unidadMedida,
          // Mantener las relaciones existentes
          categoria: producto.attributes.categoria?.data?.id,
          subcategoria: producto.attributes.subcategoria?.data?.id,
          // Formato específico para Strapi v4
          foto: {
            set: fileIds, // Usar 'set' en lugar de 'connect'
          },
        },
      };

      console.log(
        "Datos de actualización preparados:",
        JSON.stringify(updateData, null, 2)
      );

      const connectResponse = await fetch(`/api/productos/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const connectResponseText = await connectResponse.text();
      console.log("Respuesta cruda de conexión:", connectResponseText);

      if (!connectResponse.ok) {
        throw new Error(
          `Error al conectar los archivos: ${connectResponse.status} - ${connectResponseText}`
        );
      }

      // Esperar un momento antes de recargar el producto
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fetchProducto();

      setMediaFiles((prev) => [...prev, ...uploadResult.flat()]);
    } catch (error) {
      console.error("=== ERROR EN CARGA DE ARCHIVOS ===");
      console.error("Error completo:", error);
      console.error("Stack:", error.stack);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error al subir los archivos",
      });
    } finally {
      setIsLoading(false); // Finalizar carga
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      const response = await fetch(`/api/upload/files/${fileId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar el archivo: ${response.status}`);
      }

      // Actualizar mediaFiles sin usar setState para evitar re-render
      const updatedMediaFiles = mediaFiles.filter((file) => file.id !== fileId);
      setMediaFiles(updatedMediaFiles);
    } catch (error) {
      console.error("Error al eliminar el archivo:", error);
    }
  };

  const formatearPrecio = (precio) => {
    return useFormatoMoneda(precio);
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-3xl">
          <DrawerHeader>
            <DrawerTitle className="titulo">
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
                      <SelectItem value="Porcion">Porción/Tamaño</SelectItem>
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
                      placeholder={formatearPrecio(0)}
                      inputMode="decimal"
                      defaultValue={precios[titulo] || ""}
                      onChange={(e) => {
                        setPrecios((prev) => ({
                          ...prev,
                          [titulo]: e.target.value,
                        }));
                      }}
                    />
                    {precios[titulo] && (
                      <div className="text-xs texto text-muted-foreground mt-1">
                        {formatPrice(precios[titulo])}
                      </div>
                    )}
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
              <div className="flex flex-col gap-3">
                <Label>Fotos y Videos</Label>
                <Input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileChange}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {mediaFiles
                    .filter((file) => !file.markedForDeletion)
                    .map((file) => (
                      <div key={file.id} className="relative">
                        {file.attributes?.mime?.startsWith("image/") &&
                        file.attributes?.url ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${file.attributes.url}`}
                            alt={file.attributes.name}
                            width={100}
                            height={100}
                            className="object-cover rounded"
                          />
                        ) : file.attributes?.url ? (
                          <video
                            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${file.attributes.url}`}
                            width={100}
                            height={100}
                            className="object-cover rounded"
                            controls
                          />
                        ) : null}

                        <Button
                          variant="destructive"
                          size="sm"
                          title="Eliminar foto"
                          className="absolute top-0 right-0"
                          onClick={(e) => {
                            e.stopPropagation(); // Evitar que el drawer se cierre
                            handleDeleteFile(file.id);
                          }}
                        >
                          X
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
              {isLoading && <p>Cargando...</p>}{" "}
              {/* Mostrar indicador de carga */}
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
