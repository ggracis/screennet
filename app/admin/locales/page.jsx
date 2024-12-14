import { LocalEditor } from "@/components/admin/LocalEditor";

export async function generateMetadata() {
  return {
    title: `ScreenNet - Configuración del Local`,
  };
}
const ListOfProducts = async () => {
  return (
    <main>
      <div className="flex rounded-lg items-center">
        <div className="p-6">
          <p className="text-xl font-semibold my-2 underline decoration-sky-500 hover:decoration-4">
            📍 Locales
          </p>
        </div>
        <div className="p-6">
          <p className="mt-4">
            Editá el nombre, dirección, redes sociales, colores y logo de cada
            local. <br />
            ¡Dale a tu negocio la identidad que se merece!
          </p>
        </div>
      </div>
      <div className="p-6 m-4 rounded-lg border w-min mx-auto">
        <LocalEditor />
      </div>
    </main>
  );
};
export default ListOfProducts;
