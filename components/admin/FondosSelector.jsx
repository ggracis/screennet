import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const FondosSelector = ({ onSelect, selectedFondo }) => {
  const [fondos, setFondos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFondos();
  }, []);

  const fetchFondos = async () => {
    try {
      const response = await fetch("/api/fondos");
      if (!response.ok) throw new Error("Error al cargar fondos");
      const data = await response.json();
      setFondos(data.fondos);
    } catch (error) {
      console.error("Error fetching fondos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función auxiliar para obtener la URL completa
  const getFullUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`;
  };

  // Verificar si una URL coincide con la seleccionada
  const isSelected = (url) => {
    const fullUrl1 = getFullUrl(url);
    const fullUrl2 = getFullUrl(selectedFondo);

    const path1 = fullUrl1.split("/uploads/")[1];
    const path2 = fullUrl2.split("/uploads/")[1];

    console.log("isSelected comparing paths:", {
      path1,
      path2,
      isMatch: path1 === path2,
    });

    return path1 === path2;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-2">
          Seleccionar de la biblioteca
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Biblioteca de Fondos</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] p-4">
          <div className="grid grid-cols-3 gap-4">
            {isLoading ? (
              <div>Cargando fondos...</div>
            ) : (
              fondos.map((fondo) => (
                <div
                  key={fondo.id}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                    isSelected(fondo.url)
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() => {
                    console.log("Fondo seleccionado:", {
                      url: fondo.url,
                      fullUrl: getFullUrl(fondo.url),
                    });
                    onSelect(fondo);
                  }}
                >
                  {fondo.mime.startsWith("video/") ? (
                    <video
                      src={getFullUrl(fondo.url)}
                      className="w-full h-32 object-cover"
                      muted
                      loop
                      autoPlay
                    />
                  ) : (
                    <img
                      src={getFullUrl(fondo.url)}
                      alt={fondo.name}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                    <p className="text-xs text-white truncate">{fondo.name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FondosSelector;
