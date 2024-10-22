import ProductosLista from "@/components/admin/ProductosLista";

export async function generateMetadata() {
  return {
    title: `ScreenNet - Lista de Productos`,
  };
}
const ListOfProducts = async () => {
  return (
    <>
      <h2 className="text-center text-xl font-semibold my-2 underline decoration-sky-500 hover:decoration-4">
        Lista de Productos
      </h2>
      <ProductosLista />
    </>
  );
};
export default ListOfProducts;
