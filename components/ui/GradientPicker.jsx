"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Paintbrush } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";

export function GradientPicker({ background, setBackground, className }) {
  const solids = [
    "#E2E2E2",
    "#ff75c3",
    "#ffa647",
    "#ffe83f",
    "#9fff5b",
    "#70e2ff",
    "#cd93ff",
    "#09203f",
    "#FF5733", // Rojo
    "#33FF57", // Verde
    "#3357FF", // Azul
    "#F1C40F", // Amarillo
    "#8E44AD", // Púrpura
    "#E67E22", // Naranja
    "#2ECC71", // Verde claro
    "#3498DB", // Azul claro
    "#9B59B6", // Púrpura claro
    "#1ABC9C", // Turquesa
    "#D35400", // Naranja oscuro
    "#C0392B", // Rojo oscuro
    "#2980B9", // Azul oscuro
    "#F39C12", // Amarillo oscuro
    "#2C3E50", // Gris oscuro
    "#34495E", // Gris azulado
    "#7F8C8D", // Gris
    "#BDC3C7", // Gris claro
    "#FFB6C1", // Rosa claro
    "#FF69B4", // Rosa
    "#FFD700", // Dorado
    "#ADFF2F", // Verde amarillento
    "#00FA9A", // Verde esmeralda
    "#00BFFF", // Azul profundo
    "#FF4500", // Naranja rojizo
    "#FF1493", // Rosa intenso
    "#FF6347", // Tomate
    "#4682B4", // Azul acero
    "#5F9EA0", // Verde grisáceo
    "#D2691E", // Chocolate
    "#CD5C5C", // Rojo indio
    "#F0E68C", // Amarillo pálido
    "#B22222", // Rojo fuego
    "#FF8C00", // Naranja oscuro
    "#FFDAB9", // Durazno
    "#FFE4E1", // Rosa antiguo
    "#FFEFD5", // Melocotón
    "#F5F5DC", // Beige
    "#F0F8FF", // Azul Alice
    "#E6E6FA", // Lavanda
    "#FFF0F5", // Lavanda pálido
    "#FFF5EE", // Antiguo blanco
    "#F5FFFA", // Mint
    "#F0FFF0", // Verde miel
    "#F0FFFF", // Azul pálido
    "#F5F5F5", // Blanco humo
    "#000000", // Negro
  ];

  const gradients = [
    "linear-gradient(to top left, #a8e063, #56ab2f)", // Verde suave
    "linear-gradient(to top left, #bdc3c7, #2c3e50)", // Grises profundos
    "linear-gradient(to top left, #434343, #000000)", // Negro hacia gris
    "linear-gradient(to top left, #2c3e50, #4ca1af)", // Azul-gris
    "linear-gradient(to top left, #8e2de2, #4a00e0)", // Violeta intenso
    "linear-gradient(to top left, #ff6a00, #ee0979)", // Rosa y naranja
    "linear-gradient(to top left, #00c6ff, #0072ff)", // Azul brillante
    "linear-gradient(to top left, #7b920a, #787a5b)", // Verde oliva a gris
    "linear-gradient(to top left, #757f9a, #d7dde8)", // Azul-gris claro
    "linear-gradient(to top left, #574b90, #404e92)", // Morado a azul
    "linear-gradient(to top left, #fecf6a, #f3a183)", // Amarillo a rosa
    "linear-gradient(to top left, #222, #414345)", // Gris oscuro a negro
    "linear-gradient(to top left, #56ab2f, #a8e063)", // Verde brillante
    "linear-gradient(to top left, #ff9a9e, #fad0c4)", // Rosa claro
    "linear-gradient(to top left, #d53369, #daae51)", // Rosa oscuro a dorado
    "linear-gradient(to right, #a8c0ff, #3f2b96)", // Azul a púrpura
    "linear-gradient(to bottom, #232526, #414345)", // Gris oscuro
    "linear-gradient(to top right, #00d2ff, #3a7bd5)", // Azul claro a oscuro
    "linear-gradient(to bottom right, #fddb92, #d1fdff)", // Amarillo a azul claro
    "linear-gradient(to left, #11998e, #38ef7d, #00c6ff)", // Turquesa a azul
    "linear-gradient(to top, #cfd9df, #e2ebf0)", // Gris claro
    "linear-gradient(to bottom left, #304352, #d7d2cc)", // Azul oscuro a gris claro
    "linear-gradient(to right, #ff512f, #dd2476)", // Rojo a rosa
    "linear-gradient(to top, #ee9ca7, #ffdde1)", // Rosa pálido
    "linear-gradient(to bottom, #fc5c7d, #6a82fb)", // Rosa a azul
    "linear-gradient(to top left, #e0c3fc, #8ec5fc)", // Violeta claro a azul
    "linear-gradient(to right, #fa709a, #fee140)", // Rosa a amarillo
    "linear-gradient(to bottom, #fbc2eb, #a18cd1)", // Rosa claro a púrpura
    "linear-gradient(to top right, #ff9a9e, #fad0c4)", // Rosa claro
    "linear-gradient(to bottom left, #00b09b, #96c93d)", // Teal a verde
    "linear-gradient(to right, #f093fb, #f5576c)", // Púrpura a rojo
    "linear-gradient(to top, #4b6cb7, #182848)", // Azul oscuro
    "linear-gradient(to bottom, #00c9ff, #92fe9d)", // Azul a verde
    "linear-gradient(to right, #43cea2, #185a9d)", // Verde a azul
    "linear-gradient(to left, #8e2de2, #4a00e0)", // Violeta intenso
    "linear-gradient(to bottom, #c9ffbf, #ffafbd)", // Verde claro a rosa
    "linear-gradient(to top, #ffecd2, #fcb69f)", // Crema a naranja
    "linear-gradient(to right, #ff9966, #ff5e62)", // Naranja a rojo
    "linear-gradient(to bottom, #a1c4fd, #c2e9fb)", // Azul claro
    "linear-gradient(to top left, #d4fc79, #96e6a1)", // Verde claro
  ];

  const images = [
    "url(https://images.unsplash.com/photo-1688822863426-8c5f9b257090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90)",
  ];

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

  const getFullUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`;
  };

  const defaultTab = useMemo(() => {
    if (background && typeof background === "string") {
      if (background.includes("url")) return "image";
      if (background.includes("gradient")) return "gradient";
    }
    return "solid";
  }, [background]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[220px] justify-start text-left font-normal",
            !background && "text-muted-foreground",
            className
          )}
        >
          <div className="w-full flex items-center gap-2">
            {background ? (
              <div
                className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                style={{ background }}
              ></div>
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            <div className="truncate flex-1">
              {background
                ? background.replace(/^url\(https:\/\/.*\/([^\/]+)\)$/, "$1")
                : "Elegir color"}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger className="flex-1" value="solid">
              Solidos
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="gradient">
              Gradientes
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="image">
              Multimedia
            </TabsTrigger>
          </TabsList>
          <TabsContent value="solid" className="flex flex-wrap gap-1 mt-0">
            {solids.map((s) => (
              <div
                key={s}
                style={{ background: s }}
                className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                onClick={() => setBackground(s)}
              />
            ))}
          </TabsContent>
          <TabsContent value="gradient" className="mt-0">
            <div className="flex flex-wrap gap-1 mb-2">
              {gradients.map((s) => (
                <div
                  key={s}
                  style={{ background: s }}
                  className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                  onClick={() => setBackground(s)}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="image" className="mt-0">
            <div className="grid grid-cols-2 gap-1 mb-2 max-h-[30vh] overflow-y-auto">
              {isLoading ? (
                <div>Cargando fondos...</div>
              ) : (
                fondos.map((fondo) => (
                  <div
                    key={fondo.id}
                    className="relative cursor-pointer rounded-md overflow-hidden"
                    onClick={() =>
                      setBackground(`url(${getFullUrl(fondo.url)})`)
                    }
                  >
                    {fondo.mime.startsWith("video/") ? (
                      <video
                        src={getFullUrl(fondo.url)}
                        className="w-full h-12 object-cover"
                        muted
                        loop
                        autoPlay
                      />
                    ) : (
                      <div
                        style={{
                          backgroundImage: `url(${getFullUrl(fondo.url)})`,
                        }}
                        className="rounded-md bg-cover bg-center h-12 w-full cursor-pointer active:scale-105"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
        <Input
          id="custom"
          value={background}
          className="col-span-2 h-8 mt-4"
          onChange={(e) => setBackground(e.currentTarget.value)}
        />
      </PopoverContent>
    </Popover>
  );
}

const GradientButton = ({ background, children }) => {
  return (
    <>
      <div
        className="p-0.5 rounded-md relative !bg-cover !bg-center transition-all"
        style={{ background }}
      ></div>
      <div className="bg-popover/80 rounded-md p-1 text-xs text-center">
        {children}
      </div>
    </>
  );
};
