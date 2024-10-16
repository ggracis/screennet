// app/api/categorias/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/categorias?populate=*`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const categories = await response.json();

    const adaptedCategories = categories.data.map((category) => ({
      id: category.id,
      attributes: {
        nombre: category.attributes.nombre,
      },
    }));

    return NextResponse.json(adaptedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
