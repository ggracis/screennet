"use client";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
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

import { Card, CardContent } from "@/components/ui/card";
import FondosSelector from "./FondosSelector";

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
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [previewType, setPreviewType] = useState("image");
  const [selectedImage, setSelectedImage] = useState(null);

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

  useEffect(() => {
    if (plantilla && typeof plantilla.fondo === "string") {
      setSelectedImage(plantilla.fondo);
      const isVideo = /(\.mp4|\.mov|\.avi)$/i.test(plantilla.fondo);
      setPreviewType(isVideo ? "video" : "image");
    }
  }, [plantilla]);

  useEffect(() => {
    if (id) {
      fetchComponentes();
    }
  }, [id]);

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

        // Manejar imagen
        const imagenUrl = plantillaData.imagen?.data?.attributes?.url;
        if (imagenUrl) {
          setImagen(`${process.env.NEXT_PUBLIC_STRAPI_URL}${imagenUrl}`);
        }

        // Manejar fondo y establecer tipo
        const fondoData = plantillaData.fondo?.data?.attributes;
        if (fondoData) {
          const fondoUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}${fondoData.url}`;
          setFondo(fondoUrl);
          setSelectedImage(fondoUrl);
          // Determinar tipo basado en el MIME type
          setPreviewType(
            fondoData.mime.startsWith("video/") ? "video" : "image"
          );
        }

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
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/componentes?t=${timestamp}`);
      if (!response.ok) {
        throw new Error("Error al obtener componentes");
      }
      const data = await response.json();
      setComponentes(data.data || []);
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
    if (field === "rowSpan" || field === "colSpan") {
      // Calcular el nuevo espacio total que ocuparían todos los componentes
      const nuevoEspacioTotal = Object.entries(configComponentes).reduce(
        (total, [idx, config]) => {
          if (parseInt(idx) === index) {
            // Usar el nuevo valor para el componente que se está modificando
            const newSpan = field === "rowSpan" ? value : config.rowSpan || 1;
            const newSpanOther =
              field === "colSpan" ? value : config.colSpan || 1;
            return total + newSpan * newSpanOther;
          }
          return total + (config.rowSpan || 1) * (config.colSpan || 1);
        },
        0
      );

      // Si excede el espacio disponible, no permitir el cambio
      if (nuevoEspacioTotal > filas * columnas) {
        toast({
          title: "Error",
          description:
            "No hay suficiente espacio disponible, elimine un componente o agregue más filas o columnas",
          variant: "destructive",
        });
        return;
      }
    }

    setConfigComponentes((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  const handleProductosChange = (index, productos) => {
    setConfigComponentes((prev) => ({
      ...prev,
      [index]: { ...(prev[index] || {}), productos },
    }));
  };

  const handleFileChange = async (e, tipo = "fondo") => {
    const file = e.target.files[0];
    const MAX_SIZE_MB = 20;
    const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024;

    if (file) {
      if (file.size > MAX_SIZE) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `El archivo no debe superar los ${MAX_SIZE_MB}MB`,
        });
        return;
      }

      try {
        const formData = new FormData();
        formData.append("files", file);
        formData.append("ref", "api::plantilla.plantilla");
        formData.append("refId", id);
        formData.append("field", tipo);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`Error al subir el archivo: ${response.status}`);
        }

        const result = await response.json();
        console.log("Archivo subido:", result);

        const fileUrl = result[0].url;
        const fullUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}${fileUrl}`;

        if (tipo === "imagen") {
          setImagenPreview(fullUrl);
        } else {
          setSelectedImage(fullUrl);
          setPreviewType(file.type.startsWith("video/") ? "video" : "image");
        }

        // Actualizar el estado de la plantilla
        setPlantilla((prev) => ({
          ...prev,
          [tipo]: {
            data: {
              id: result[0].id,
              attributes: {
                url: fileUrl,
                mime: file.type,
              },
            },
          },
        }));
      } catch (error) {
        console.error("Error detallado:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error al subir el archivo",
        });
      }
    }
  };

  const handleFondoSelect = (fondo) => {
    console.log("Fondo seleccionado:", fondo);

    const fullUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}${fondo.url}`;
    setSelectedImage(fullUrl);
    setPreviewType(fondo.mime.startsWith("video/") ? "video" : "image");

    // Actualizar el estado completo de la plantilla
    setPlantilla((prev) => ({
      ...prev,
      fondo: {
        data: {
          id: fondo.id,
          attributes: {
            url: fondo.url,
            mime: fondo.mime,
          },
        },
      },
    }));
  };

  const renderComponenteSelects = () => {
    const componentesOptions = componentes.filter(
      (c) =>
        c.attributes.categoria !== "Header" &&
        c.attributes.categoria !== "Footer"
    );

    return (
      <div className="grid gap-4">
        {Array.from({ length: filas * columnas }, (_, index) => (
          <div key={index} className="p-4 bg-gray-500/[.06] rounded-lg">
            <div className="flex gap-4 mb-4">
              <Select
                onValueChange={(value) =>
                  handleComponenteChange(index + 1, value)
                }
                value={espacios[index + 1] || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Componente ${index + 1}`} />
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
            </div>

            {espacios[index + 1] && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Filas a ocupar:</Label>
                    <Input
                      type="number"
                      min="1"
                      max={filas}
                      value={configComponentes[index + 1]?.rowSpan || 1}
                      onChange={(e) =>
                        handleConfigChange(
                          index + 1,
                          "rowSpan",
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label>Columnas a ocupar:</Label>
                    <Input
                      type="number"
                      min="1"
                      max={columnas}
                      value={configComponentes[index + 1]?.colSpan || 1}
                      onChange={(e) =>
                        handleConfigChange(
                          index + 1,
                          "colSpan",
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Título:</Label>
                  <Input
                    type="text"
                    value={configComponentes[index + 1]?.titulo || ""}
                    onChange={(e) =>
                      handleConfigChange(index + 1, "titulo", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Productos:</Label>
                  <ProductosBuscador
                    selectedProducts={
                      configComponentes[index + 1]?.productos || []
                    }
                    onChange={(productos) =>
                      handleConfigChange(index + 1, "productos", productos)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const GridCell = ({
    index,
    componente,
    config,
    onConfigChange,
    componentesOptions,
    isSelected,
    onSelect,
  }) => {
    const espacioNum = index + 1;
    const productCount = config?.productos?.length || 0;

    return (
      <div
        onClick={() => onSelect(espacioNum)}
        className={`
          ${componente ? "bg-gray-700/50" : "bg-gray-800/20"} 
          rounded-lg p-2 flex flex-col items-center justify-center text-sm
          ${
            componente
              ? "border-2 border-blue-500/50"
              : "border border-gray-700"
          }
          ${isSelected ? "ring-2 ring-blue-500" : ""}
          cursor-pointer hover:bg-gray-600/50 transition-colors
        `}
        style={{
          gridRow: `span ${config?.rowSpan || 1}`,
          gridColumn: `span ${config?.colSpan || 1}`,
        }}
      >
        {componente ? (
          <div className="text-center">
            <div className="font-medium">{componente}</div>
            <div className="text-xs text-gray-400">
              {config?.rowSpan || 1}x{config?.colSpan || 1}
            </div>
            {productCount > 0 && (
              <div className="mt-1">
                <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                  {productCount} producto{productCount !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        ) : (
          <span className="text-gray-500">Espacio {espacioNum}</span>
        )}
      </div>
    );
  };

  const renderGridPreview = () => {
    const componentesOptions = componentes.filter(
      (c) =>
        c.attributes.categoria !== "Header" &&
        c.attributes.categoria !== "Footer"
    );

    // Crear una matriz para representar el grid
    const grid = Array(filas)
      .fill()
      .map(() => Array(columnas).fill(null));

    // Marcar las celdas ocupadas
    Object.entries(espacios).forEach(([index, componente]) => {
      const config = configComponentes[index] || { rowSpan: 1, colSpan: 1 };
      const row = Math.floor((parseInt(index) - 1) / columnas);
      const col = (parseInt(index) - 1) % columnas;

      // Verificar si el espacio está dentro de los límites
      if (row < filas && col < columnas) {
        // Marcar todas las celdas que ocupa este componente
        for (let r = 0; r < (config.rowSpan || 1); r++) {
          for (let c = 0; c < (config.colSpan || 1); c++) {
            if (row + r < filas && col + c < columnas) {
              grid[row + r][col + c] = parseInt(index);
            }
          }
        }
      }
    });

    // Crear array de espacios disponibles
    const espaciosDisponibles = [];
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === null) {
          const espacioNum = rowIndex * columnas + colIndex + 1;
          espaciosDisponibles.push(espacioNum);
        }
      });
    });

    return (
      <div className="space-y-6">
        <div className="border rounded-lg p-4 bg-gray-900/50">
          <h3 className="text-lg font-semibold mb-4">Vista Previa del Grid</h3>
          <div
            className="grid gap-2 bg-gray-800/50 p-4 rounded-lg"
            style={{
              gridTemplateColumns: `repeat(${columnas}, 1fr)`,
              gridTemplateRows: `repeat(${filas}, 60px)`,
            }}
          >
            {Object.entries(espacios).map(([index, componente]) => {
              const config = configComponentes[index];
              return (
                <GridCell
                  key={index}
                  index={parseInt(index) - 1}
                  componente={componente}
                  config={config}
                  onConfigChange={handleConfigChange}
                  componentesOptions={componentesOptions}
                  isSelected={selectedSpace === parseInt(index)}
                  onSelect={setSelectedSpace}
                />
              );
            })}
            {espaciosDisponibles.map((espacioNum) => (
              <GridCell
                key={`empty-${espacioNum}`}
                index={espacioNum - 1}
                componente={null}
                config={null}
                onConfigChange={handleConfigChange}
                componentesOptions={componentesOptions}
                isSelected={selectedSpace === espacioNum}
                onSelect={setSelectedSpace}
              />
            ))}
          </div>
        </div>

        {selectedSpace && (
          <div className="border rounded-lg p-4 bg-gray-900/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Configurar Espacio {selectedSpace}
              </h3>
              {espacios[selectedSpace] && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteComponente(selectedSpace)}
                >
                  Eliminar Componente
                </Button>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <Label>Componente</Label>
                <Select
                  value={espacios[selectedSpace] || ""}
                  onValueChange={(value) =>
                    handleComponenteChange(selectedSpace, value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar componente" />
                  </SelectTrigger>
                  <SelectContent>
                    {componentesOptions.map((comp) => (
                      <SelectItem key={comp.id} value={comp.attributes.nombre}>
                        {comp.attributes.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {espacios[selectedSpace] && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Filas</Label>
                      <Input
                        type="number"
                        min="1"
                        max={filas}
                        value={configComponentes[selectedSpace]?.rowSpan || 1}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          const limitedValue = Math.min(value, filas);
                          handleConfigChange(
                            selectedSpace,
                            "rowSpan",
                            limitedValue
                          );
                        }}
                      />
                    </div>
                    <div>
                      <Label>Columnas</Label>
                      <Input
                        type="number"
                        min="1"
                        max={columnas}
                        value={configComponentes[selectedSpace]?.colSpan || 1}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          const limitedValue = Math.min(value, columnas);
                          handleConfigChange(
                            selectedSpace,
                            "colSpan",
                            limitedValue
                          );
                        }}
                      />
                    </div>
                  </div>
                  {renderComponenteConfig(
                    selectedSpace,
                    espacios[selectedSpace]
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderComponenteConfig = (index, componente) => {
    // Buscar la configuración del componente en la lista de componentes
    const componenteInfo = componentes.find(
      (c) => c.attributes.nombre === componente
    );

    if (!componenteInfo) return null;

    // Si es un componente personalizado
    if (componenteInfo.attributes.categoria === "Personalizado") {
      const config = componenteInfo.attributes.configuracion;
      return (
        <div className="space-y-4">
          <div>
            <Label>{config.titulo}</Label>
            <Input
              type="text"
              value={configComponentes[index]?.data || ""}
              onChange={(e) =>
                handleConfigChange(index, "data", e.target.value)
              }
            />
          </div>
        </div>
      );
    }

    // Si es un componente regular, mostrar los campos estándar
    return (
      <div className="space-y-4">
        <div>
          <Label>Título</Label>
          <Input
            value={configComponentes[index]?.titulo || ""}
            onChange={(e) =>
              handleConfigChange(index, "titulo", e.target.value)
            }
          />
        </div>
        <div>
          <Label>Productos</Label>
          <ProductosBuscador
            selectedProducts={configComponentes[index]?.productos || []}
            onChange={(productos) =>
              handleConfigChange(index, "productos", productos)
            }
          />
        </div>
      </div>
    );
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

    // Modificar cómo se agrega el fondo
    if (plantilla?.fondo?.data?.id) {
      plantillaData.data.fondo = {
        id: plantilla.fondo.data.id,
      };
    }

    try {
      console.log("Datos a enviar:", JSON.stringify(plantillaData, null, 2));
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

  const handleDeleteComponente = (index) => {
    setEspacios((prev) => {
      const newEspacios = { ...prev };
      delete newEspacios[index];
      return newEspacios;
    });

    setConfigComponentes((prev) => {
      const newConfig = { ...prev };
      delete newConfig[index];
      return newConfig;
    });

    setSelectedSpace(null);

    toast({
      title: "Componente eliminado",
      description: "El componente ha sido eliminado correctamente",
    });
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
                src={imagen}
                alt="Imagen"
                width={720}
                height={480}
                className="mt-2"
              />
            )}
            <Input
              type="file"
              onChange={(e) => handleFileChange(e, "imagen")}
              accept="image/*"
              className="mt-2 w-full bg-gray-900/50"
            />
          </div>

          <div className="w-1/2">
            <Label className="block mb-2">Fondo:</Label>
            <Card className="mb-4">
              <CardContent className="relative w-full h-[300px] p-0 overflow-hidden">
                {previewType === "image" ? (
                  <img
                    src={selectedImage || "/placeholder-image.jpg"}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    key={selectedImage}
                    src={selectedImage}
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover"
                  />
                )}
              </CardContent>
            </Card>
            <div className="grid w-full items-center gap-1.5">
              <div className="flex gap-2">
                <Input
                  id="fondo"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,video/mp4,video/quicktime,video/x-msvideo"
                  onChange={handleFileChange}
                  className="mt-2 w-full bg-gray-900/50"
                />
                <FondosSelector
                  onSelect={handleFondoSelect}
                  selectedFondo={selectedImage}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Sube una imagen o video (máx. 20MB) o selecciona uno de la
                biblioteca
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <Label className="block mb-2">Header:</Label>
            <Select
              onValueChange={setHeaderComponente}
              value={headerComponente}
              required
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
              required
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

        <div>{renderGridPreview()}</div>

        <Button type="submit" variant="secondary" className="mt-6 w-full">
          {isNewPlantilla ? "Crear Plantilla" : "Guardar Cambios"}
        </Button>
      </form>
    </div>
  );
};

export default PlantillasEditor;
