import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { username } = params;
  console.log("Obteniendo posts de:", username);

  try {
    // Obtener el HTML de la página pública de Instagram
    const response = await fetch(
      `https://www.instagram.com/${username}/?__a=1&__d=dis`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error al obtener datos de Instagram: ${response.status}`
      );
    }

    const data = await response.json();
    const user = data.graphql?.user;

    if (!user) {
      throw new Error("No se encontró información del usuario");
    }

    const posts = user.edge_owner_to_timeline_media.edges
      .slice(0, 6)
      .map((edge) => ({
        id: edge.node.id,
        url: `https://www.instagram.com/p/${edge.node.shortcode}`,
        thumbnail: edge.node.thumbnail_src,
        caption: edge.node.edge_media_to_caption?.edges[0]?.node?.text || "",
        timestamp: edge.node.taken_at_timestamp,
      }));

    return NextResponse.json({
      profile: {
        username: user.username,
        fullName: user.full_name,
        followers: user.edge_followed_by.count,
        following: user.edge_follow.count,
      },
      posts,
    });
  } catch (error) {
    console.error("Error detallado:", error);
    return NextResponse.json(
      {
        error: "Error obteniendo posts de Instagram",
        message:
          "Por favor, verifica que el usuario de Instagram sea público y esté correctamente escrito",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
