import { useEffect, useState } from "react";
import MarqueeSocial from "../MarqueeSocial";

const Header = ({ localId }) => {
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
      <header className="bg-gray-200 p-4">
        <div className="animate-pulse h-8 bg-gray-300 rounded w-1/4 mb-2"></div>
        <div className="animate-pulse h-4 bg-gray-300 rounded w-1/2"></div>
      </header>
    );
  }

  if (error) {
    return (
      <header className="bg-red-50 p-4">
        <div className="text-red-600">
          Error al cargar datos del local: {error}
        </div>
      </header>
    );
  }

  if (!local) {
    return (
      <header className="bg-yellow-50 p-4">
        <div className="text-yellow-600">No se encontraron datos del local</div>
      </header>
    );
  }

  return (
    <header
      style={{ background: local?.attributes?.opciones?.Encabezado }}
      className="h-20 p-4 grid grid-cols-[200px_1fr_200px] items-center"
    >
      {/* Logo - ancho fijo izquierda */}
      <div className="w-[200px]">
        {local?.attributes?.logoURL?.data?.attributes?.url && (
          <img
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${local.attributes.logoURL.data.attributes.url}`}
            alt={`Logo ${local.attributes.nombre}`}
            className="h-16 w-auto"
          />
        )}
      </div>

      {/* Nombre y dirección - centrados */}
      <div className="flex flex-col items-center justify-center px-4">
        <h1
          className="text-xl font-bold text-center"
          style={{ fontFamily: local?.attributes?.opciones?.fontFamily }}
        >
          {local.attributes.nombre}
        </h1>
        <p className="text-sm text-center">
          {local?.attributes?.opciones?.direccion}
        </p>
      </div>

      {/* Redes sociales - ancho fijo derecha */}
      {local?.attributes?.opciones?.redes &&
      Object.keys(local.attributes.opciones.redes).length > 0 ? (
        <div className="w-[350px] mr-6">
          <div className="social-marquee ">
            <MarqueeSocial redes={local.attributes.opciones.redes} />
          </div>
        </div>
      ) : (
        <div className="w-[350px]" /> // Placeholder para mantener el grid
      )}
    </header>
  );
};

export default Header;
