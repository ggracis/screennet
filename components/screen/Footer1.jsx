import { useEffect, useState } from "react";
import { Carousel } from "@/components/ui/carousel";

const Footer1 = ({ localId }) => {
  const [local, setLocal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocalData = async () => {
      console.log("Iniciando fetch de local con ID:", localId);

      if (!localId) {
        console.warn("No se recibió localId");
        setError("ID de local no proporcionado");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/locals/${localId}`);
        console.log("Respuesta de la API:", {
          status: response.status,
          ok: response.ok,
          url: response.url,
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Datos del local recibidos:", {
          data,
          timestamp: new Date().toISOString(),
        });

        if (!data.local) {
          throw new Error("Datos del local no encontrados en la respuesta");
        }

        setLocal(data.local);
        setError(null);
      } catch (error) {
        console.error("Error cargando datos del local:", {
          error: error.message,
          localId,
          timestamp: new Date().toISOString(),
        });
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocalData();
  }, [localId]);

  if (loading) {
    return (
      <footer className="bg-gray-200 p-4">
        <div className="animate-pulse h-8 bg-gray-300 rounded w-1/4 mb-2"></div>
        <div className="animate-pulse h-4 bg-gray-300 rounded w-1/2"></div>
      </footer>
    );
  }

  if (error) {
    return (
      <footer className="bg-red-50 p-4">
        <div className="text-red-600">
          Error al cargar datos del local: {error}
        </div>
      </footer>
    );
  }

  if (!local) {
    return (
      <footer className="bg-yellow-50 p-4">
        <div className="text-yellow-600">No se encontraron datos del local</div>
      </footer>
    );
  }

  return (
    <footer className="h-10 p-2 bg-gray-800 flex items-center justify-center">
      <p className="text-sm text-center text-white">
        {local?.attributes?.opciones?.direccion}
      </p>
    </footer>
  );
};

export default Footer1;
