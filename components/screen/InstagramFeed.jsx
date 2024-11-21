import { useEffect, useState } from "react";
import { InstagramEmbed } from "react-social-media-embed";

const InstagramFeed = ({ username }) => {
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!username) return;

      try {
        const cleanUsername = username.replace("@", "").trim();
        const response = await fetch(`/api/instagram/${cleanUsername}`);
        if (!response.ok) throw new Error("Error fetching Instagram posts");

        const data = await response.json();
        setProfileData(data.profile);
        setPosts(data.posts);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [username]);

  if (loading) return <div>Cargando posts de Instagram...</div>;
  if (error) return <div>Error cargando posts: {error}</div>;
  if (!posts.length) return <div>No se encontraron posts</div>;

  return (
    <div className="space-y-6">
      {profileData && (
        <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
          <h3 className="text-lg font-semibold">@{profileData.username}</h3>
          <span>{profileData.followers} seguidores</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="w-full max-w-[328px] mx-auto">
            <InstagramEmbed url={post.url} width={328} captioned={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstagramFeed;
