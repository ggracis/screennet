// app/api/pantallas/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      `${process.env.STRAPI_API_URL}/pantallas?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          cache: "no-store",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Error al obtener pantallas: ${res.statusText}`);
    }

    const { data } = await res.json();
    const tvs = data.map((item) => ({
      id: item.id,
      nombre: item.attributes?.nombre,
      plantilla_horario: item.attributes?.plantilla_horario,
      descripcion: item.attributes?.descripcion,
      local_id: item.attributes?.local?.data?.id,
      local: item.attributes?.local?.data?.attributes?.nombre,
    }));

    return NextResponse.json(tvs);
  } catch (error) {
    console.error("Error en la obtención de pantallas:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const headers = {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/pantallas`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error al crear pantalla: ${response.status} ${response.statusText}`
      );
    }

    const createdData = await response.json();
    return NextResponse.json(createdData);
  } catch (error) {
    console.error("Error en la creación de pantalla:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}
