import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const { id } = params;

  try {
    // Lógica para invalidar la caché
    await fetch(
      `${process.env.STRAPI_API_URL}/pantallas/${id}?invalidate_cache=true`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }
    );

    return NextResponse.json({ message: "Cache invalidated" });
  } catch (error) {
    console.error("Error invalidating cache:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
