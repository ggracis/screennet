const formatoMoneda = (value, options = {}) => {
  const {
    locale = "es-AR",
    currency = "ARS",
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  } = options;

  if (!value || isNaN(value)) return "-";

  // Convertir a número para asegurarnos que es un valor numérico
  const numericValue = Number(value);

  // Verificar si tiene decimales
  const hasDecimals = numericValue % 1 !== 0;

  // Usar 0 decimales si el número es entero, sino usar hasta 2 decimales
  const formattedValue = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: hasDecimals ? minimumFractionDigits : 0,
    maximumFractionDigits,
    notation: "standard",
  }).format(numericValue);

  return formattedValue;
};

export default formatoMoneda;
