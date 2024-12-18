import HeaderSection from "@/components/admin/HeaderSection";
import PlantillasEditor from "@/components/admin/PlantillasEditor";
import PlantillasPreview from "@/components/admin/PlantillasPreview";

export async function generateMetadata() {
  return {
    title: `ScreenNet - Personalizar plantilla`,
  };
}

const Plantillas = async ({ params }) => {
  const { id } = params;

  // Obtener datos de la plantilla
  const response = await fetch(
    `${process.env.STRAPI_API_URL}/plantillas/${id}?populate=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return <div>Error al cargar la plantilla</div>;
  }

  const data = await response.json();

  return (
    <main>
      <HeaderSection
        title="🎨 Plantillas"
        subtitle="Diseñá a tu gusto"
        description={
          <>
            Creá plantillas personalizadas con componentes como listas de
            productos, redes sociales, videos y más.
            <br /> Ajustá el header, footer, columnas, fondos...
            <br /> ¡Hacé que tus pantallas reflejen tu estilo!
          </>
        }
      />

      <div className="grid gap-4 p-6 m-4 rounded-lg border w-11/12 mx-auto">
        <PlantillasEditor plantillaInicial={data.data} />
      </div>
    </main>
  );
};

export default Plantillas;
