import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const pageSize = parseInt(searchParams.get("pageSize")) || 10;
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "nombre:asc";
    const [sortField, sortDirection] = sort.split(":");

    let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/productos?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`;

    if (search) {
      url += `&filters[$or][0][nombre][$containsi]=${search}`;
    }

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

    url += `&sort=${sortField}:${sortDirection}`;

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

    return NextResponse.json({
      data: products.data,
      meta: products.meta,
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
  try {
    const body = await request.json();
    console.log("Datos recibidos en API:", JSON.stringify(body, null, 2));

    // Asegurarse de que los datos estén en el formato correcto para Strapi
    const createData = {
      data: {
        nombre: body.data.nombre,
        descripcion: body.data.descripcion,
        unidadMedida: body.data.unidadMedida,
        precios: body.data.precios,
        // Formato correcto para relaciones en Strapi v4
        categoria: body.data.categoria
          ? { connect: [body.data.categoria] }
          : undefined,
        subcategoria: body.data.subcategoria
          ? { connect: [body.data.subcategoria] }
          : undefined,
      },
    };

    console.log(
      "Datos enviados a Strapi:",
      JSON.stringify(createData, null, 2)
    );

    const response = await fetch(`${process.env.STRAPI_API_URL}/productos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(createData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error de Strapi:", errorData);
      throw new Error(JSON.stringify(errorData));
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error completo:", error);
    return NextResponse.json(
      { error: "Error al crear el producto", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    console.log("=== INICIO DELETE ALL PRODUCTOS ===");

    // Obtener productos por lotes
    let allProducts = [];
    let page = 1;
    let totalPages = 1;
    const pageSize = 100;

    // Primero obtenemos todos los productos en lotes
    while (page <= totalPages) {
      const url = `${process.env.STRAPI_API_URL}/productos?pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
      console.log(`Obteniendo lote ${page} - URL:`, url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error obteniendo productos: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      allProducts = allProducts.concat(data.data);
      totalPages = data.meta.pagination.pageCount;
      console.log(
        `Lote ${page}/${totalPages} obtenido - ${data.data.length} productos`
      );
      page++;
    }

    console.log(`Total de productos a eliminar: ${allProducts.length}`);

    // Eliminar cada producto
    const deleteResults = [];
    for (const product of allProducts) {
      const deleteUrl = `${process.env.STRAPI_API_URL}/productos/${product.id}`;
      console.log(`Eliminando producto ${product.id}`);

      try {
        const deleteResponse = await fetch(deleteUrl, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        deleteResults.push({
          productId: product.id,
          success: deleteResponse.ok,
          status: deleteResponse.status,
        });

        if (!deleteResponse.ok) {
          console.error(
            `Error al eliminar producto ${product.id}: ${deleteResponse.status}`
          );
        }
      } catch (error) {
        console.error(`Error al eliminar producto ${product.id}:`, error);
        deleteResults.push({
          productId: product.id,
          success: false,
          error: error.message,
        });
      }
    }

    const successCount = deleteResults.filter((r) => r.success).length;
    const failCount = deleteResults.filter((r) => !r.success).length;

    console.log("=== RESUMEN DE ELIMINACIÓN ===");
    console.log(`Productos eliminados: ${successCount}`);
    console.log(`Fallos: ${failCount}`);

    return NextResponse.json({
      message: "Proceso de eliminación completado",
      totalProcessed: allProducts.length,
      succeeded: successCount,
      failed: failCount,
      details: deleteResults,
    });
  } catch (error) {
    console.error("Error en DELETE ALL:", error);
    return NextResponse.json(
      {
        error: "Error eliminando productos",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
