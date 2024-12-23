import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const headers = {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      cache: "no-store",
    };

    // 1. Obtener datos de la pantalla
    const pantallaResponse = await fetch(
      `${process.env.STRAPI_API_URL}/pantallas/${id}?populate=*`,
      { headers }
    );

    if (!pantallaResponse.ok) {
      throw new Error(
        `Error al obtener datos de la pantalla: ${pantallaResponse.status}`
      );
    }

    const pantallaData = await pantallaResponse.json();

    // 2. Determinar qué plantilla usar según el horario
    const ahora = new Date();
    const horaActual = `${ahora.getHours().toString().padStart(2, "0")}:${ahora
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const diaActual = ahora.getDay(); // 0-6 (domingo-sábado)

    const diasSemana = {
      0: "0", // domingo
      1: "l",
      2: "m",
      3: "x",
      4: "j",
      5: "v",
      6: "s",
    };

    const diaActualStr = diasSemana[diaActual];
    let plantillaId = null;

    // Buscar en el horario de la pantalla
    const plantilla_horario = pantallaData.data.attributes.plantilla_horario;

    // Primero intentamos encontrar una plantilla para el horario actual
    for (const [key, horario] of Object.entries(plantilla_horario)) {
      if (key === "default") continue;

      if (horario.dias.includes(diaActualStr)) {
        const [horaInicio, horaFin] = horario.horas;
        if (horaActual >= horaInicio && horaActual <= horaFin) {
          plantillaId = horario.plantilla;
          break;
        }
      }
    }

    // Si no encontramos una plantilla específica, usamos la default
    if (!plantillaId && plantilla_horario.default) {
      plantillaId = plantilla_horario.default.plantilla;
    }

    if (!plantillaId) {
      throw new Error("No se encontró una plantilla activa para esta pantalla");
    }

    // 3. Obtener datos de la plantilla
    const plantillaResponse = await fetch(
      `${process.env.STRAPI_API_URL}/plantillas/${plantillaId}?populate=*`,
      { headers }
    );

    if (!plantillaResponse.ok) {
      throw new Error(
        `Error al obtener datos de la plantilla: ${plantillaResponse.status}`
      );
    }

    const plantillaData = await plantillaResponse.json();

    // 4. Construir la respuesta final
    return NextResponse.json({
      pantalla: {
        ...pantallaData.data,
        attributes: {
          ...pantallaData.data.attributes,
          plantilla: {
            data: plantillaData.data,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error en la obtención de datos:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();

  try {
    const headers = {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      "Content-Type": "application/json",
    };

    console.log(`Actualizando datos de la pantalla ${id}`);
    console.log("Datos recibidos:", JSON.stringify(body, null, 2));

    const { nombre, descripcion, plantilla_horario, local } = body.data || {};

    const updateData = {
      data: {
        nombre,
        descripcion,
        plantilla_horario,
        local,
      },
    };

    console.log(
      "Datos enviados a Strapi:",
      JSON.stringify(updateData, null, 2)
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/pantallas/${id}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from Strapi:", errorText);
      throw new Error(
        `Error al actualizar datos: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const updatedData = await response.json();
    console.log(`Respuesta de Strapi:`, JSON.stringify(updatedData, null, 2));

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error("Error detallado en la actualización de datos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}

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
