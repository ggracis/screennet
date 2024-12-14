import PlantillasEditor from "@/components/admin/PlantillasEditor";

export async function generateMetadata() {
  return {
    title: `ScreenNet - Personalizar plantilla`,
  };
}

const Plantillas = () => {
  return (
    <main>
      <div className="flex rounded-lg items-center">
        <div className="p-6">
          <p className="text-xl font-semibold my-2 underline decoration-sky-500 hover:decoration-4">
            🎨 Plantillas
          </p>
        </div>
      </div>

      <div className="p-6 m-4 rounded-lg border w-11/12 mx-auto">
        <PlantillasEditor />
      </div>
    </main>
  );
};

export default Plantillas;
