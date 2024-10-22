import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;
  const timestamp = Date.now();

  try {
    const headers = {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      cache: "no-store",
    };

    console.log(
      `Obteniendo datos del usuario ${id} a las ${new Date().toISOString()}`
    );

    const userResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${id}?populate=*&timestamp=${timestamp}`,
      { headers }
    );

    if (!userResponse.ok) {
      throw new Error(
        `Error al obtener datos del usuario: ${userResponse.status} ${userResponse.statusText}`
      );
    }

    const userData = await userResponse.json();
    console.log(`Datos del usuario obtenidos:`, userData);

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error("Error en la obtención de datos del usuario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}
