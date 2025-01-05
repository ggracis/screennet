import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();
  const files = formData.getAll("files");

  try {
    const uploadPromises = files.map(async (file) => {
      const fileData = new FormData();
      fileData.append("files", file);
      fileData.append("path", "productos");

      const response = await fetch(`${process.env.STRAPI_API_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: fileData,
      });

      if (!response.ok) {
        throw new Error(`Error al subir el archivo: ${response.status}`);
      }

      const uploadedFile = await response.json();
      return uploadedFile;
    });

    const results = await Promise.all(uploadPromises);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error al subir los archivos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const response = await fetch(
      `${process.env.STRAPI_API_URL}/upload/files/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error al eliminar el archivo: ${response.status}`);
    }

    return NextResponse.json({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el archivo:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}
