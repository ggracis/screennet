import HeaderSection from "@/components/admin/HeaderSection";
import PantallasGaleria from "@/components/admin/PantallasGaleria";
import { Button } from "@/components/ui/button";
import { SquarePlusIcon } from "lucide-react";
import Link from "next/link";

const Pantallas = async () => {
  return (
    <main>
      <HeaderSection
        title="📺 Pantallas"
        subtitle="Controlá tus teles al 100%"
        description={
          <>
            Agregá y administrá las pantallas de cada local.
            <br /> Poneles nombre, asociálas a un local y definí plantillas
            según el horario.
            <br /> ¡Que siempre estén mostrando lo mejor de tu negocio!
          </>
        }
      />

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
