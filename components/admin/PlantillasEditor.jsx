"use client";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState, useCallback, Suspense } from "react";

import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import ProductosBuscador from "./ProductosBuscador";

import { Card, CardContent } from "@/components/ui/card";
import PlantillasPreview from "./PlantillasPreview";
import { GradientPicker } from "../ui/GradientPicker";

import dynamic from "next/dynamic";
import ComponenteSelector from "./ComponenteSelector";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import FontSelector from "../ui/FontSelector";

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
  const [previewKey, setPreviewKey] = useState(0);
  const [fondo1, setFondo1] = useState("");
  const [overlayOpacity, setOverlayOpacity] = useState(50);
  const [componentesCache, setComponentesCache] = useState({});
  const [selectedHeader, setSelectedHeader] = useState(null);
  const [selectedFooter, setSelectedFooter] = useState(null);
  const [cachedProducts, setCachedProducts] = useState({});
  const [titleFont, setTitleFont] = useState("");
  const [textFont, setTextFont] = useState("");

  const determineMediaType = (url) => {
    if (!url) return null;
    const cleanUrl = url.replace(/^url\((.*)\)$/, "$1");
    console.log("Clean URL:", cleanUrl);

    if (/(\.mp4|\.mov|\.avi|\.webm)$/i.test(cleanUrl)) {
      console.log("Detected as video");
      return "video";
    } else if (/(\.jpg|\.jpeg|\.png|\.gif|\.webp)$/i.test(cleanUrl)) {
      console.log("Detected as image");
      return "image";
    } else if (url.startsWith("linear-gradient")) {
      console.log("Detected as style");
      return "style";
    } else if (url.startsWith("#")) {
      console.log("Detected as style");
      return "style";
    }
    console.log("Defaulting to image");
    return "image";
  };

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
    if (plantilla && typeof plantilla.fondo1 === "string") {
      setFondo1(plantilla.fondo1);
      const mediaType = determineMediaType(plantilla.fondo1);
      setPreviewType(mediaType);
    }
  }, [plantilla]);

  useEffect(() => {
    if (fondo1) {
      const mediaType = determineMediaType(fondo1);
      setPreviewType(mediaType);
    }
  }, [fondo1]);

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
      console.log("Datos de plantilla:", data);
      if (data.id) {
        const plantillaData = data.attributes;
        setPlantilla(plantillaData);
        setNombre(plantillaData.nombre);
        setDescripcion(plantillaData.descripcion);
        setColumnas(plantillaData.columnas);
        setFilas(plantillaData.filas);

        // Manejar fondo1
        if (plantillaData.fondo1) {
          setFondo1(plantillaData.fondo1);
          const cleanUrl = plantillaData.fondo1.replace(/^url\((.*)\)$/, "$1");
          const isVideo = /(\.mp4|\.mov|\.avi)$/i.test(cleanUrl);
          setPreviewType(
            isVideo
              ? "video"
              : plantillaData.fondo1.startsWith("linear-gradient")
              ? "style"
              : "image"
          );
        }

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
          setPreviewType(
            fondoData.mime?.startsWith("video/") ? "video" : "image"
          );
        }

        setEspacios(plantillaData.componentes?.espacios || {});
        setHeaderComponente(plantillaData.componentes?.header || "");
        setFooterComponente(plantillaData.componentes?.footer || "");
        setConfigComponentes(
          plantillaData.componentes?.config_componentes || {}
        );
        setOverlayOpacity(plantillaData.overlayOpacity || 50);

        // Establecer componentes seleccionados
        const headerComp = componentes.find(
          (c) => c.id === plantillaData.componentes?.header
        );
        const footerComp = componentes.find(
          (c) => c.id === plantillaData.componentes?.footer
        );
        setSelectedHeader(headerComp || null);
        setSelectedFooter(footerComp || null);
        setTitleFont(
          plantillaData.componentes?.config_global?.tipografia?.titulos || ""
        );
        setTextFont(
          plantillaData.componentes?.config_global?.tipografia?.textos || ""
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
    // Almacenar solo el ID del componente en espacios
    setEspacios((prev) => ({ ...prev, [index]: value?.id || null }));

    if (!configComponentes[index] && value) {
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
      console.log("handleFileChange - File type:", file.type);
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
          setFondo1(fullUrl);
          const mediaType = file.type.startsWith("video/") ? "video" : "image";
          console.log("handleFileChange - Setting preview type to:", mediaType);
          setPreviewType(mediaType);
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
    console.log("handleFondoSelect called with:", fondo);
    setSelectedImage(fondo);
    setFondo(fondo);
    setFondo1(fondo);
    const mediaType = determineMediaType(fondo);
    console.log("handleFondoSelect - Setting preview type to:", mediaType);
    setPreviewType(mediaType);
  };

  const cargarComponente = async (idComponente) => {
    const componenteInfo = componentes.find((c) => c.id === idComponente);
    if (!componenteInfo) {
      return () => (
        <div className="rounded-lg p-4 shadow-lg bg-gray-500/[.06] text-red-600">
          Componente no encontrado: <strong>Desconocido</strong>
        </div>
      );
    }

    let rutaComponente = componenteInfo.attributes.ruta;

    // Normalizar la ruta para importación dinámica
    rutaComponente = rutaComponente
      .replace(/^@\//, "") // Eliminar @/ del inicio
      .replace(/^\//, "") // Eliminar / del inicio
      .replace(/\.jsx$/, ""); // Eliminar extensión .jsx si existe

    console.log(`Cargando componente: ${rutaComponente}`);
    // Construir ruta relativa desde la raíz del proyecto
    const fullPath = `@/components/screen/${rutaComponente}`;
    console.log(`Ruta completa: ${fullPath}`);

    if (componentesCache[rutaComponente]) {
      console.log(`Usando componente en caché: ${rutaComponente}`);
      return componentesCache[rutaComponente];
    }

    try {
      console.log(`Intentando cargar el módulo: ${fullPath}`);
      const Componente = dynamic(
        () =>
          import(fullPath).catch((error) => {
            console.error(`Error cargando ${rutaComponente}:`, error);
            return Promise.resolve(() => (
              <div className="rounded-lg p-4 shadow-lg bg-gray-500/[.06] text-red-600">
                Componente no encontrado:{" "}
                <strong>{componenteInfo.attributes.nombre}</strong>
              </div>
            ));
          }),
        {
          loading: () => (
            <div className="animate-pulse bg-gray-200 rounded-lg p-4">
              Cargando componente {componenteInfo.attributes.nombre}...
            </div>
          ),
        }
      );

      setComponentesCache((prev) => ({
        ...prev,
        [rutaComponente]: Componente,
      }));
      console.log(
        `Componente cargado y almacenado en caché: ${rutaComponente}`
      );
      return Componente;
    } catch (error) {
      console.error(`Error al cargar el componente ${rutaComponente}:`, error);
      return () => (
        <div className="rounded-lg p-4 shadow-lg bg-gray-500/[.06] text-red-600">
          Componente no encontrado:{" "}
          <strong>{componenteInfo.attributes.nombre}</strong>
        </div>
      );
    }
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
              <ComponenteSelector
                componentes={componentesOptions}
                categorias={componentesOptions.map(
                  (c) => c.attributes.categoria
                )}
                onValueChange={(value) =>
                  handleComponenteChange(index + 1, value)
                }
                value={espacios[index + 1] || ""}
              />
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
                {renderComponenteConfig(index + 1, espacios[index + 1])}
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

    // Buscar el nombre del componente usando el ID
    const componenteInfo = componentesOptions.find((c) => c.id === componente);
    const nombreComponente = componenteInfo?.attributes?.nombre || null;

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
        {nombreComponente ? (
          <div className="text-center">
            <div className="font-medium">{nombreComponente}</div>
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

        {selectedSpace && (
          <div className="border rounded-lg p-4 bg-gray-900/50 max-w-[40vw] mx-auto">
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
                <ComponenteSelector
                  componentes={componentesOptions}
                  categorias={["Lista de productos", "Personalizado"]}
                  onValueChange={(value) =>
                    handleComponenteChange(selectedSpace, value)
                  }
                  value={espacios[selectedSpace] || ""}
                />
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

  const renderComponenteConfig = (index, componenteId) => {
    // Buscar la información del componente
    const componenteInfo = componentes.find((c) => c.id === componenteId);
    if (!componenteInfo) return null;

    const configInicial = configComponentes[index] || {};
    const configComponente = componenteInfo.attributes.configuracion;

    return (
      <div className="space-y-4">
        {/* Campos comunes */}
        <div>
          <Label>Título</Label>
          <Input
            value={configInicial.titulo || ""}
            onChange={(e) =>
              handleConfigChange(index, "titulo", e.target.value)
            }
          />
        </div>

        {/* Configuración específica del componente */}
        {configComponente && (
          <div>
            <Label>{configComponente.titulo || "Configuración"}</Label>
            {componenteInfo.attributes.nombre === "YoutubeVideo" && (
              <Input
                type="text"
                value={configInicial.data || ""}
                onChange={(e) =>
                  handleConfigChange(index, "data", e.target.value)
                }
                placeholder="https://youtube.com/..."
              />
            )}
            {componenteInfo.attributes.nombre === "Galeria3" && (
              <Input
                type="number"
                min="1"
                max="6"
                value={configInicial.data || 4}
                onChange={(e) =>
                  handleConfigChange(
                    index,
                    "data",
                    parseInt(e.target.value) || 4
                  )
                }
              />
            )}
          </div>
        )}

        {/* Selector de productos si no es un componente personalizado */}
        {componenteInfo.attributes.categoria !== "Personalizado" && (
          <div>
            <Label>Productos</Label>
            <ProductosBuscador
              selectedProducts={configInicial.productos || []}
              onChange={(productos) =>
                handleConfigChange(index, "productos", productos)
              }
            />
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const plantillaData = {
      data: {
        nombre,
        descripcion,
        componentes: {
          header: selectedHeader?.id || null,
          footer: selectedFooter?.id || null,
          espacios,
          config_componentes: configComponentes,
          // Agregar configuración de tipografía dentro del objeto componentes
          config_global: {
            tipografia: {
              titulos: titleFont,
              textos: textFont,
            },
          },
        },
        columnas,
        filas,
        fondo1,
        overlayOpacity,
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

      // Si es una nueva plantilla, redirigir
      if (isNewPlantilla) {
        router.push("/admin/plantillas");
      } else {
        // Si estamos editando, actualizar los datos localmente
        await fetchPlantilla(); // Recargar los datos de la plantilla
        setPreviewKey((prev) => prev + 1); // Forzar actualización del preview
      }
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

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/plantillas/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la plantilla");
      }

      toast({
        title: "Éxito",
        description: "Plantilla eliminada correctamente",
      });

      router.push("/admin/plantillas");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la plantilla",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <p>Cargando...</p>;

  return (
    <>
      <div className="p-6 rounded-lg shadow-md gap-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {isNewPlantilla
              ? "Crear Nueva Plantilla"
              : `Editar Plantilla: ${nombre}`}
          </h2>
          {!isNewPlantilla && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Eliminar Plantilla</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminará
                    permanentemente la plantilla.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <Label className="block mb-2">Nombre:</Label>
              <Input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="border rounded p-2 w-full"
              />
            </div>
            <div className="w-1/2">
              <Label className="block mb-2">Descripción:</Label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="border rounded p-2 w-full"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <div className="w-4/6">
              <Label className="block mb-2">Vista previa:</Label>
              <div
                className="relative w-full overflow-hidden"
                style={{ paddingTop: "90%" }} // 16:9 aspect ratio
              >
                <div className="absolute top-0 left-0 w-full h-full transform scale-80 origin-top-left">
                  <PlantillasPreview
                    key={previewKey}
                    plantillaId={id}
                    plantillaData={
                      isNewPlantilla
                        ? {
                            id: "new",
                            attributes: {
                              nombre,
                              descripcion,
                              columnas,
                              filas,
                              componentes: {
                                header: headerComponente,
                                footer: footerComponente,
                                espacios,
                                config_componentes: configComponentes,
                                config_global: {
                                  tipografia: {
                                    titulos: titleFont,
                                    textos: textFont,
                                  },
                                },
                              },
                              fondo: selectedImage
                                ? {
                                    data: {
                                      attributes: {
                                        url: selectedImage,
                                        mime:
                                          previewType === "video"
                                            ? "video/mp4"
                                            : "image/jpeg",
                                      },
                                    },
                                  }
                                : null,
                              fondo1,
                              overlayOpacity,
                            },
                          }
                        : null
                    }
                  />
                </div>
              </div>
            </div>

            <div className="w-2/6 space-y-4">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <FontSelector
                    label="Fuente para títulos"
                    value={titleFont}
                    onValueChange={setTitleFont}
                  />
                </div>
                <div className="w-1/2">
                  <FontSelector
                    label="Fuente para textos"
                    value={textFont}
                    onValueChange={setTextFont}
                  />
                </div>
              </div>
              <div className="flex  gap-4">
                <div className="w-1/2">
                  <Label className="block mb-2">Header:</Label>
                  <ComponenteSelector
                    componentes={componentes.filter(
                      (c) => c.attributes.categoria === "Header"
                    )}
                    categorias={["Header"]}
                    allowEmpty={true}
                    value={selectedHeader?.id}
                    onValueChange={(componente) => {
                      setSelectedHeader(componente);
                      setHeaderComponente(componente?.id || null);
                    }}
                  />
                </div>

                <div className="w-1/2">
                  <Label className="block mb-2">Footer:</Label>
                  <ComponenteSelector
                    componentes={componentes.filter(
                      (c) => c.attributes.categoria === "Footer"
                    )}
                    categorias={["Footer"]}
                    allowEmpty={true}
                    value={selectedFooter?.id}
                    onValueChange={(componente) => {
                      setSelectedFooter(componente);
                      setFooterComponente(componente?.id || null);
                    }}
                  />
                </div>
              </div>
              <div className="gap-4 mt-4">
                <Label className="block mb-2">Fondo:</Label>

                <GradientPicker
                  background={fondo1}
                  setBackground={handleFondoSelect}
                  className="w-full my-2"
                />
                <Card className="mb-4">
                  <CardContent
                    className="relative w-full h-[300px] p-0 overflow-hidden rounded-lg "
                    style={{
                      background:
                        previewType === "style" ? fondo1 : "transparent",
                    }}
                  >
                    {/* Aquí se muestra la imagen o video de fondo */}
                    {previewType === "image" ? (
                      <img
                        src={fondo1.replace(/^url\((.*)\)$/, "$1")}
                        alt="Fondo de la plantilla"
                        className="w-full h-full object-cover"
                      />
                    ) : previewType === "video" ? (
                      <video
                        key={fondo1.replace(/^url\((.*)\)$/, "$1")}
                        src={fondo1.replace(/^url\((.*)\)$/, "$1")}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : null}
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
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sube una imagen o video (máx. 20MB) o selecciona uno de la
                    biblioteca
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-4"></div>
                <Label className="block mb-2">Opacidad de overlay</Label>
                <Input
                  type="range"
                  min="0"
                  max="100"
                  value={overlayOpacity}
                  onChange={(e) => setOverlayOpacity(parseInt(e.target.value))}
                  className="w-[60%] bg-gray-900/50"
                />
                <p className="text-sm text-muted-foreground">
                  {overlayOpacity}%
                </p>
              </div>
            </div>
          </div>

          <div className="pt-20"></div>

          <div className="border rounded-lg p-4 bg-gray-900/50 z-100">
            <h3 className="text-lg font-semibold "> Distribución del Grid</h3>

            <p className="text-sm">
              La plantilla se organiza en una cuadrícula (grid) que te permite
              decidir cuántas filas y columnas necesitás para mostrar el
              contenido.
              <br />
              <strong>Filas:</strong> Dividen la pantalla horizontalmente.
              <strong> Columnas:</strong> Dividen la pantalla verticalmente.{" "}
              <br />
              Por ejemplo, podés elegir un grid de 3x2 (3 filas y 2 columnas)
              para mostrar contenido de forma equilibrada.
              <br /> Y despues podés agregar componentes a cada celda de la
              cuadrícula para mostrar el contenido.
            </p>

            <div className="flex gap-4 my-4 ">
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
            </div>

            <div>{renderGridPreview()}</div>
          </div>

          <Button type="submit" variant="secondary" className="mt-6 w-full">
            {isNewPlantilla ? "Crear Plantilla" : "Guardar Cambios"}
          </Button>
        </form>
      </div>
    </>
  );
};

const ComponenteWrapper = ({ nombreComponente, cargarComponente }) => {
  const Componente = dynamic(() => cargarComponente(nombreComponente), {
    ssr: false,
  });
  return <Componente />;
};

export default PlantillasEditor;
