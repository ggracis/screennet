import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lastUpdate = searchParams.get("lastUpdate");

    const url = `${process.env.STRAPI_API_URL}/productos?filters[updatedAt][$gt]=${lastUpdate}&populate=*`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch updated products");
    }

    const products = await response.json();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching updated products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
