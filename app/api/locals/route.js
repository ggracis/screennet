import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.STRAPI_API_URL}/locals?populate=*`, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        cache: "no-store",
      },
    });

    if (!res.ok) {
      throw new Error(`Error al obtener locales: ${res.statusText}`);
    }

    const { data } = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en la obtención de locales:", error);
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
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/locals`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error al crear local: ${response.status} ${response.statusText}`
      );
    }

    const createdData = await response.json();
    return NextResponse.json(createdData);
  } catch (error) {
    console.error("Error en la creación del local:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}
