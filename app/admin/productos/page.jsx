import ProductosLista from "@/components/admin/ProductosLista";

export async function generateMetadata() {
  return {
    title: `ScreenNet - Lista de Productos`,
  };
}
const ListOfProducts = async () => {
  return (
    <main>
      <div className="flex rounded-lg items-center">
        <div className="p-6">
          <p className="text-xl font-semibold my-2 underline decoration-sky-500 hover:decoration-4">
            🛒 Productos
          </p>
          <p className="text-lg">Tu inventario al toque.</p>
        </div>
        <div className="p-6">
          <p className="text-sm">
            Agregá, buscá, eliminá y editá productos.
            <br /> Actualizá precios, descripciones, unidades de medida,
            categorías y subcategorías. <br />
            y subcategorías. <br />
            ¡Todo bien ordenado y fácil de manejar!
          </p>
        </div>
      </div>

      <ProductosLista />
    </main>
  );
};
export default ListOfProducts;
