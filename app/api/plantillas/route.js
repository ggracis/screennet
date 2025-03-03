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
    const plantillas = data.map((item) => {
      const componentes = item.attributes?.componentes || {};
      return {
        id: item.id,
        nombre: item.attributes?.nombre,
        descripcion: item.attributes?.descripcion,
        columnas: item.attributes?.columnas,
        filas: item.attributes?.filas,
        imagen: item.attributes?.imagen?.data?.attributes?.url
          ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.attributes.imagen.data.attributes.url}`
          : null,
        fondo: item.attributes?.fondo?.data?.attributes?.url
          ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.attributes.fondo.data.attributes.url}`
          : null,
        fondo1: item.attributes?.fondo1,
        componentes: {
          header: componentes.header || null,
          footer: componentes.footer || null,
          espacios: componentes.espacios || {},
          config_componentes: componentes.config_componentes || {},
        },
        createdAt: item.attributes?.createdAt,
        updatedAt: item.attributes?.updatedAt,
      };
    });

    return NextResponse.json(plantillas);
  } catch (error) {
    console.error("Error en la obtención de plantillas:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log("Datos recibidos:", JSON.stringify(data, null, 2));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/plantillas`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error response from Strapi:", errorData);
      throw new Error(
        `Error al crear plantilla: ${response.status} ${errorData}`
      );
    }

    const createdData = await response.json();
    return NextResponse.json(createdData);
  } catch (error) {
    console.error("Error detallado en la creación de plantilla:", error);
    return NextResponse.json(
      {
        error: "Error al crear la plantilla",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
