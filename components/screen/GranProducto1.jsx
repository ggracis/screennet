"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import useProductStore from "@/stores/useProductStore";
import { useEffect, useState } from "react";

const GranProducto1 = ({ productos: productosIds = [] }) => {
  const { products, fetchProductsByIds } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      if (productosIds.length > 0) {
        // Obtener solo los productos específicos
        await fetchProductsByIds(productosIds);
        // Filtrar los productos por los IDs proporcionados y en el mismo orden
        const ordered = productosIds
          .map((id) => products.find((p) => p.id === id))
          .filter(Boolean);
        setFilteredProducts(ordered);
      }
    };

    loadProducts();
  }, [productosIds, fetchProductsByIds]);

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

  if (!filteredProducts.length) {
    return <div>Cargando productos...</div>;
  }

  return (
    <section className="text-gray-400 bg-gray-900 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
        >
          <CarouselContent>
            {filteredProducts.map((producto) => (
              <CarouselItem key={producto.id}>
                <div className="lg:w-4/5 mx-auto flex flex-wrap">
                  <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
                    <h2 className="text-sm title-font text-gray-500 tracking-widest">
                      {producto.attributes.categoria?.data?.attributes
                        ?.nombre || "Sin categoría"}
                    </h2>
                    <h1 className="text-white text-3xl title-font font-medium mb-4">
                      {producto.attributes.nombre}
                    </h1>

                    {/* Carousel de medios */}
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
                      >
                        <CarouselContent>
                          {procesarMedios(producto).map((medio, idx) => (
                            <CarouselItem key={idx}>
                              {medio.tipo === "video" ? (
                                <video
                                  className="lg:w-full h-64 object-cover object-center rounded"
                                  autoPlay
                                  muted
                                  loop
                                >
                                  <source src={medio.url} type="video/mp4" />
                                </video>
                              ) : (
                                <img
                                  alt={producto.attributes.nombre}
                                  className="lg:w-full h-64 object-cover object-center rounded"
                                  src={medio.url}
                                />
                              )}
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    ) : (
                      <div className="h-64 bg-gray-800 rounded flex items-center justify-center">
                        <span className="text-gray-500">
                          Sin imágenes disponibles
                        </span>
                      </div>
                    )}

                    <div className="flex mb-4">
                      <a className="flex-grow text-indigo-400 border-b-2 border-indigo-500 py-2 text-lg px-1">
                        Descripción
                      </a>
                    </div>
                    <p className="leading-relaxed mb-4">
                      {producto.attributes.descripcion}
                    </p>

                    <div className="flex border-t border-gray-800 py-2">
                      <span className="text-gray-500">Categoría</span>
                      <span className="ml-auto text-white">
                        {producto.attributes.categoria?.data?.attributes
                          ?.nombre || "Sin categoría"}
                      </span>
                    </div>
                    <div className="flex border-t border-gray-800 py-2">
                      <span className="text-gray-500">Subcategoría</span>
                      <span className="ml-auto text-white">
                        {producto.attributes.subcategoria?.data?.attributes
                          ?.nombre || "Sin subcategoría"}
                      </span>
                    </div>
                    <div className="flex border-t border-b mb-6 border-gray-800 py-2">
                      <span className="text-gray-500">Unidad</span>
                      <span className="ml-auto text-white">
                        {producto.attributes.unidadMedida}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="title-font font-medium text-2xl text-white">
                        {formatearPrecio(producto.attributes.precios)}
                      </span>
                    </div>
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

export default GranProducto1;
