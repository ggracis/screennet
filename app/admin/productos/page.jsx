import HeaderSection from "@/components/admin/HeaderSection";
import ProductosLista from "@/components/admin/ProductosLista";

const ListOfProducts = async () => {
  return (
    <main>
      <HeaderSection
        title="🛒 Productos"
        subtitle="Tu inventario al toque"
        description={
          <>
            Agregá, buscá, eliminá y editá productos.
            <br /> Actualizá precios, descripciones, unidades de medida,
            categorías y subcategorías. <br />
            ¡Todo bien ordenado y fácil de manejar!
          </>
        }
      />

      <ProductosLista />
    </main>
  );
};
export default ListOfProducts;
