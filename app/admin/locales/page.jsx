import HeaderSection from "@/components/admin/HeaderSection";
import { LocalEditor } from "@/components/admin/LocalEditor";

const ListOfProducts = async () => {
  return (
    <main>
      <HeaderSection
        title="📍 Locales"
        description={
          <>
            Editá el nombre, dirección, redes sociales, colores y logo de cada
            local.
            <br />
            ¡Dale a tu negocio la identidad que se merece!
          </>
        }
      />

      <div className="p-6 m-4 rounded-lg border w-min mx-auto">
        <LocalEditor />
      </div>
    </main>
  );
};
export default ListOfProducts;
