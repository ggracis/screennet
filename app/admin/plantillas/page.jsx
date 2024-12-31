import HeaderSection from "@/components/admin/HeaderSection";
import PlantillasGaleria from "@/components/admin/PlantillasGaleria";
import { Button } from "@/components/ui/button";
import { SquarePlusIcon } from "lucide-react";
import Link from "next/link";

const Plantillas = async () => {
  return (
    <main>
      <HeaderSection
        title="🎨 Plantillas"
        subtitle="Diseñá a tu gusto"
        description={
          <>
            Creá plantillas personalizadas con componentes como listas de
            productos, redes sociales, videos y más.
            <br /> Ajustá el header, footer, columnas, fondos...
            <br /> ¡Hacé que tus pantallas reflejen tu estilo!
          </>
        }
      />

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
