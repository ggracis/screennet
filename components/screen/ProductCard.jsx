import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";

const ROTATION_TIME = 10000;

export function ProductCard({
  loading,
  error,
  title,
  children,
  itemsPerPage = 5,
}) {
  const [api, setApi] = useState(null);
  const childrenArray =
    React.Children.toArray(children)[0]?.props?.children || [];
  const totalPages = Math.ceil(childrenArray.length / itemsPerPage);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, ROTATION_TIME);

    return () => clearInterval(interval);
  }, [api]);

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
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error cargando productos: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const productGroups = [];
  for (let i = 0; i < childrenArray.length; i += itemsPerPage) {
    productGroups.push(childrenArray.slice(i, i + itemsPerPage));
  }

  return (
    <Card className="w-full h-full flex flex-col shadow-lg bg-gray-800/10">
      <CardHeader className="flex-none py-1 text-center">
        <CardTitle className="text-nowrap text-2xl titulo text-center uppercase font-normal mt-0 mb-2 ">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <Carousel
          className="h-full"
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setApi}
        >
          <CarouselContent>
            {productGroups.map((group, index) => (
              <CarouselItem key={index} className="basis-full">
                <div className="grid grid-cols-1 gap-2">{group}</div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </CardContent>
    </Card>
  );
}
