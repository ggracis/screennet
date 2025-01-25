"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import useProductStore from "@/stores/useProductStore";
import { useEffect, useState } from "react";
import Image from "next/image";
import formatoMoneda from "@/hooks/useFormatoMoneda";

const Galeria3 = ({
  productos: productosIds = [],
  titulo,
  data = 4, // Ahora usamos data en lugar de itemsPerPage
}) => {
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

  const formatPrice = formatoMoneda;

  if (loading) {
    return (
      <Card className="w-full h-full animate-pulse">
        <CardHeader>
          <CardTitle className="h-6 bg-gray-200 rounded w-1/3"></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!filteredProducts.length) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">No se encontraron productos</p>
        </CardContent>
      </Card>
    );
  }

  const getBasisClass = (items) => {
    // Mapear el número de items a una fracción de tailwind
    const fractionMap = {
      1: "basis-full",
      2: "basis-1/2",
      3: "basis-1/3",
      4: "basis-1/4",
      5: "basis-1/5",
      6: "basis-1/6",
    };

    return fractionMap[items] || "basis-1/4";
  };

  return (
    <div className="flex flex-col  border-gray-300">
      <p className="text-nowrap text-4xl titulo text-center uppercase  mt-0 mb-2 ">
        {titulo}
      </p>

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
            <CarouselItem key={producto.id} className={getBasisClass(data)}>
              <div className="items-center justify-center flex flex-col">
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
                            <Image
                              alt={producto.attributes.nombre}
                              className="w-full h-full max-h-[25vh] object-contain"
                              src={medio.url}
                              width={800}
                              height={800}
                              priority
                              quality={100}
                              loading="eager"
                              blurDataURL={medio.url}
                            />
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

                {/* Nombre */}
                <p className="text-sm font-bold text-center texto leading-5">
                  {producto.attributes.nombre}
                </p>

                {/* Precios */}
                <div className="items-center justify-center gap-2 flex flex-wrap texto">
                  {Object.entries(producto.attributes.precios || {})
                    .filter(([_, precio]) => precio)
                    .map(([titulo, precio]) => (
                      <span
                        className="text-sm"
                        key={`${producto.id}-${titulo}`}
                      >
                        {titulo}:{" "}
                        <span className="font-bold text-md">
                          {formatoMoneda(precio)}
                        </span>
                      </span>
                    ))}
                </div>
              </div>{" "}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default Galeria3;
