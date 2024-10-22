// components/admin/PlantillasGaleria.jsx
"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

const PlantillasGaleria = () => {
  const [plantillas, setPlantillas] = useState([]);

  useEffect(() => {
    const fetchPlantillas = async () => {
      try {
        const response = await fetch("/api/plantillas");
        const data = await response.json();

        // Verifica que data sea un array
        if (Array.isArray(data)) {
          setPlantillas(data);
        } else {
          console.error("La respuesta no es un array:", data);
        }
      } catch (error) {
        console.error("Error al obtener las plantillas:", error);
      }
    };
    fetchPlantillas();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {Array.isArray(plantillas) && plantillas.length > 0 ? (
        plantillas.map((plantilla) => (
          <div
            key={plantilla.id}
            className="border rounded-lg p-4 shadow-lg bg-gray-500/[.06]"
          >
            <h3 className="font-bold mb-2">Plantilla: {plantilla.nombre}</h3>
            {plantilla.imagen && (
              <Image
                width={300}
                height={100}
                src={plantilla.imagen}
                alt={plantilla.nombre}
                className="w-full h-auto rounded"
              />
            )}
            <p className="my-4">{plantilla.descripcion || "Sin descripción"}</p>
            <div className="flex justify-center">
              <Link href={`/admin/plantillas/${plantilla.id}`}>
                <Button
                  variant="secondary"
                  className="w-full text-white px-4 py-2 rounded"
                >
                  Personalizar
                </Button>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p>No hay plantillas disponibles.</p>
      )}
    </div>
  );
};

export default PlantillasGaleria;
