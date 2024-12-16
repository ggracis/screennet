"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useProductStore from "@/stores/useProductStore";
import useScreenStore from "@/stores/useScreenStore";
import Image from "next/image";

const PantallasLocal = ({ pantallaId, plantillaPreview, preview = false }) => {
  const [localPlantilla, setLocalPlantilla] = useState(null);
  const [localPantalla, setLocalPantalla] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [componentesCache, setComponentesCache] = useState({});
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);

  const {
    initializePolling: initProductPolling,
    cleanup: cleanupProducts,
    fetchAllProducts,
  } = useProductStore();

  useEffect(() => {
    const fetchData = async () => {
      if (plantillaPreview) {
        setLocalPlantilla(plantillaPreview);
        setLoading(false);
      } else if (pantallaId) {
        try {
          const response = await fetch(`/api/plantillas/${pantallaId}`);
          const data = await response.json();
          if (data.plantilla) {
            setLocalPlantilla(data.plantilla);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [pantallaId, plantillaPreview]);

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

  const cargarComponente = async (nombreComponente) => {
    if (componentesCache[nombreComponente]) {
      return componentesCache[nombreComponente];
    }

    try {
      const Componente = dynamic(
        () =>
          import(`@/components/screen/${nombreComponente}`).catch(() => {
            console.error(`Componente ${nombreComponente} no encontrado`);
            return Promise.resolve(() => (
              <ComponenteNoEncontrado nombreComponente={nombreComponente} />
            ));
          }),
        {
          loading: () => (
            <div className="animate-pulse bg-gray-200 rounded-lg p-4">
              Cargando componente {nombreComponente}...
            </div>
          ),
        }
      );

      setComponentesCache((prev) => ({
        ...prev,
        [nombreComponente]: Componente,
      }));
      return Componente;
    } catch (error) {
      console.error(
        `Error al cargar el componente ${nombreComponente}:`,
        error
      );
      return () => (
        <ComponenteNoEncontrado nombreComponente={nombreComponente} />
      );
    }
  };

  const { componentes } = localPlantilla.attributes;
  const fondoData = localPlantilla.attributes.fondo?.data?.attributes;
  const fondoUrl = fondoData
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${fondoData.url}`
    : null;
  const isFondoVideo = fondoData?.mime?.startsWith("video/");

  const calcularAlturaGrid = () => {
    const alturaTotal = `calc(100vh - ${headerHeight}px - ${footerHeight}px)`;
    return localPlantilla.attributes.filas === 1 ? alturaTotal : alturaTotal;
  };

  const containerClasses = preview
    ? "w-full h-full"
    : "min-h-screen relative overflow-hidden";

  const gridClasses = preview ? "h-full" : "min-h-[50vh]";

  return (
    <div className={containerClasses}>
      {/* Fondo */}
      {fondoUrl && (
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
          ) : (
            <Image
              src={fondoUrl}
              alt="Fondo"
              fill={true}
              className="absolute inset-0 w-full h-full object-cover"
              priority={true}
              sizes="100vw"
              quality={75}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />{" "}
          {/* Overlay opcional */}
        </div>
      )}

      {/* Contenido */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header con ref para medir */}
        {componentes.header && (
          <div ref={(el) => el && setHeaderHeight(el.offsetHeight)}>
            <Suspense
              fallback={
                <div className="animate-pulse bg-gray-200 h-16">
                  Cargando header...
                </div>
              }
            >
              <ComponenteWrapper
                nombreComponente={componentes.header}
                cargarComponente={cargarComponente}
              />
            </Suspense>
          </div>
        )}

        {/* Grid con altura dinámica */}
        <div
          className={`container mx-auto p-4 grid gap-4 justify-center ${gridClasses}`}
          style={{
            gridTemplateColumns: `repeat(${localPlantilla.attributes.columnas}, 1fr)`,
            gridTemplateRows: `repeat(${localPlantilla.attributes.filas}, 1fr)`,
          }}
        >
          {Object.entries(componentes.espacios).map(([espacio, componente]) => {
            const config = componentes.config_componentes[espacio];
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
                    gridRow: `span ${config.rowSpan || 1}`,
                    gridColumn: `span ${config.colSpan || 1}`,
                  }}
                >
                  <ComponenteWrapper
                    nombreComponente={componente}
                    cargarComponente={cargarComponente}
                    props={{
                      ...config,
                      data: config.data || config.titulo,
                    }}
                  />
                </div>
              </Suspense>
            );
          })}
        </div>

        {/* Footer con ref para medir */}
        <div
          className="fixed bottom-0 w-full z-10"
          ref={(el) => el && setFooterHeight(el?.offsetHeight || 0)}
        >
          {componentes.footer && (
            <Suspense
              fallback={
                <div className="animate-pulse bg-gray-200 h-16">
                  Cargando footer...
                </div>
              }
            >
              <ComponenteWrapper
                nombreComponente={componentes.footer}
                cargarComponente={cargarComponente}
                props={{
                  localId: localPantalla?.attributes?.local?.data?.id,
                }}
              />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
};

const ComponenteWrapper = ({
  nombreComponente,
  cargarComponente,
  props = {},
}) => {
  const [Componente, setComponente] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const ComponenteCargado = await cargarComponente(nombreComponente);
        setComponente(() => ComponenteCargado);
      } catch (err) {
        setError(err);
      }
    };
    cargar();
  }, [nombreComponente, cargarComponente]);

  if (error)
    return <ComponenteNoEncontrado nombreComponente={nombreComponente} />;
  if (!Componente) return null;

  return <Componente {...props} />;
};

export default PantallasLocal;
