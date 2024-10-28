import PantallasLocal from "@/components/PantallasLocal";

export async function generateMetadata({ params }) {
  return {
    title: `ScreenNet - Pantalla ${params.id}`,
  };
}

const Pantalla = ({ params }) => {
  return <PantallasLocal params={params} />;
};

export default Pantalla;
