import PantallasEditor from "@/components/admin/PantallasEditor";

const NuevaPantalla = () => {
  return (
    <>
      <h2 className="mt-4 text-center text-xl font-semibold my-2 underline decoration-sky-500 hover:decoration-4">
        Crear nueva pantalla
      </h2>
      <div className="p-6 m-4 rounded-lg border w-11/12 mx-auto">
        <PantallasEditor isNewPantalla={true} />
      </div>
    </>
  );
};

export default NuevaPantalla;
