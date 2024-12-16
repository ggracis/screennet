import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    console.log("API: Received search term:", search);

    let allProducts = [];
    let page = 1;
    const pageSize = 100; // Número de productos por página

    while (true) {
      let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/productos?fields[0]=id&fields[1]=nombre&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=nombre:asc`;

      if (search) {
        url += `&filters[nombre][$containsi]=${search}`;
      }

      console.log("API: Fetching from URL:", url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al buscar productos");
      }

      const products = await response.json();
      console.log("API: Raw response from Strapi:", products);

      // Si no hay más productos, salimos del bucle
      if (products.data.length === 0) {
        break;
      }

      // Agregamos los productos simplificados al array
      const simplifiedProducts = products.data.map((product) => ({
        id: product.id,
        nombre: product.attributes.nombre,
      }));

      allProducts = [...allProducts, ...simplifiedProducts];
      page++; // Incrementamos la página para la siguiente solicitud
    }

    console.log("API: Total products fetched:", allProducts.length);

    return NextResponse.json(allProducts);
  } catch (error) {
    console.error("API: Error al buscar productos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
