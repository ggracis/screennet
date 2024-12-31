import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const res = await fetch(
      `${process.env.STRAPI_API_URL}/componentes/${id}?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      throw new Error(`Error al obtener componente: ${res.statusText}`);
    }

    const data = await res.json();
    const ruta = data?.data?.attributes?.ruta;

    if (!ruta) {
      return NextResponse.json(
        { error: "Componente no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ruta });
  } catch (error) {
    console.error("Error en la obtención del componente:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}
