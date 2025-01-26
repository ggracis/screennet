//components\screen\lista-de-productos\Galeria1.jsx
"use client";

import { useProductContext } from "@/contexts/ProductContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import Image from "next/image";

const Galeria1 = ({ productos: productosIds = [] }) => {
  const { products, loading, error } = useProductContext();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (products.length > 0 && productosIds.length > 0) {
      const ordered = productosIds
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean);
      setFilteredProducts(ordered);
    }
  }, [products, productosIds]);

  const procesarMedios = (producto) => {
    const medios = [];
    if (producto.attributes.foto?.data) {
      producto.attributes.foto.data.forEach((item) => {
        const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "";
        const url = `${baseUrl}${item.attributes.url}`;
        const tipo = item.attributes.mime?.startsWith("video/")
          ? "video"
          : "imagen";
        medios.push({ tipo, url });
      });
    }
    return medios;
  };

  const formatearPrecio = (precios) => {
    if (!precios) return "Consultar";
    return precios["C/U"] ? `$${precios["C/U"]}` : "Consultar";
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 rounded p-4">
        Cargando productos...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!filteredProducts.length) {
    return (
      <div className="animate-pulse bg-gray-200 rounded p-4">
        Actualizando productos...
      </div>
    );
  }

  return (
    <section className="text-gray-400 relative h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-5 py-10 flex items-center justify-center">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 10000,
              stopOnInteraction: false,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {filteredProducts.map((producto) => (
              <CarouselItem key={producto.id}>
                <div className="flex items-center justify-center gap-8 h-[80vh]">
                  {/* Columna izquierda - Información */}

                  <div className="w-1/2 pr-8 space-y-4">
                    <h1 className="text-6xl font-medium title-font mb-4 text-white">
                      {producto.attributes.nombre}
                    </h1>
                    <h3 className="text-2xl title-font text-gray-600">
                      {producto.attributes.categoria?.data?.attributes
                        ?.nombre && (
                        <>
                          {producto.attributes.categoria.data.attributes.nombre}
                        </>
                      )}
                      {producto.attributes.subcategoria?.data?.attributes
                        ?.nombre && (
                        <>
                          {" "}
                          -{" "}
                          {
                            producto.attributes.subcategoria.data.attributes
                              .nombre
                          }
                        </>
                      )}
                    </h3>

                    {/* Precios */}
                    <div className="space-y-2">
                      {Object.entries(producto.attributes.precios || {})
                        .filter(([_, precio]) => precio)
                        .map(([titulo, precio]) => (
                          <div
                            key={`${producto.id}-${titulo}`}
                            className="flex items-center gap-2"
                          >
                            <span className="text-gray-300 text-4xl">
                              {titulo}:
                            </span>
                            <span className="text-4xl font-bold text-white">
                              ${precio}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Columna derecha - Galería */}
                  <div className="w-1/2 h-full">
                    {procesarMedios(producto).length > 0 ? (
                      <Carousel
                        opts={{
                          align: "start",
                          loop: true,
                        }}
                        plugins={[
                          Autoplay({
                            delay: 2000,
                          }),
                        ]}
                        className="h-full"
                      >
                        <CarouselContent className="h-full">
                          {procesarMedios(producto).map((medio, idx) => (
                            <CarouselItem key={idx} className="h-full">
                              {medio.tipo === "video" ? (
                                <video
                                  className="w-full h-full object-cover"
                                  autoPlay
                                  muted
                                  loop
                                  playsInline
                                >
                                  <source src={medio.url} type="video/mp4" />
                                </video>
                              ) : (
                                <Image
                                  alt={producto.attributes.nombre}
                                  className="w-full h-full object-contain"
                                  src={medio.url}
                                  width={800}
                                  height={800}
                                  priority
                                  quality={100}
                                  loading="eager"
                                  blurDataURL={medio.url}
                                />
                              )}
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    ) : (
                      <div className="h-full bg-gray-800 rounded flex items-center justify-center">
                        <span className="text-gray-500">
                          Sin imágenes disponibles
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default Galeria1;
