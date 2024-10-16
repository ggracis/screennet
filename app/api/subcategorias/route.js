// app/api/subcategorias/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/subcategorias?populate=*`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch subcategories");
    }

    const subcategories = await response.json();

    const adaptedSubcategories = subcategories.data.map((subcategoria) => ({
      id: subcategoria.id,
      attributes: {
        nombre: subcategoria.attributes.nombre,
      },
    }));

    return NextResponse.json(adaptedSubcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
