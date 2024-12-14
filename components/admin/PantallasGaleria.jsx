// components/admin/PantallasGaleria.jsx
"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import PantallasLocal from "../PantallasLocal";

const PantallasGaleria = () => {
  const [pantallas, setPantallas] = useState([]);

  useEffect(() => {
    const fetchPlantillas = async () => {
      try {
        const response = await fetch("/api/pantallas");
        const data = await response.json();

        // Verifica que data sea un array
        if (Array.isArray(data)) {
          setPantallas(data);
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
      {Array.isArray(pantallas) && pantallas.length > 0 ? (
        pantallas.map((pantalla) => (
          <div
            key={pantalla.id}
            className="border rounded-lg p-4 shadow-lg bg-gray-500/[.06]"
          >
            <h3 className="font-bold mb-2">Pantalla: {pantalla.nombre}</h3>
            <p>Local: {pantalla.local}</p>
            <p>{pantalla.descripcion}</p>

            <div className="relative w-full overflow-hidden max-h-[280px]">
              <div className="origin-top-left w-[350%]  transform scale-[0.285]  ">
                <PantallasLocal pantallaId={pantalla.id} preview={true} />
              </div>
            </div>
            <div className="flex justify-center gap-2">
              <Link
                className="flex justify-center"
                href={`/pantalla/${pantalla.id}`}
                target="_blank"
              >
                <Button variant="outline">Ver</Button>
              </Link>
              <Link
                className=" flex justify-center"
                href={`/admin/pantallas/${pantalla.id}`}
              >
                <Button variant="secondary">Editar</Button>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p>No hay pantallas disponibles</p>
      )}
    </div>
  );
};

export default PantallasGaleria;
