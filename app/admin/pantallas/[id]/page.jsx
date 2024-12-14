import PantallasEditor from "@/components/admin/PantallasEditor";

export async function generateMetadata() {
  return {
    title: `ScreenNet - Personalizar pantalla`,
  };
}

const Pantallas = () => {
  return (
    <main>
      <div className="flex rounded-lg items-center">
        <div className="p-4">
          <p className="text-xl font-semibold my-2 underline decoration-sky-500 hover:decoration-4">
            📺 Pantallas
          </p>
        </div>
      </div>

      <div className="p-4 rounded-lg mx-auto w-full  min-h-screen">
        <div className="relative">
          <PantallasEditor />
        </div>
      </div>
    </main>
  );
};

export default Pantallas;
