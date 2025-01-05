"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import useProductStore from "@/stores/useProductStore";
import { useEffect, useState } from "react";
import Image from "next/image";

const Galeria2 = ({ productos: productosIds = [] }) => {
  const { products, fetchAllProducts, loading } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (products.length === 0) {
      fetchAllProducts();
    }
  }, []);

  useEffect(() => {
    if (productosIds.length > 0 && products.length > 0) {
      const ordered = productosIds
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean);
      setFilteredProducts(ordered);
    }
  }, [productosIds, products]);

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
    return <div>Cargando productos...</div>;
  }

  if (!filteredProducts.length) {
    return <div>No se encontraron productos</div>;
  }

  return (
    <div className="flex-1 container mx-auto p-2 flex items-center justify-center">
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
              <div className="items-center justify-center flex flex-col">
                <h1 className="text-4xl font-medium title-font mb-2 text-white">
                  {producto.attributes.nombre}
                </h1>

                {/* Precios */}
                <div className="items-center justify-center flex flex-col">
                  {Object.entries(producto.attributes.precios || {})
                    .filter(([_, precio]) => precio)
                    .map(([titulo, precio]) => (
                      <div
                        key={`${producto.id}-${titulo}`}
                        className="items-center justify-center "
                      >
                        <span className="text-4xl font-bold text-white">
                          ${precio}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Fotos */}
                <div>
                  {procesarMedios(producto).length > 0 ? (
                    <Carousel
                      opts={{
                        align: "start",
                        loop: true,
                      }}
                      plugins={[
                        Autoplay({
                          delay: 8000,
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
                                className="w-full h-full max-h-[37vh] object-contain"
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
  );
};

export default Galeria2;
