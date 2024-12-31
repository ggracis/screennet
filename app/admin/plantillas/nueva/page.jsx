import PlantillasEditor from "@/components/admin/PlantillasEditor";

const NuevaPlantilla = () => {
  return (
    <>
      <h2 className="mt-4 text-center text-xl font-semibold my-2 underline decoration-sky-500 hover:decoration-4">
        Crear nueva plantilla
      </h2>
      <div className="p-6 m-4 rounded-lg border w-11/12 mx-auto">
        <PlantillasEditor isNewPlantilla={true} />
      </div>
    </>
  );
};

export default NuevaPlantilla;
