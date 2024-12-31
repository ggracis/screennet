"use client";

import { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import useProductStore from "@/stores/useProductStore";

const PlantillasPreview = ({ plantillaId, plantillaData = null }) => {
  const [plantilla, setPlantilla] = useState(plantillaData);
  const [componentesCache, setComponentesCache] = useState({});
  const [loading, setLoading] = useState(!plantillaData);
  const [error, setError] = useState(null);
  const {
    initializePolling,
    cleanup: cleanupProducts,
    fetchAllProducts,
  } = useProductStore();
  const cache = {};

  useEffect(() => {
    const fetchPlantilla = async () => {
      if (plantillaData) {
        setPlantilla(plantillaData);
        return;
      }

      try {
        const response = await fetch(`/api/plantillas/${plantillaId}`);
        const data = await response.json();

        if (!data || !data.id) {
          throw new Error("Datos de plantilla no encontrados");
        }

        const plantillaFormateada = {
          id: data.id,
          attributes: {
            ...data.attributes,
            fondo: data.attributes.fondo || null,
            fondo1: data.attributes.fondo1 || null,
            componentes: data.attributes.componentes || {
              espacios: {},
              config_componentes: {},
              header: null,
              footer: null,
            },
          },
        };

        setPlantilla(plantillaFormateada);
      } catch (err) {
        console.error("Error fetching plantilla:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    const initializeData = async () => {
      await fetchAllProducts();
      initializePolling();
      if (plantillaId) {
        await fetchPlantilla();
      }
    };

    initializeData();

    return () => {
      cleanupProducts();
    };
  }, [
    plantillaId,
    plantillaData,
    fetchAllProducts,
    initializePolling,
    cleanupProducts,
  ]);

  if (loading) return <div>Cargando plantilla...</div>;
  if (error) return <div>Error al cargar la plantilla: {error.message}</div>;
  if (!plantilla)
    return <div>No hay datos de plantilla para previsualizar</div>;

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

  const {
    componentes,
    filas = 1,
    columnas = 1,
    overlayOpacity = 50,
  } = plantilla.attributes;
  const fondo1 = plantilla.attributes.fondo1;
  const fondoUrl = fondo1?.startsWith("url(")
    ? fondo1.replace(/^url\((.*)\)$/, "$1")
    : null;
  const isFondoVideo =
    fondoUrl && /(\.mp4|\.mov|\.avi|\.webm)$/i.test(fondoUrl);
  const isFondoImage =
    fondoUrl && /(\.jpg|\.jpeg|\.png|\.gif|\.webp)$/i.test(fondoUrl);
  const isFondoStyle =
    fondo1 && (fondo1.startsWith("linear-gradient") || fondo1.startsWith("#"));

  const gridStyle = {
    display: "grid",
    gridTemplateRows: `repeat(${filas}, minmax(0, 1fr))`,
    gridTemplateColumns: `repeat(${columnas}, minmax(0, 1fr))`,
    gap: "1rem",
    height: "100%",
    position: "relative",
    zIndex: 1,
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">
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

      {/* Header */}
      {componentes.header && (
        <Suspense fallback={<div>Cargando header...</div>}>
          <DynamicComponent
            idComponente={componentes.header}
            cargarComponente={cargarComponente}
            config={componentes.config_componentes?.header}
          />
        </Suspense>
      )}

      {/* Grid de componentes */}
      <div style={gridStyle}>
        {Object.entries(componentes.espacios || {}).map(
          ([espacio, idComponente]) => (
            <Suspense key={espacio} fallback={<div>Cargando...</div>}>
              <DynamicComponent
                idComponente={idComponente}
                cargarComponente={cargarComponente}
                config={componentes.config_componentes?.[espacio]}
              />
            </Suspense>
          )
        )}
      </div>

      {/* Footer */}
      {componentes.footer && (
        <Suspense fallback={<div>Cargando footer...</div>}>
          <DynamicComponent
            idComponente={componentes.footer}
            cargarComponente={cargarComponente}
            config={componentes.config_componentes?.footer}
          />
        </Suspense>
      )}
    </div>
  );
};

const DynamicComponent = ({ idComponente, cargarComponente, config = {} }) => {
  const [Componente, setComponente] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const ComponenteCargado = await cargarComponente(idComponente);
        setComponente(() => ComponenteCargado);
      } catch (err) {
        setError(err);
      }
    };
    cargar();
  }, [idComponente, cargarComponente]);

  if (error) return <ComponenteNoEncontrado nombreComponente={idComponente} />;
  if (!Componente) return null;

  return <Componente {...config} />;
};

export default PlantillasPreview;
