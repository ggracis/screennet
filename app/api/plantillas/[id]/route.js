import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;
  const timestamp = Date.now();

  try {
    const headers = {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      cache: "no-store",
    };

    console.log(`Obteniendo datos de la plantilla ${id}`);

    const plantillaResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/plantillas/${id}?populate=*&timestamp=${timestamp}`,
      { headers }
    );

    if (!plantillaResponse.ok) {
      throw new Error(
        `Error al obtener datos de la plantilla: ${plantillaResponse.status} ${plantillaResponse.statusText}`
      );
    }

    const plantillaData = await plantillaResponse.json();
    console.log(`Datos de la plantilla obtenidos:`, plantillaData);

    // Asegurarse de que componentes sea un objeto con las propiedades esperadas
    const componentes = plantillaData.data.attributes.componentes || {
      header: null,
      footer: null,
      espacios: {},
      config_componentes: {},
    };

    return NextResponse.json({
      ...plantillaData.data,
      attributes: { ...plantillaData.data.attributes, componentes },
    });
  } catch (error) {
    console.error("Error en la obtención de datos de la plantilla:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();

  try {
    console.log(
      "1. Datos originales recibidos:",
      JSON.stringify(body, null, 2)
    );

    if (body.data.fondo?.id) {
      body.data.fondo = {
        set: [body.data.fondo.id],
      };
    }

    if (body.data.overlayOpacity) {
      body.data.overlayOpacity = parseFloat(body.data.overlayOpacity);
    }

    console.log(
      "3. Datos transformados a enviar a Strapi:",
      JSON.stringify(body, null, 2)
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/plantillas/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("4. Error response from Strapi:", errorText);
      throw new Error(
        `Error al actualizar datos: ${response.status} ${response.statusText}`
      );
    }

    const updatedData = await response.json();
    console.log(
      "5. Respuesta exitosa de Strapi:",
      JSON.stringify(updatedData, null, 2)
    );

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error("6. Error detallado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/plantillas/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error al eliminar: ${response.status}`);
    }

    return NextResponse.json({ message: "Plantilla eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la plantilla:", error);
    return NextResponse.json(
      { error: "Error al eliminar la plantilla" },
      { status: 500 }
    );
  }
}
