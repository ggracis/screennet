import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || 1;
    const pageSize = searchParams.get("pageSize") || 10;
    const search = searchParams.get("search") || "";

    let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/productos?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`;

    if (search) {
      url += `&filters[$or][0][nombre][$containsi]=${search}`;
    }

    // Mantén los filtros de categoría y subcategoría si los necesitas
    const categoryFilter = searchParams.get("filters[categoria][id][$eq]");
    if (categoryFilter) {
      url += `&filters[categoria][id][$eq]=${categoryFilter}`;
    }

    const subcategoriaFilter = searchParams.get(
      "filters[subcategoria][id][$eq]"
    );
    if (subcategoriaFilter) {
      url += `&filters[subcategoria][id][$eq]=${subcategoriaFilter}`;
    }

    url += `&sort=nombre:asc`;

    console.log("API URL:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await response.json();

    const adaptedProducts = products.data.map((product) => ({
      id: product.id,
      attributes: {
        nombre: product.attributes.nombre,
        descripcion: product.attributes.descripcion,
        unidadMedida: product.attributes.unidadMedida,
        precios: product.attributes.precios,
        activo: product.attributes.activo,
        createdAt: product.attributes.createdAt,
        updatedAt: product.attributes.updatedAt,
        foto: product.attributes.foto,
        categoria: product.attributes.categoria,
        subcategoria: product.attributes.subcategoria,
      },
    }));

    return NextResponse.json({
      data: adaptedProducts,
      meta: {
        pagination: products.meta.pagination,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const body = await request.json();
  try {
    // Preparar los datos para la creación
    const createData = {
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

    const response = await fetch(`${process.env.STRAPI_API_URL}/productos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(createData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    return NextResponse.json(
      { error: "Error al crear el producto" },
      { status: 500 }
    );
  }
}
