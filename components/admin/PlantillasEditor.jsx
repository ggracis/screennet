"use client";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import ProductosBuscador from "./ProductosBuscador";

const PlantillasEditor = ({ isNewPlantilla }) => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [plantilla, setPlantilla] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [columnas, setColumnas] = useState(1);
  const [filas, setFilas] = useState(1);
  const [imagen, setImagen] = useState("");
  const [fondo, setFondo] = useState("");
  const [imagenFile, setImagenFile] = useState(null);
  const [fondoFile, setFondoFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [fondoPreview, setFondoPreview] = useState(null);
  const [componentes, setComponentes] = useState([]);
  const [espacios, setEspacios] = useState({});
  const [headerComponente, setHeaderComponente] = useState("");
  const [footerComponente, setFooterComponente] = useState("");
  const [configComponentes, setConfigComponentes] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const initializeData = async () => {
      await fetchComponentes();
      if (!isNewPlantilla) {
        console.log("No es nueva plantilla");
        await fetchPlantilla();
      }
      setIsLoading(false);
    };
    initializeData();
  }, [isNewPlantilla]);

  const fetchPlantilla = async () => {
    try {
      const response = await fetch(`/api/plantillas/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.plantilla) {
        const plantillaData = data.plantilla.attributes;
        setPlantilla(plantillaData);
        setNombre(plantillaData.nombre);
        setDescripcion(plantillaData.descripcion);
        setColumnas(plantillaData.columnas);
        setFilas(plantillaData.filas);
        setImagen(plantillaData.imagen?.data?.attributes?.url || "");
        setFondo(plantillaData.fondo?.data?.attributes?.url || "");
        setEspacios(plantillaData.componentes?.espacios || {});
        setHeaderComponente(plantillaData.componentes?.header || "");
        setFooterComponente(plantillaData.componentes?.footer || "");
        setConfigComponentes(
          plantillaData.componentes?.config_componentes || {}
        );
      } else {
        throw new Error("Datos de plantilla no encontrados");
      }
    } catch (error) {
      console.error("Error fetching plantilla:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la plantilla",
        variant: "destructive",
      });
    }
  };

  const fetchComponentes = async () => {
    try {
      const response = await fetch("/api/componentes");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setComponentes(data.data);
    } catch (error) {
      console.error("Error fetching componentes:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los componentes",
        variant: "destructive",
      });
    }
  };

  const handleComponenteChange = (index, value) => {
    setEspacios((prev) => ({ ...prev, [index]: value }));
    if (!configComponentes[index]) {
      setConfigComponentes((prev) => ({
        ...prev,
        [index]: { productos: [], titulo: `Productos ${index}` },
      }));
    }
  };

  const handleConfigChange = (index, field, value) => {
    setConfigComponentes((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: value },
    }));
  };

  const handleProductosChange = (index, productos) => {
    setConfigComponentes((prev) => ({
      ...prev,
      [index]: { ...(prev[index] || {}), productos },
    }));
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return handleError("El archivo no debe superar los 5MB");
      }
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        return handleError(
          "Solo se permiten archivos de imagen (JPEG, PNG, GIF, WEBP)"
        );
      }

      if (type === "imagen") {
        setImagenFile(file);
        setImagenPreview(URL.createObjectURL(file));
      } else {
        setFondoFile(file);
        setFondoPreview(URL.createObjectURL(file));
      }

      // Subir el archivo inmediatamente
      await uploadFile(file, type);
    }
  };

  const uploadFile = async (file, type) => {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("ref", "api::plantilla.plantilla");
    formData.append("refId", id);
    formData.append("field", type === "imagen" ? "imagen" : "fondo");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error al subir el ${type}`);
      }

      const result = await response.json();
      console.log(`${type} subido:`, result);

      // Actualizar el estado local con la nueva URL del archivo
      if (type === "imagen") {
        setImagen(result[0].url);
      } else {
        setFondo(result[0].url);
      }

      toast({
        title: "Éxito",
        description: `${type} actualizado correctamente`,
      });
    } catch (error) {
      handleError(`Error al subir el ${type}`, error);
    }
  };

  const renderComponenteSelects = () => {
    const componentesOptions = componentes.filter(
      (c) =>
        c.attributes.categoria !== "Header" &&
        c.attributes.categoria !== "Footer"
    );

    return Array.from({ length: filas }, (_, rowIndex) => (
      <div key={rowIndex} className="flex gap-2 mb-2">
        {Array.from({ length: columnas }, (_, colIndex) => {
          const index = rowIndex * columnas + colIndex + 1;
          return (
            <div key={colIndex} className="flex-1 p-4 bg-gray-500/[.06]">
              <Select
                onValueChange={(value) => handleComponenteChange(index, value)}
                value={espacios[index] || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Componente ${index}`} />
                </SelectTrigger>
                <SelectContent>
                  {componentesOptions.map((componente) => (
                    <SelectItem
                      key={componente.id}
                      value={componente.attributes.nombre}
                    >
                      {componente.attributes.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {espacios[index] && (
                <div className="mt-2">
                  <Label className="block mb-2">Titulo:</Label>
                  <Input
                    type="text"
                    value={configComponentes[index]?.titulo || ""}
                    onChange={(e) =>
                      handleConfigChange(index, "titulo", e.target.value)
                    }
                    className="border rounded p-2 w-full"
                  />
                  <Label className="block mb-2 mt-2">Productos:</Label>
                  <ProductosBuscador
                    selectedProducts={configComponentes[index]?.productos || []}
                    onChange={(productos) =>
                      handleProductosChange(index, productos)
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const plantillaData = {
      data: {
        nombre,
        descripcion,
        columnas: parseInt(columnas),
        filas: parseInt(filas),
        componentes: {
          header: headerComponente,
          footer: footerComponente,
          espacios,
          config_componentes: configComponentes,
        },
      },
    };

    try {
      const url = isNewPlantilla ? "/api/plantillas" : `/api/plantillas/${id}`;
      const method = isNewPlantilla ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plantillaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Error desconocido al procesar la plantilla"
        );
      }

      toast({
        title: "Éxito",
        description: isNewPlantilla
          ? "Plantilla creada correctamente"
          : "Plantilla actualizada correctamente",
      });
      router.push("/admin/plantillas");
    } catch (error) {
      console.error("Error processing plantilla:", error);
      toast({
        title: "Error",
        description: `Error al ${
          isNewPlantilla ? "crear" : "actualizar"
        } la plantilla: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {isNewPlantilla
          ? "Crear Nueva Plantilla"
          : `Editar Plantilla: ${nombre}`}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="block mb-2">Nombre:</Label>
          <Input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <Label className="block mb-2">Descripción:</Label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <Label className="block mb-2">Imagen:</Label>
            {imagenPreview && (
              <Image
                src={imagenPreview}
                alt="Imagen Preview"
                width={100}
                height={100}
                className="mt-2"
              />
            )}
            {imagen && !imagenPreview && (
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_URL}/${imagen}`}
                alt="Imagen"
                width={100}
                height={100}
                className="mt-2"
              />
            )}
            <Input
              type="file"
              onChange={(e) => handleFileChange(e, "imagen")}
              accept="image/*"
            />
          </div>

          <div className="w-1/2">
            <Label className="block mb-2">Fondo:</Label>
            {fondoPreview && (
              <Image
                src={fondoPreview}
                alt="Fondo Preview"
                width={100}
                height={100}
                className="mt-2"
              />
            )}
            {fondo && !fondoPreview && (
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_URL}/${fondo}`}
                alt="Fondo"
                width={100}
                height={100}
                className="mt-2"
              />
            )}
            <Input
              type="file"
              onChange={(e) => handleFileChange(e, "fondo")}
              accept="image/*"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <Label className="block mb-2">Header:</Label>
            <Select
              onValueChange={setHeaderComponente}
              value={headerComponente}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar header" />
              </SelectTrigger>
              <SelectContent>
                {componentes
                  .filter((c) => c.attributes.categoria === "Header")
                  .map((componente) => (
                    <SelectItem
                      key={componente.id}
                      value={componente.attributes.nombre}
                    >
                      {componente.attributes.nombre}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-1/2">
            <Label className="block mb-2">Footer:</Label>
            <Select
              onValueChange={setFooterComponente}
              value={footerComponente}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar footer" />
              </SelectTrigger>
              <SelectContent>
                {componentes
                  .filter((c) => c.attributes.categoria === "Footer")
                  .map((componente) => (
                    <SelectItem
                      key={componente.id}
                      value={componente.attributes.nombre}
                    >
                      {componente.attributes.nombre}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex gap-4">
          <div className="w-1/2">
            <Label className="block mb-2">Columnas:</Label>
            <Input
              type="number"
              value={columnas}
              onChange={(e) => setColumnas(parseInt(e.target.value) || 1)}
              className="border rounded p-2 w-full"
              min="1"
              max="12"
              step="1"
            />
          </div>
          <div className="w-1/2">
            <Label className="block mb-2">Filas:</Label>
            <Input
              type="number"
              value={filas}
              onChange={(e) => setFilas(parseInt(e.target.value) || 1)}
              className="border rounded p-2 w-full"
              min="1"
              max="12"
              step="1"
            />
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">{renderComponenteSelects()}</div>

        <Button type="submit" variant="secondary" className="mt-4 w-full">
          {isNewPlantilla ? "Crear Plantilla" : "Guardar Cambios"}
        </Button>
      </form>
    </div>
  );
};

export default PlantillasEditor;
