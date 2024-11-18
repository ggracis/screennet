import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const Footer1 = () => {
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
    <footer className="h-7 p-2 bg-gray-800/80 flex items-center justify-center">
      <p className="text-sm text-center text-white">
        {local?.attributes?.opciones?.direccion}
      </p>
    </footer>
  );
};

export default Footer1;
