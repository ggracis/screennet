"use client";
import { useState, useEffect } from "react";

const MarqueeSocial = ({ redes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const redesArray = Object.entries(redes);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(false);
      // Pequeño timeout para reiniciar la animación
      setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === redesArray.length - 1 ? 0 : prevIndex + 1
        );
        setIsAnimating(true);
      }, 50);
    }, 3000);

    return () => clearInterval(interval);
  }, [redesArray.length]);

  const [platform, url] = redesArray[currentIndex];

  return (
    <div
      className={`flex items-center space-x-1  ${
        isAnimating ? "animate-fade-in" : ""
      }`}
      style={{ minWidth: "max-content" }}
    >
      <span className="font-semibold capitalize">{platform}:</span>
      <span>{url}</span>
    </div>
  );
};

export default MarqueeSocial;
