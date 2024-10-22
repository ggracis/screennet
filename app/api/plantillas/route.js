// app/api/plantillas/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      `${process.env.STRAPI_API_URL}/plantillas?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          cache: "no-store",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Error al obtener plantillas: ${res.statusText}`);
    }

    const { data } = await res.json();
    const plantillas = data.map((item) => ({
      id: item.id,
      nombre: item.attributes.nombre,
      descripcion: item.attributes.descripcion,
      columnas: item.attributes.columnas,
      filas: item.attributes.filas,
      imagen:
        "https://screen.net.ar/strapi" +
        item.attributes.imagen.data[0]?.attributes.url,
      fondo:
        "https://screen.net.ar/strapi" +
        item.attributes.fondo.data[0]?.attributes.url,
    }));

    return NextResponse.json(plantillas);
  } catch (error) {
    console.error("Error en la obtención de plantillas:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}
