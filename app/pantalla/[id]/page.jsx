import PantallasLocal from "@/components/PantallasLocal";

export async function generateMetadata({ params }) {
  return {
    title: `ScreenNet - Pantalla ${params.id}`,
  };
}

const Pantalla = ({ params }) => {
  // console.log("Page params:", params);

  if (!params?.id) {
    return <div>Error: ID de pantalla no válido</div>;
  }

  return <PantallasLocal pantallaId={params.id} />;
};

export default Pantalla;
