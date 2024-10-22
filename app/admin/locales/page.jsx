import { LocalEditor } from "@/components/admin/LocalEditor";

export async function generateMetadata() {
  return {
    title: `ScreenNet - Configuración del Local`,
  };
}
const ListOfProducts = async () => {
  return (
    <>
      <h2 className="mt-4 text-center text-xl font-semibold my-2 underline decoration-sky-500 hover:decoration-4">
        Editar información del local
      </h2>
      <div className="p-6 m-4 rounded-lg border w-min mx-auto">
        <LocalEditor />
      </div>
    </>
  );
};
export default ListOfProducts;
