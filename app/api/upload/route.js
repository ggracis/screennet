import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request) {
  const formData = await request.formData();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from Strapi:", errorText);
      throw new Error(
        `Error al subir archivo: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error detallado en la carga del archivo:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}
