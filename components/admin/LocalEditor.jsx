"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GradientPicker } from "@/components/ui/GradientPicker";
import useAuthStore from "@/stores/useAuthStore";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { InstagramEmbed } from "react-social-media-embed";
import InstagramFeed from "@/components/screen/InstagramFeed";

export function LocalEditor() {
  const [localData, setLocalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = useAuthStore((state) => state.userId);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchLocalData();
    }
  }, [userId]);

  const fetchLocalData = async () => {
    try {
      // Obtener datos del usuario
      const userResponse = await fetch(`/api/users/${userId}`, {
        cache: "no-store",
      });
      if (!userResponse.ok)
        throw new Error("Error al obtener datos del usuario");
      const userData = await userResponse.json();

      if (userData.user.locals && userData.user.locals.length > 0) {
        const localId = userData.user.locals[0].id;

        // Obtener datos del local
        const localResponse = await fetch(`/api/locals/${localId}`, {
          cache: "no-store",
        });
        if (!localResponse.ok)
          throw new Error("Error al obtener datos del local");
        const localData = await localResponse.json();

        setLocalData(localData.local);
      } else {
        throw new Error("No se encontró información del local");
      }
    } catch (error) {
      handleError("No se pudo cargar la información del local", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setLocalData((prevData) => {
      const newData = { ...prevData };
      const fieldParts = field.split(".");

      if (field === "nombre") {
        newData.attributes.nombre = value;
      } else if (fieldParts.length === 1) {
        newData.attributes.opciones[field] = value;
      } else if (fieldParts.length === 2) {
        if (!newData.attributes.opciones[fieldParts[0]]) {
          newData.attributes.opciones[fieldParts[0]] = {};
        }
        newData.attributes.opciones[fieldParts[0]][fieldParts[1]] = value;
      }

      return newData;
    });
  };

  const handleSubmit = async () => {
    try {
      console.log("Datos a enviar:", JSON.stringify(localData, null, 2));

      const response = await fetch(`/api/locals/${localData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            nombre: localData.attributes.nombre,
            opciones: localData.attributes.opciones,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar los datos: ${errorText}`);
      }

      const responseData = await response.json();
      console.log("Respuesta del servidor:", responseData);

      // Actualizar el estado con los datos recibidos
      setLocalData(responseData.data);

      toast({
        title: "Éxito",
        description: "Datos actualizados correctamente",
      });
    } catch (error) {
      handleError("Error al actualizar los datos", error);
    }
  };

  const handleError = (message, error) => {
    console.error("Error:", error);
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return handleError("El archivo no debe superar los 5MB");
      }
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        return handleError(
          "Solo se permiten archivos de imagen (JPEG, PNG, GIF, WEBP)"
        );
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));

      // Subir el logo inmediatamente
      await uploadLogo(file);
    }
  };

  const uploadLogo = async (file) => {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("ref", "api::local.local");
    formData.append("refId", localData.id);
    formData.append("field", "logoURL");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al subir el logo");
      }

      const result = await response.json();
      console.log("Logo subido:", result);

      // Actualizar el estado local con la nueva URL del logo
      setLocalData((prevData) => ({
        ...prevData,
        attributes: {
          ...prevData.attributes,
          logoURL: {
            data: {
              attributes: {
                url: result[0].url,
              },
            },
          },
        },
      }));

      toast({
        title: "Éxito",
        description: "Logo actualizado correctamente",
      });
    } catch (error) {
      handleError("Error al subir el logo", error);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!localData) return <div>No se encontró información del local</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="w-1/2">
          <label className="block mb-2">Nombre del local</label>
          <Input
            value={localData.attributes?.nombre || ""}
            onChange={(e) => handleInputChange("nombre", e.target.value)}
          />
        </div>
        <div className="w-1/2">
          <label className="block mb-2">Dirección</label>
          <Input
            value={localData.attributes?.opciones?.direccion || ""}
            onChange={(e) => handleInputChange("direccion", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {["Marca 1", "Marca 2", "Fondo", "Texto", "Encabezado"].map(
          (field, index) => (
            <div key={index} className="w-1/5">
              <label className="block mb-2">{`Color de ${field}`}</label>
              <GradientPicker
                background={localData.attributes?.opciones?.[field] || ""}
                setBackground={(color) => handleInputChange(field, color)}
              />
            </div>
          )
        )}
      </div>

      <div className="flex items-center space-x-2">
        <div className="w-full">
          <label className="block mb-2">Fuente</label>
          <Input
            value={localData.attributes?.opciones?.fontFamily || ""}
            onChange={(e) => handleInputChange("fontFamily", e.target.value)}
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-6">Redes</h3>
      <div className="flex items-center space-x-2">
        {["whatsapp", "facebook", "instagram", "tiktok", "web"].map(
          (field, index) => (
            <div key={index} className="w-1/5">
              <label className="block mb-2">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <Input
                value={localData.attributes?.opciones?.redes?.[field] || ""}
                onChange={(e) =>
                  handleInputChange(`redes.${field}`, e.target.value)
                }
              />
            </div>
          )
        )}
      </div>

      <div className="flex items-center space-x-2">
        <label className="block mb-2">Logo</label>

        {logoPreview && (
          <Image
            src={logoPreview}
            alt="Logo Preview"
            width={100}
            height={100}
            className="mt-2"
          />
        )}
        {localData.attributes?.logoURL?.data && !logoPreview && (
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${localData.attributes.logoURL.data.attributes.url}`}
            alt="Logo"
            width={100}
            height={100}
            className="mt-2"
          />
        )}

        <Input type="file" onChange={handleLogoChange} accept="image/*" />
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Instagram Feed</h3>
        <InstagramFeed
          username={localData.attributes?.opciones?.redes?.instagram?.replace(
            "@",
            ""
          )}
        />
      </div>

      <Button className="w-full" size="lg" onClick={handleSubmit}>
        Guardar cambios
      </Button>
    </div>
  );
}
