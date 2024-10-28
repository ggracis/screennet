import PlantillasGaleria from "@/components/admin/PlantillasGaleria";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function generateMetadata() {
  return {
    title: `ScreenNet - Listado de plantillas`,
  };
}
const Plantillas = async () => {
  return (
    <>
      <h2 className="mt-4 text-center text-xl font-semibold my-2 underline decoration-sky-500 hover:decoration-4">
        Plantillas
      </h2>
      <div className="p-6 m-4 rounded-lg border w-11/12 mx-auto">
        <div className="mb-4">
          <Link href="/admin/plantillas/nueva">
            <Button variant="outline">Crear Nueva Plantilla</Button>
          </Link>
        </div>
        <PlantillasGaleria />
      </div>
    </>
  );
};
export default Plantillas;
