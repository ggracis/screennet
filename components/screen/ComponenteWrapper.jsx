import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const ComponenteWrapper = ({ nombreComponente, props = {} }) => {
  const [Componente, setComponente] = useState(null);

  useEffect(() => {
    const cargarComponente = async () => {
      try {
        const ComponenteCargado = dynamic(
          () => import(`@/components/screen/${nombreComponente}`),
          {
            loading: () => (
              <div className="animate-pulse bg-gray-500/[.06] rounded-lg p-4">
                Cargando {nombreComponente}...
              </div>
            ),
          }
        );
        setComponente(() => ComponenteCargado);
      } catch (error) {
        console.error(
          `Error al cargar el componente ${nombreComponente}:`,
          error
        );
      }
    };
    cargarComponente();
  }, [nombreComponente]);

  if (!Componente) return null;

  return <Componente {...props} />;
};

export default ComponenteWrapper;