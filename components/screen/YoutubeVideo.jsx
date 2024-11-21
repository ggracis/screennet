import React, { useEffect, useRef } from 'react';

const YoutubeVideo = ({ videoUrl }) => {
  const iframeRef = useRef(null);

  // Función para obtener el ID del video a partir de la URL de YouTube
  const getVideoId = (url) => {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/\S+\/|(?:v|e(?:mbed)?)\/?([^&=%\?\/\s]{11})))|(?:youtu\.be\/([^&=%\?\/\s]{11}))/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(videoUrl);

  useEffect(() => {
    if (iframeRef.current && videoId) {
      const iframe = iframeRef.current;
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`; // El ?autoplay=1 asegura que el video se reproduzca automáticamente
    }
  }, [videoUrl]);

  if (!videoId) {
    return <div>URL de YouTube inválida</div>;
  }

  return (
    <div>
      <iframe
        ref={iframeRef}
        width="560"
        height="315"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube Video"
      />
    </div>
  );
};
YoutubeVideo.displayName = "YoutubeVideo";

export default YoutubeVideo;
