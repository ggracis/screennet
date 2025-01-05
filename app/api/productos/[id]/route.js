// app/api/productos/[id]/route.js
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const response = await fetch(
      `${process.env.STRAPI_API_URL}/productos/${id}?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          "Cache-Control": "no-cache",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    return NextResponse.json(
      { error: "Error al obtener el producto" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();

  try {
    const strapiUrl = `${process.env.STRAPI_API_URL}/productos/${id}`;
    console.log("=== INICIO ACTUALIZACIÓN PRODUCTO ===");
    console.log("Body recibido:", JSON.stringify(body, null, 2));

    // Preparar datos para Strapi v4
    const updateData = {
      data: {
        nombre: body.nombre || body.data?.nombre,
        descripcion: body.descripcion || body.data?.descripcion,
        precios: body.precios || body.data?.precios,
        unidadMedida: body.unidadMedida || body.data?.unidadMedida,
        categoria: body.categoria || body.data?.categoria,
        subcategoria: body.subcategoria || body.data?.subcategoria,
      },
    };

    // Manejo específico de fotos para Strapi v4
    if (body.data?.foto?.set) {
      updateData.data.foto = body.data.foto.set;
    }

    console.log("URL de Strapi:", strapiUrl);
    console.log("Datos finales:", JSON.stringify(updateData, null, 2));

    const response = await fetch(strapiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(updateData),
    });

    // Log de la respuesta completa
    const responseText = await response.text();
    console.log("Respuesta cruda de Strapi:", responseText);

    if (!response.ok) {
      throw new Error(`Error de Strapi: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error detallado:", error);
    return NextResponse.json(
      {
        error: "Error al actualizar el producto",
        details: error.message,
        requestBody: body,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    const response = await fetch(
      `${process.env.STRAPI_API_URL}/productos/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return NextResponse.json(
      { error: "Error al eliminar el producto" },
      { status: 500 }
    );
  }
}
