// components/admin/PlantillasGaleria.jsx
"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import PlantillasPreview from "./PlantillasPreview";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PlantillasGaleria = () => {
  const { toast } = useToast();
  const [plantillas, setPlantillas] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };
    fetchPlantillas();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/plantillas/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la plantilla");
      }

      setPlantillas(plantillas.filter((plantilla) => plantilla.id !== id));

      toast({
        title: "Éxito",
        description: "Plantilla eliminada correctamente",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la plantilla",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Cargando plantillas...</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {plantillas.length > 0 ? (
        plantillas.map((plantilla) => (
          <div
            key={plantilla.id}
            className="border rounded-lg p-4 shadow-lg bg-gray-500/[.06] "
          >
            <h3 className="font-bold mb-2">
              Plantilla: {plantilla.nombre || "Sin nombre"}
            </h3>

            <div
              className="relative w-full m-0 overflow-hidden margin-auto rounded-lg "
              style={{ height: "280px" }}
            >
              <div className="origin-top-left w-[350%] transform scale-[0.285]">
                <PlantillasPreview plantillaId={plantilla.id} />
              </div>
            </div>

            <p className="mb-2">{plantilla.descripcion || "Sin descripción"}</p>
            <div className="flex justify-between gap-2 ">
              <Link
                href={`/admin/plantillas/${plantilla.id}`}
                className="flex-1"
              >
                <Button variant="secondary" className="w-full">
                  Personalizar
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Eliminar</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminará
                      permanentemente la plantilla.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(plantilla.id)}
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
