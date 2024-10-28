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
    // Preparar los datos para la actualización
    const updateData = {
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion,
        precios: body.precios, // Usar directamente el objeto de precios
        unidadMedida: body.unidadMedida, // Asegurarse de enviar la unidad de medida
        categoria: body.categoria
          ? { connect: [{ id: parseInt(body.categoria) }] }
          : null,
        subcategoria: body.subcategoria
          ? { connect: [{ id: parseInt(body.subcategoria) }] }
          : null,
      },
    };

    const response = await fetch(
      `${process.env.STRAPI_API_URL}/productos/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return NextResponse.json(
      { error: "Error al actualizar el producto" },
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
