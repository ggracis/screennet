// components/admin/PlantillasGaleria.jsx
"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import PantallasLocal from "../PantallasLocal";

const PlantillasGaleria = () => {
  const [plantillas, setPlantillas] = useState([]);

  useEffect(() => {
    const fetchPlantillas = async () => {
      try {
        const response = await fetch("/api/plantillas");
        const data = await response.json();

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

            <div className="relative w-full mb-4 overflow-hidden max-h-[300px]">
              <div className="origin-top-left w-[350%]  transform scale-[0.285]  ">
                <PantallasLocal pantallaId={plantilla.id} preview={true} />
              </div>
            </div>

            <p className="my-4">{plantilla.descripcion || "Sin descripción"}</p>
            <div className="flex justify-center">
              <Link href={`/admin/plantillas/${plantilla.id}`}>
                <Button variant="secondary" className="w-full">
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
