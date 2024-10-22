// app\api\locals\[id]\route.js

import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;
  const timestamp = Date.now();

  try {
    const headers = {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      cache: "no-store",
    };

    console.log(`Obteniendo datos del local ${id}`);

    const localResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/locals/${id}?populate=*&timestamp=${timestamp}`,
      { headers }
    );

    if (!localResponse.ok) {
      throw new Error(
        `Error al obtener datos del local: ${localResponse.status} ${localResponse.statusText}`
      );
    }

    const localData = await localResponse.json();
    console.log(`Datos del local obtenidos:`, localData);

    return NextResponse.json({ local: localData.data });
  } catch (error) {
    console.error("Error en la obtención de datos del local:", error);
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

    console.log(`Actualizando datos del local ${id}`);
    console.log("Datos recibidos:", JSON.stringify(body, null, 2));

    // Verificar la estructura de los datos y extraer lo necesario
    const nombre = body.data?.nombre;
    const opciones = body.data?.opciones;

    if (nombre === undefined && opciones === undefined) {
      throw new Error("Datos de actualización inválidos");
    }

    // Preparar los datos para la actualización
    const updateData = {
      data: {},
    };

    if (nombre !== undefined) updateData.data.nombre = nombre;
    if (opciones !== undefined) updateData.data.opciones = opciones;

    console.log(
      "Datos enviados a Strapi:",
      JSON.stringify(updateData, null, 2)
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/locals/${id}`,
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
