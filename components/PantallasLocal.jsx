"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";

const PantallasLocal = ({ params }) => {
  const [pantalla, setPantalla] = useState(null);
  const [plantilla, setPlantilla] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [componentesCache, setComponentesCache] = useState({});

  const ComponenteNoEncontrado = ({ nombreComponente }) => {
    ComponenteNoEncontrado.displayName = "ComponenteNoEncontrado";
    return (
      <div className="rounded-lg p-4 shadow-lg bg-gray-500/[.06] text-red-600">
        Componente no encontrado: <strong>{nombreComponente}</strong>
      </div>
    );
  };

  const cargarComponente = async (nombreComponente) => {
    if (componentesCache[nombreComponente]) {
      return componentesCache[nombreComponente];
    }

    /* console.log(`Intentando cargar componente: ${nombreComponente}`, {
      tipo: "screen",
      ruta: `@/components/screen/${nombreComponente}`,
      timestamp: new Date().toISOString(),
    }); */

    try {
      const Componente = dynamic(
        () =>
          import(`@/components/screen/${nombreComponente}`).catch(() => {
            console.error(`Componente ${nombreComponente} no encontrado`, {
              error: "COMPONENTE_NO_ENCONTRADO",
              componente: nombreComponente,
              rutaBuscada: `@/components/screen/${nombreComponente}`,
              timestamp: new Date().toISOString(),
            });
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

      /*  console.log(`Componente cargado exitosamente: ${nombreComponente}`, {
        status: "SUCCESS",
        timestamp: new Date().toISOString(),
      }); */

      setComponentesCache((prev) => ({
        ...prev,
        [nombreComponente]: Componente,
      }));
      return Componente;
    } catch (error) {
      console.error(`Error al cargar el componente ${nombreComponente}:`, {
        error: error.message,
        stack: error.stack,
        componente: nombreComponente,
        timestamp: new Date().toISOString(),
      });
      return () => (
        <ComponenteNoEncontrado nombreComponente={nombreComponente} />
      );
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      setError(null);
      try {
        // Obtener datos de la pantalla
        const resPantalla = await fetch(`/api/pantallas/${params.id}`);
        if (!resPantalla.ok)
          throw new Error("Error al cargar datos de la pantalla");
        const { pantalla: dataPantalla } = await resPantalla.json();

        console.log("Datos de pantalla cargados:", {
          id: dataPantalla.id,
          nombre: dataPantalla.attributes.nombre,
          localId: dataPantalla.attributes.local.data.id,
          timestamp: new Date().toISOString(),
        });

        setPantalla(dataPantalla);

        // Obtener plantilla según horario
        const plantillaId = obtenerPlantillaSegunHorario(
          dataPantalla.attributes.plantilla_horario
        );

        // Obtener datos de la plantilla
        const resPlantilla = await fetch(`/api/plantillas/${plantillaId}`);
        if (!resPlantilla.ok)
          throw new Error("Error al cargar datos de la plantilla");
        const { plantilla: dataPlantilla } = await resPlantilla.json();

        console.log("Datos de plantilla cargados:", {
          id: dataPlantilla.id,
          nombre: dataPlantilla.attributes.nombre,
          componentes: dataPlantilla.attributes.componentes,
          timestamp: new Date().toISOString(),
        });

        setPlantilla(dataPlantilla);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-600">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!plantilla) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg text-yellow-600">
          No se encontró la plantilla
        </div>
      </div>
    );
  }

  const { componentes, columnas, filas, fondo } = plantilla.attributes;

  return (
    <div
      style={{
        backgroundImage: `url(${process.env.NEXT_PUBLIC_STRAPI_URL}${fondo.data.attributes.url})`,
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
      className="relative"
    >
      {/* Header */}
      <div className="fixed top-0 w-full z-10">
        {componentes.header && (
          <Suspense
            fallback={
              <div className="bg-gray-200 h-16">Cargando header...</div>
            }
          >
            <ComponenteWrapper
              nombreComponente={componentes.header}
              cargarComponente={cargarComponente}
              props={{
                localId: pantalla?.attributes?.local?.data?.id,
              }}
            />
          </Suspense>
        )}
      </div>

      {/* Grid de componentes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columnas}, 1fr)`,
          gridTemplateRows: `repeat(${filas}, 1fr)`,
        }}
        className="gap-4 p-4 mt-20 mb-20"
      >
        {Object.entries(componentes.espacios).map(([espacio, componente]) => {
          const config = componentes.config_componentes[espacio];

          return (
            <Suspense
              key={espacio}
              fallback={
                <div className="animate-pulse bg-gray-200 rounded-lg p-4">
                  Cargando espacio {espacio}...
                </div>
              }
            >
              <ComponenteWrapper
                nombreComponente={componente}
                cargarComponente={cargarComponente}
                props={{
                  productos: config.productos,
                  titulo: config.titulo,
                }}
              />
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
  );
};

// Componente auxiliar para manejar la carga asíncrona
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
        console.error(`Error en ComponenteWrapper: ${nombreComponente}`, {
          error: err.message,
          componente: nombreComponente,
          props,
          timestamp: new Date().toISOString(),
        });
      }
    };
    cargar();
  }, [nombreComponente, cargarComponente]);

  if (error)
    return <ComponenteNoEncontrado nombreComponente={nombreComponente} />;
  if (!Componente) return null;

  return <Componente {...props} />;
};

// Función auxiliar para determinar la plantilla según horario
const obtenerPlantillaSegunHorario = (horarios) => {
  const ahora = new Date();
  const dia = ["0", "1", "l", "m", "x", "j", "v"][ahora.getDay()];
  const hora = `${ahora.getHours().toString().padStart(2, "0")}:${ahora
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  for (const config of Object.values(horarios)) {
    if (config.dias?.includes(dia)) {
      const [inicio, fin] = config.horas || [];
      if (!inicio || !fin || (hora >= inicio && hora <= fin)) {
        return config.plantilla;
      }
    }
  }

  return horarios.default.plantilla;
};

PantallasLocal.displayName = "PantallasLocal";

export default PantallasLocal;
