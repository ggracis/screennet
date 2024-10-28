import PantallasGaleria from "@/components/admin/PantallasGaleria";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function generateMetadata() {
  return {
    title: `ScreenNet - Listado de pantallas`,
  };
}

const Pantallas = async () => {
  return (
    <>
      <h2 className="mt-4 text-center text-xl font-semibold my-2 underline decoration-sky-500 hover:decoration-4">
        Pantallas
      </h2>
      <div className="p-6 m-4 rounded-lg border w-11/12 mx-auto">
        <div className="mb-4">
          <Link href="/admin/pantallas/nueva">
            <Button variant="outline">Crear Nueva Pantalla</Button>
          </Link>
        </div>
        <PantallasGaleria />
      </div>
    </>
  );
};

export default Pantallas;
