import React, { useEffect, useRef } from "react";

const YoutubeVideo = ({ data }) => {
  const iframeRef = useRef(null);

  const getVideoId = (url) => {
    if (!url) return null;

    // Si ya es un ID directo (11 caracteres)
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url;
    }

    // Patrones de URL de YouTube
    const patterns = {
      standard:
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      shortened: /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
      embed:
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      playlist:
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/,
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      const match = url.match(pattern);
      if (match) {
        if (type === "playlist") {
          return { type: "playlist", id: match[1] };
        }
        return match[1];
      }
    }

    return null;
  };

  useEffect(() => {
    if (!iframeRef.current || !data) return;

    const videoInfo = getVideoId(data);
    if (!videoInfo) return;

    const iframe = iframeRef.current;
    let embedUrl;

    if (typeof videoInfo === "object" && videoInfo.type === "playlist") {
      embedUrl = `https://www.youtube.com/embed/videoseries?list=${videoInfo.id}&autoplay=1&mute=1`;
    } else {
      embedUrl = `https://www.youtube.com/embed/${videoInfo}?autoplay=1&mute=1`;
    }

    iframe.src = embedUrl;
  }, [data]);

  return (
    <div className="w-full h-full flex items-center justify-center p-1 rounded-lg bg-black">
      <div className="w-full h-full">
        <iframe
          ref={iframeRef}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube Video"
        />
      </div>
    </div>
  );
};

YoutubeVideo.displayName = "YoutubeVideo";

export default YoutubeVideo;
