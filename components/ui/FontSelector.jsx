"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const popularFonts = [
  { family: "Inter", category: "sans-serif" },
  { family: "Roboto", category: "sans-serif" },
  { family: "Open Sans", category: "sans-serif" },
  { family: "Lato", category: "sans-serif" },
  { family: "Poppins", category: "sans-serif" },
  { family: "Playfair Display", category: "serif" },
  { family: "Merriweather", category: "serif" },
  { family: "Montserrat", category: "sans-serif" },
  { family: "Oswald", category: "sans-serif" },
  { family: "Raleway", category: "sans-serif" },
];

const FontSelector = ({ value, onValueChange, label }) => {
  const [fonts, setFonts] = useState(popularFonts);
  const [loaded, setLoaded] = useState({});

  useEffect(() => {
    // Cargar las fuentes iniciales
    fonts.forEach((font) => {
      if (!loaded[font.family]) {
        loadFont(font.family);
      }
    });
  }, []);

  const loadFont = async (fontFamily) => {
    if (loaded[fontFamily]) return;

    const fontName = fontFamily.replace(/\s+/g, "+");
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${fontName}&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    setLoaded((prev) => ({ ...prev, [fontFamily]: true }));
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccionar fuente" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sans Serif</SelectLabel>
            {fonts
              .filter((font) => font.category === "sans-serif")
              .map((font) => (
                <SelectItem
                  key={font.family}
                  value={font.family}
                  style={{ fontFamily: font.family }}
                >
                  {font.family}
                </SelectItem>
              ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Serif</SelectLabel>
            {fonts
              .filter((font) => font.category === "serif")
              .map((font) => (
                <SelectItem
                  key={font.family}
                  value={font.family}
                  style={{ fontFamily: font.family }}
                >
                  {font.family}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {value && (
        <div
          className="p-2 mt-2 bg-gray-800/50 rounded"
          style={{ fontFamily: value }}
        >
          <p className="text-lg">Vista previa:</p>
          <p className="text-sm">AaBbCcDdEeFfGgHhIiJjKkLl</p>
          <p className="text-sm">áéíóúñ</p>
          <p className="text-md">1234567890-_+/*¿?$</p>
        </div>
      )}
    </div>
  );
};

export default FontSelector;
