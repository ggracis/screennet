"use client";
import { Card, CardContent } from "@/components/ui/card";

function Encabezado({ tituloEncabezado, bajadaEncabezado }) {
  return (
    <Card className="text-center my-4 mx-auto p-4">
      <CardContent>
        <h1 className="text-green-500 text-2xl font-bold leading-tall tracking-wide">
          {tituloEncabezado}
        </h1>
        <h2 className="text-lg font-medium">{bajadaEncabezado}</h2>
      </CardContent>
    </Card>
  );
}

export default Encabezado;
