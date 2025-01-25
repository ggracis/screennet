import formatoMoneda from "@/hooks/useFormatoMoneda";

export const formatPrice = (value) => {
  return formatoMoneda(value);
};

export const formatCompactPrice = (value) => {
  return formatoMoneda(value, {
    notation: "compact",
  });
};

export const getPrecioOrdenado = (precios, unidadMedida, orden) => {
  const ordenPrecios = {
    "Kg.": ["1/4 Kg.", "1/2 Kg.", "1 Kg."],
    Unidad: ["C/U", "1/2 Doc.", "1 Doc."],
    Porcion: ["Chico", "Mediano", "Grande"],
  };

  if (!precios || !unidadMedida) return "N/A";
  const titulos = ordenPrecios[unidadMedida] || [];
  return precios[titulos[orden]] || "N/A";
};
