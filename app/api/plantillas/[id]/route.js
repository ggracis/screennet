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

    return NextResponse.json({ plantilla: plantillaData.data });
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
    const headers = {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      "Content-Type": "application/json",
    };

    console.log(`Actualizando datos de la plantilla ${id}`);
    console.log("Datos recibidos:", JSON.stringify(body, null, 2));

    // Extraer todos los datos necesarios
    const { nombre, descripcion, columnas, filas, componentes } =
      body.data || {};

    // Preparar los datos para la actualización
    const updateData = {
      data: {
        nombre,
        descripcion,
        columnas,
        filas,
        componentes,
      },
    };

    console.log(
      "Datos enviados a Strapi:",
      JSON.stringify(updateData, null, 2)
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/plantillas/${id}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error al actualizar datos: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const updatedData = await response.json();
    console.log(`Respuesta de Strapi:`, JSON.stringify(updatedData, null, 2));

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error("Error en la actualización de datos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}
