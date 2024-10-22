import PlantillasEditor from "@/components/admin/PlantillasEditor";

export async function generateMetadata() {
  return {
    title: `ScreenNet - Personalizar plantilla`,
  };
}

const Plantillas = () => {
  return (
    <>
      <h2 className="mt-4 text-center text-xl font-semibold my-2 underline decoration-sky-500 hover:decoration-4">
        Personalizar plantilla
      </h2>
      <div className="p-6 m-4 rounded-lg border w-11/12 mx-auto">
        <PlantillasEditor />
      </div>
    </>
  );
};

export default Plantillas;
