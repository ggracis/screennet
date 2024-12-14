import PlantillasGaleria from "@/components/admin/PlantillasGaleria";
import { Button } from "@/components/ui/button";
import { SquarePlusIcon } from "lucide-react";
import Link from "next/link";

export async function generateMetadata() {
  return {
    title: `ScreenNet - Listado de plantillas`,
  };
}
const Plantillas = async () => {
  return (
    <main>
      <div className="flex rounded-lg items-center">
        <div className="p-6">
          <p className="text-xl font-semibold my-2 underline decoration-sky-500 hover:decoration-4">
            🎨 Plantillas
          </p>
          <p className="text-lg">Diseñá a tu gusto. </p>
        </div>
        <div className="p-6">
          <p className="mt-4">
            Creá plantillas personalizadas con componentes como listas de
            productos, redes sociales, videos y más.
            <br /> Ajustá el header, footer, columnas, fondos...
            <br /> ¡Hacé que tus pantallas reflejen tu estilo!
          </p>
        </div>
      </div>

      <div className="p-6 m-4 rounded-lg border w-11/12 mx-auto">
        <div className="mb-4 flex justify-center items-center">
          <Link href="/admin/plantillas/nueva">
            <Button variant="secondary" className="w-full">
              Crear Nueva Plantilla
              <SquarePlusIcon className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        <PlantillasGaleria />
      </div>
    </main>
  );
};
export default Plantillas;
