"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useProductStore from "@/stores/useProductStore";
import useScreenStore from "@/stores/useScreenStore";

const PantallasLocal = ({ params }) => {
  const {
    initializePolling: initProductPolling,
    cleanup: cleanupProducts,
    fetchAllProducts,
  } = useProductStore();

  const {
    pantalla,
    plantilla,
    loading: screenLoading,
    error: screenError,
    initializePolling: initScreenPolling,
    cleanup: cleanupScreen,
    fetchScreenData,
  } = useScreenStore();

  const [componentesCache, setComponentesCache] = useState({});

  useEffect(() => {
    fetchAllProducts();
    initProductPolling();
    fetchScreenData(params.id);
    initScreenPolling(params.id);

    return () => {
      cleanupProducts();
      cleanupScreen();
    };
  }, [
    params.id,
    initProductPolling,
    fetchScreenData,
    initScreenPolling,
    cleanupProducts,
    cleanupScreen,
    fetchAllProducts,
  ]);

  if (screenLoading) {
    return <div>Cargando...</div>;
  }

  if (screenError) {
    return <div>Error: {screenError}</div>;
  }

  if (!pantalla || !plantilla) {
    return <div>No se encontraron datos de la pantalla o plantilla</div>;
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

  const { componentes } = plantilla.attributes;
  const fondoData = plantilla.attributes.fondo?.data?.attributes;
  const fondoUrl = fondoData
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${fondoData.url}`
    : null;
  const isFondoVideo = fondoData?.mime?.startsWith("video/");

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo */}
      <div className="fixed inset-0 -z-10">
        {fondoUrl &&
          (isFondoVideo ? (
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
            <img
              src={fondoUrl}
              alt="Fondo"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ))}
        <div className="absolute inset-0 bg-black/50" />{" "}
        {/* Overlay opcional */}
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen">
        {/* Header */}
        {componentes.header && (
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
        )}

        {/* Grid de componentes */}
        <div
          className="container mx-auto p-4 grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${plantilla.attributes.columnas}, 1fr)`,
            gridTemplateRows: `repeat(${plantilla.attributes.filas}, 1fr)`,
            height:
              plantilla.attributes.filas === 1
                ? "calc(100vh - 12rem)"
                : "calc(100vh - 40em)",
            minHeight: "50vh",
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

        {/* Footer */}
        <div className="fixed bottom-0 w-full z-10">
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
                  localId: pantalla?.attributes?.local?.data?.id,
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
