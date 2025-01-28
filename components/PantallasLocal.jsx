"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useProductStore from "@/stores/useProductStore";
import useScreenStore from "@/stores/useScreenStore";
import Image from "next/image";
import FontLoader from "@/components/ui/FontLoader";
import { ProductProvider } from "@/contexts/ProductContext";

const PantallasLocal = ({ pantallaId, plantillaPreview, preview = false }) => {
  const [localPlantilla, setLocalPlantilla] = useState(null);
  const [localPantalla, setLocalPantalla] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [componentesCache, setComponentesCache] = useState({});
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const [componentes, setComponentes] = useState([]);
  const cache = {};

  const [productsState, setProductsState] = useState({
    products: [],
    loading: true,
    error: null,
  });

  const {
    initializePolling,
    cleanup: cleanupProducts,
    fetchAllProducts,
    products,
  } = useProductStore();

  useEffect(() => {
    const fetchData = async () => {
      console.log("🎬 Iniciando carga de pantalla...");
      if (plantillaPreview) {
        console.log("👁️ Modo preview activado");
        setLocalPlantilla(plantillaPreview);
        setLoading(false);
      } else if (pantallaId) {
        try {
          console.log(`🔍 Buscando pantalla ID: ${pantallaId}`);
          const response = await fetch(`/api/pantallas/${pantallaId}`);
          const data = await response.json();

          if (data.error) {
            throw new Error(data.error);
          }

          console.log("Datos recibidos de la API:", data);

          if (!data.pantalla) {
            throw new Error("No se encontraron datos de la pantalla");
          }

          setLocalPantalla(data.pantalla);

          if (!data.pantalla.attributes?.plantilla?.data) {
            throw new Error(
              "No se encontró una plantilla activa para esta pantalla"
            );
          }

          const plantilla = data.pantalla.attributes.plantilla.data;
          if (!plantilla.attributes.componentes.config_global) {
            plantilla.attributes.componentes.config_global = {
              tipografia: { titulos: "", textos: "" },
            };
          }
          setLocalPlantilla(plantilla);

          console.log("✅ Pantalla cargada correctamente");

          if (products.length === 0) {
            console.log("📦 Solicitando carga inicial de productos");
            await fetchAllProducts();
          }

          initializePolling();
        } catch (err) {
          console.error("❌ Error cargando pantalla:", err.message);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      console.log("🧹 Limpiando recursos de pantalla");
      cleanupProducts();
    };
  }, [
    pantallaId,
    plantillaPreview,
    fetchAllProducts,
    initializePolling,
    cleanupProducts,
    products.length,
  ]);

  useEffect(() => {
    const fetchComponentes = async () => {
      try {
        const response = await fetch(`/api/componentes`);
        const data = await response.json();
        setComponentes(data.data || []);
      } catch (error) {
        console.error("Error fetching componentes:", error);
      }
    };

    fetchComponentes();
  }, []);

  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        setProductsState((prev) => ({ ...prev, loading: true }));
        const products = await fetchAllProducts();
        setProductsState({
          products,
          loading: false,
          error: null,
        });
        initializePolling();
      } catch (error) {
        setProductsState({
          products: [],
          loading: false,
          error: error.message,
        });
      }
    };

    loadAllProducts();

    return () => {
      cleanupProducts();
    };
  }, [fetchAllProducts, initializePolling, cleanupProducts]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!localPlantilla) {
    return <div>No se encontraron datos de la plantilla</div>;
  }

  const ComponenteNoEncontrado = ({ nombreComponente }) => (
    <div className="rounded-lg p-4 shadow-lg bg-gray-500/[.06] text-red-600">
      Componente no encontrado: <strong>{nombreComponente}</strong>
    </div>
  );

  const cargarComponente = async (idComponente) => {
    if (cache[idComponente]) {
      return cache[idComponente];
    }

    if (componentesCache[idComponente]) {
      return componentesCache[idComponente];
    }

    try {
      const response = await fetch(`/api/componentes/${idComponente}`);
      const { ruta } = await response.json();

      const Componente = dynamic(
        () =>
          import(`@/components/screen/${ruta}`).catch(() => {
            console.error(`Componente ${ruta} no encontrado`);
            return Promise.resolve(() => (
              <ComponenteNoEncontrado nombreComponente={ruta} />
            ));
          }),
        {
          loading: () => (
            <div className="animate-pulse bg-gray-200 rounded-lg p-4">
              Cargando componente {ruta}...
            </div>
          ),
        }
      );

      setComponentesCache((prev) => ({
        ...prev,
        [idComponente]: Componente,
      }));
      cache[idComponente] = Componente;
      return Componente;
    } catch (error) {
      console.error(`Error al cargar el componente ${idComponente}:`, error);
      return () => <ComponenteNoEncontrado nombreComponente={idComponente} />;
    }
  };

  const { componentes: plantillaComponentes, overlayOpacity = 50 } =
    localPlantilla.attributes;
  const fondo1 = localPlantilla.attributes.fondo1;
  const fondoUrl = fondo1?.startsWith("url(")
    ? fondo1.replace(/^url\((.*)\)$/, "$1")
    : null;
  const isFondoVideo =
    fondoUrl && /(\.mp4|\.mov|\.avi|\.webm)$/i.test(fondoUrl);
  const isFondoImage =
    fondoUrl && /(\.jpg|\.jpeg|\.png|\.gif|\.webp)$/i.test(fondoUrl);
  const isFondoStyle =
    fondo1 && (fondo1.startsWith("linear-gradient") || fondo1.startsWith("#"));

  const calcularAlturaGrid = () => {
    const alturaTotal = `calc(100vh - ${headerHeight}px - ${footerHeight}px)`;
    return localPlantilla.attributes.filas === 1 ? alturaTotal : alturaTotal;
  };

  const containerClasses = preview
    ? "w-full h-full"
    : "min-h-screen relative overflow-hidden";

  const gridClasses = preview ? "h-full" : "min-h-[50vh]";

  // Extraer las fuentes configuradas
  const configuredFonts = [
    localPlantilla.attributes.componentes?.config_global?.tipografia?.titulos,
    localPlantilla.attributes.componentes?.config_global?.tipografia?.textos,
  ].filter(Boolean); // Solo fuentes que existan

  return (
    <ProductProvider>
      <FontLoader fonts={configuredFonts} />
      <div
        className={containerClasses}
        style={{
          "--font-titulos": `'${
            localPlantilla.attributes.componentes?.config_global?.tipografia
              ?.titulos || "inherit"
          }', sans-serif`,
          "--font-textos": `'${
            localPlantilla.attributes.componentes?.config_global?.tipografia
              ?.textos || "inherit"
          }', sans-serif`,
        }}
      >
        {/* Fondo */}
        {fondo1 && (
          <div className="fixed inset-0 -z-10">
            {isFondoVideo ? (
              <video
                key={fondoUrl}
                src={fondoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : isFondoImage ? (
              <Image
                src={fondoUrl}
                alt="Fondo"
                fill={true}
                className="absolute inset-0 w-full h-full object-cover"
                priority={true}
                sizes="100vw"
                quality={75}
              />
            ) : isFondoStyle ? (
              <div
                className="absolute inset-0 w-full h-full"
                style={{ background: fondo1 }}
              />
            ) : null}
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity / 100 }}
            />
            {/* Overlay opcional */}
          </div>
        )}

        {/* Contenido */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header con ref para medir */}
          {plantillaComponentes.header && (
            <div ref={(el) => el && setHeaderHeight(el.offsetHeight)}>
              <Suspense
                fallback={
                  <div className="animate-pulse bg-gray-200 h-16">
                    Cargando header...
                  </div>
                }
              >
                <DynamicComponent
                  idComponente={plantillaComponentes.header}
                  cargarComponente={cargarComponente}
                />
              </Suspense>
            </div>
          )}

          {/* Grid con altura dinámica */}
          <div
            className={`mx-auto p-4 md:grid gap-4 justify-center w-[95vw] md:container ${gridClasses}`}
            style={{
              gridTemplateColumns: `repeat(${localPlantilla.attributes.columnas}, 1fr)`,
              gridTemplateRows: `repeat(${localPlantilla.attributes.filas}, 1fr)`,
            }}
          >
            {Object.entries(plantillaComponentes.espacios).map(
              ([espacio, idComponente]) => {
                const config = plantillaComponentes.config_componentes[espacio];
                return (
                  <Suspense
                    key={espacio}
                    fallback={
                      <div className="animate-pulse bg-gray-200 rounded-lg p-4">
                        Cargando...
                      </div>
                    }
                  >
                    <div
                      style={{
                        gridRow: `span ${config?.rowSpan || 1}`,
                        gridColumn: `span ${config?.colSpan || 1}`,
                      }}
                    >
                      <DynamicComponent
                        idComponente={idComponente}
                        cargarComponente={cargarComponente}
                        config={{
                          ...config,
                          data: config?.data || config?.titulo,
                        }}
                      />
                    </div>
                  </Suspense>
                );
              }
            )}
          </div>

          {/* Footer con ref para medir */}
          <div
            className="fixed bottom-0 w-full z-10"
            ref={(el) => el && setFooterHeight(el?.offsetHeight || 0)}
          >
            {plantillaComponentes.footer && (
              <Suspense
                fallback={
                  <div className="animate-pulse bg-gray-200 h-16">
                    Cargando footer...
                  </div>
                }
              >
                <DynamicComponent
                  idComponente={plantillaComponentes.footer}
                  cargarComponente={cargarComponente}
                  config={{
                    localId: localPantalla?.attributes?.local?.data?.id,
                  }}
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </ProductProvider>
  );
};

const DynamicComponent = ({ idComponente, cargarComponente, config = {} }) => {
  const [Componente, setComponente] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        console.log(`🧩 Cargando componente: ${idComponente}`);
        const ComponenteCargado = await cargarComponente(idComponente);
        setComponente(() => ComponenteCargado);
        console.log(`✅ Componente ${idComponente} cargado`);
      } catch (err) {
        console.error(
          `❌ Error cargando componente ${idComponente}:`,
          err.message
        );
        setError(err);
      }
    };
    cargar();
  }, [idComponente, cargarComponente]);

  if (error) return <ComponenteNoEncontrado nombreComponente={idComponente} />;
  if (!Componente) return null;

  return <Componente {...config} />;
};

export default PantallasLocal;
