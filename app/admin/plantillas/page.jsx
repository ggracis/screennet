import PlantillasGaleria from "@/components/admin/PlantillasGaleria";

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
      <div className="p-6 m-4 rounded-lg border w-11/12	mx-auto">
        <PlantillasGaleria />
      </div>
    </>
  );
};
export default Plantillas;
