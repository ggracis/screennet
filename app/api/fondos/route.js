import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      `${process.env.STRAPI_API_URL}/upload/files?folder=fondos`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          cache: "no-store",
        },
      }
    );

    if (!res.ok) throw new Error("Error fetching fondos");

    const data = await res.json();
    return NextResponse.json({ fondos: data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error interno del servidor", error },
      { status: 500 }
    );
  }
}
