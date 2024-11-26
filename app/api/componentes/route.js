// app/api/componentes/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.STRAPI_API_URL}/componentes`, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new Error(`Error al obtener componentes: ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en la obtención de componentes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}
