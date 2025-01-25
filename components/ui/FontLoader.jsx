const FontLoader = ({ fonts = [] }) => {
  if (!fonts || fonts.length === 0) return null;

  return (
    <style jsx global>{`
      ${fonts
        .map(
          (font) => `
        @import url('https://fonts.googleapis.com/css2?family=${font.replace(
          /\s+/g,
          "+"
        )}:wght@400;500;600;700&display=swap');
      `
        )
        .join("\n")}
    `}</style>
  );
};

export default FontLoader;
