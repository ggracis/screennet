import PantallasGaleria from "@/components/admin/PantallasGaleria";
import { Button } from "@/components/ui/button";
import { SquarePlusIcon } from "lucide-react";
import Link from "next/link";

export async function generateMetadata() {
  return {
    title: `ScreenNet - Listado de pantallas`,
  };
}

const Pantallas = async () => {
  return (
    <main>
      <div className="flex rounded-lg items-center">
        <div className="p-6">
          <p className="text-xl font-semibold my-2 underline decoration-sky-500 hover:decoration-4">
            📺 Pantallas
          </p>
          <p className="text-lg">Controlá tus teles al 100%.</p>
        </div>
        <div className="p-6">
          <p className="mt-4">
            Agregá y administrá las pantallas de cada local.
            <br /> Poneles nombre, asociálas a un local y definí plantillas
            según el horario.
            <br /> ¡Que siempre estén mostrando lo mejor de tu negocio!
          </p>
        </div>
      </div>

      <div className="p-6 m-4 rounded-lg border w-11/12 mx-auto">
        <div className="mb-4 flex justify-center items-center">
          <Link href="/admin/pantallas/nueva">
            <Button variant="secondary" className="w-full">
              Crear Nueva Pantalla
              <SquarePlusIcon className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        <PantallasGaleria />
      </div>
    </main>
  );
};

export default Pantallas;
