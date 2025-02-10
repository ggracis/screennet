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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlantillas = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/plantillas");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Formato de respuesta inválido");
        }

        setPlantillas(data);
      } catch (error) {
        console.error("Error al obtener las plantillas:", error);
        setError(error.message);
        toast({
          title: "Error",
          description: "No se pudieron cargar las plantillas",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlantillas();
  }, [toast]);

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

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="border rounded-lg p-4 animate-pulse bg-gray-100 h-[400px]"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {plantillas.length > 0 ? (
        plantillas.map((plantilla) => (
          <div
            key={plantilla.id}
            className="border rounded-lg p-4 shadow-lg bg-gray-500/[.06] hover:shadow-xl transition-shadow"
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
        <div className="col-span-full text-center p-4">
          No hay plantillas disponibles.
        </div>
      )}
    </div>
  );
};

export default PlantillasGaleria;
