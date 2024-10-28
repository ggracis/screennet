import PantallasEditor from "@/components/admin/PantallasEditor";

export async function generateMetadata() {
  return {
    title: `ScreenNet - Personalizar pantalla`,
  };
}

const Pantallas = () => {
  return (
    <>
      <h2 className="mt-4 text-center text-xl font-semibold my-2 underline decoration-sky-500 hover:decoration-4">
        Personalizar pantalla
      </h2>
      <div className="p-6 m-4 rounded-lg border w-2/5 mx-auto">
        <PantallasEditor />
      </div>
    </>
  );
};

export default Pantallas;
