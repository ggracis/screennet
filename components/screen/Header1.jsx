import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MarqueeSocial from "../MarqueeSocial";
import Image from "next/image";

const Header = () => {
  const params = useParams();
  const [local, setLocal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocalData = async () => {
      try {
        // Obtenemos los datos de la pantalla usando el ID de los params
        const pantallaRes = await fetch(`/api/pantallas/${params.id}`);
        const { pantalla } = await pantallaRes.json();

        const localId = pantalla.attributes.local.data.id;

        if (!localId) {
          throw new Error("ID de local no encontrado en la pantalla");
        }

        const localRes = await fetch(`/api/locals/${localId}`);
        if (!localRes.ok) {
          throw new Error(`Error HTTP: ${localRes.status}`);
        }

        const { local: localData } = await localRes.json();
        setLocal(localData);
        setError(null);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchLocalData();
    }
  }, [params.id]);

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
      className="h-18 px-10 py-2 grid grid-cols-[200px_1fr_200px] items-center"
    >
      {/* Logo - ancho fijo izquierda */}
      <div className="w-[200px]">
        {local?.attributes?.logoURL?.data?.attributes?.url && (
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${local.attributes.logoURL.data.attributes.url}`}
            alt={`Logo ${local.attributes.nombre}`}
            width={64}
            height={64}
            className="h-16 w-auto"
            priority={true}
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
