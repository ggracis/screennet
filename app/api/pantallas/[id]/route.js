import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  console.log("Params recibidos:", params);
  console.log("ID de pantalla:", params.id);
  console.log("STRAPI_API_URL:", process.env.STRAPI_API_URL);

  if (!params.id) {
    return new Response(
      JSON.stringify({ error: "ID de pantalla no proporcionado" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const { id } = params;
  const timestamp = Date.now();

  try {
    const headers = {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      cache: "no-store",
    };

    console.log(`Obteniendo datos de la pantalla ${id}`);

    const pantallaResponse = await fetch(
      `${process.env.STRAPI_API_URL}/pantallas/${id}?timestamp=${timestamp}&populate=*`,
      { headers }
    );

    if (!pantallaResponse.ok) {
      throw new Error(
        `Error al obtener datos de la pantalla: ${pantallaResponse.status} ${pantallaResponse.statusText}`
      );
    }

    const pantallaData = await pantallaResponse.json();
    console.log(`Datos de la pantalla obtenidos:`, pantallaData);

    return NextResponse.json({ pantalla: pantallaData.data });
  } catch (error) {
    console.error("Error en la obtención de datos de la pantalla:", error);
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
    const headers = {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      "Content-Type": "application/json",
    };

    console.log(`Actualizando datos de la pantalla ${id}`);
    console.log("Datos recibidos:", JSON.stringify(body, null, 2));

    const { nombre, descripcion, plantilla_horario, local } = body.data || {};

    const updateData = {
      data: {
        nombre,
        descripcion,
        plantilla_horario,
        local,
      },
    };

    console.log(
      "Datos enviados a Strapi:",
      JSON.stringify(updateData, null, 2)
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/pantallas/${id}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from Strapi:", errorText);
      throw new Error(
        `Error al actualizar datos: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const updatedData = await response.json();
    console.log(`Respuesta de Strapi:`, JSON.stringify(updatedData, null, 2));

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error("Error detallado en la actualización de datos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}
