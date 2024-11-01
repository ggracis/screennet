"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";

const PantallasEditor = () => {
  const { toast } = useToast();

  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [pantalla, setPantalla] = useState(null);
  const [plantillas, setPlantillas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [defaultPlantilla, setDefaultPlantilla] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // Obtener datos de la pantalla
      const pantallaResponse = await fetch(`/api/pantallas/${id}`);
      const pantallaData = await pantallaResponse.json();
      setPantalla(pantallaData.pantalla);

      // Obtener plantillas disponibles
      const plantillasResponse = await fetch("/api/plantillas");
      const plantillasData = await plantillasResponse.json();
      setPlantillas(plantillasData);
      // console.log(plantillasData);

      // Configurar horarios existentes
      if (pantallaData.pantalla.attributes.plantilla_horario) {
        const horariosExistentes = Object.entries(
          pantallaData.pantalla.attributes.plantilla_horario
        )
          .filter(([key]) => key !== "default")
          .map(([_, value]) => ({
            plantilla: value.plantilla.toString(),
            dias: value.dias,
            horaInicio: value.horas[0],
            horaFin: value.horas[1],
          }));
        setHorarios(horariosExistentes);
        setDefaultPlantilla(
          pantallaData.pantalla.attributes.plantilla_horario.default.plantilla.toString()
        );
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleAddHorario = () => {
    setHorarios([
      ...horarios,
      { plantilla: "", dias: [], horaInicio: "00:00", horaFin: "23:59" },
    ]);
  };

  const handleHorarioChange = (index, field, value) => {
    const newHorarios = [...horarios];
    newHorarios[index][field] = value;
    setHorarios(newHorarios);
  };

  const handleRemoveHorario = (index) => {
    const newHorarios = horarios.filter((_, i) => i !== index);
    setHorarios(newHorarios);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (verificarSuperposicion()) {
      toast({
        title: "Error",
        description:
          "Hay superposición en los horarios. Por favor, revise los rangos de tiempo.",
        variant: "destructive",
      });

      return;
    }

    if (horarios.some((horario) => horario.dias.length === 0)) {
      toast({
        title: "Error",
        description:
          "Todos los horarios deben tener al menos un día seleccionado.",
        variant: "destructive",
      });
      return;
    }
    const plantillaHorario = {
      default: { plantilla: parseInt(defaultPlantilla) },
      ...horarios.reduce((acc, horario, index) => {
        acc[index + 1] = {
          plantilla: parseInt(horario.plantilla),
          dias: horario.dias,
          horas: [horario.horaInicio, horario.horaFin],
        };
        return acc;
      }, {}),
    };

    const body = {
      data: {
        nombre: pantalla.attributes.nombre,
        descripcion: pantalla.attributes.descripcion,
        plantilla_horario: plantillaHorario,
      },
    };

    const response = await fetch(`/api/pantallas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      router.push("/admin/pantallas");
    } else {
      console.error("Error al actualizar la pantalla");
    }
  };

  const verificarSuperposicion = () => {
    for (let i = 0; i < horarios.length; i++) {
      for (let j = i + 1; j < horarios.length; j++) {
        const horarioA = horarios[i];
        const horarioB = horarios[j];

        // Verificar si hay días en común
        const diasComunes = horarioA.dias.filter((dia) =>
          horarioB.dias.includes(dia)
        );

        if (diasComunes.length > 0) {
          // Verificar superposición de horas
          if (
            (horarioA.horaInicio <= horarioB.horaFin &&
              horarioA.horaFin >= horarioB.horaInicio) ||
            (horarioB.horaInicio <= horarioA.horaFin &&
              horarioB.horaFin >= horarioA.horaInicio)
          ) {
            return true; // Hay superposición
          }
        }
      }
    }
    return false; // No hay superposición
  };

  if (!pantalla) return <div>Cargando...</div>;

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Editar Pantalla</h2>

      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          value={pantalla.attributes.nombre}
          onChange={(e) =>
            setPantalla({
              ...pantalla,
              attributes: { ...pantalla.attributes, nombre: e.target.value },
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          value={pantalla.attributes.descripcion}
          onChange={(e) =>
            setPantalla({
              ...pantalla,
              attributes: {
                ...pantalla.attributes,
                descripcion: e.target.value,
              },
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="defaultPlantilla">Plantilla por defecto</Label>
        <Select onValueChange={setDefaultPlantilla} value={defaultPlantilla}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar plantilla por defecto" />
          </SelectTrigger>
          <SelectContent>
            {plantillas.map((plantilla) => (
              <SelectItem key={plantilla.id} value={plantilla.id.toString()}>
                {plantilla.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <h3 className="text-xl font-semibold">Plantillas por horario</h3>
      {horarios.map((horario, index) => (
        <div key={index} className="border p-4 rounded space-y-4">
          <Select
            onValueChange={(value) =>
              handleHorarioChange(index, "plantilla", value)
            }
            value={horario.plantilla}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar plantilla" />
            </SelectTrigger>
            <SelectContent>
              {plantillas.map((plantilla) => (
                <SelectItem key={plantilla.id} value={plantilla.id.toString()}>
                  {plantilla.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-7 gap-2">
            {["D", "L", "M", "X", "J", "V", "S"].map((dia, diaIndex) => (
              <div key={dia} className="flex items-center space-x-2">
                <Checkbox
                  id={`${dia}-${index}`}
                  checked={horario.dias.includes(diaIndex.toString())}
                  onCheckedChange={(checked) => {
                    const newDias = checked
                      ? [...horario.dias, diaIndex.toString()]
                      : horario.dias.filter((d) => d !== diaIndex.toString());
                    handleHorarioChange(index, "dias", newDias);
                  }}
                />
                <Label htmlFor={`${dia}-${index}`}>{dia}</Label>
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <Label>Hora de inicio</Label>
              <Input
                type="time"
                value={horario.horaInicio}
                onChange={(e) =>
                  handleHorarioChange(index, "horaInicio", e.target.value)
                }
              />
            </div>
            <div className="flex-1">
              <Label>Hora de fin</Label>
              <Input
                type="time"
                value={horario.horaFin}
                onChange={(e) =>
                  handleHorarioChange(index, "horaFin", e.target.value)
                }
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => handleRemoveHorario(index)}
              variant="destructive"
            >
              Quitar Horario
            </Button>
          </div>
        </div>
      ))}

      <Button type="button" onClick={handleAddHorario} variant="outline">
        Agregar Horario
      </Button>

      <Button type="submit">Guardar Cambios</Button>
    </form>
  );
};

export default PantallasEditor;
