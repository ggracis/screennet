import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useToast } from "@/hooks/use-toast";

const ProductosExportImport = ({ isExporting }) => {
  const { toast } = useToast();

  const fileInputRef = useRef(null);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [importedData, setImportedData] = useState([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [importStats, setImportStats] = useState({ success: 0, failed: 0 });

  // Agregar estado para almacenar las categorías procesadas
  const [categoriasMap, setCategoriasMap] = useState({});
  const [subcategoriasMap, setSubcategoriasMap] = useState({});

  useEffect(() => {
    fetchCategorias();
    fetchSubcategorias();
  }, []);

  // Modificar la función fetchCategorias
  const fetchCategorias = async () => {
    try {
      const response = await fetch("/api/categorias");
      const data = await response.json();
      console.log("Datos completos de categorías:", data);
      setCategorias(data); // Guardar los datos completos
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  // Modificar la función fetchSubcategorias
  const fetchSubcategorias = async () => {
    try {
      const response = await fetch("/api/subcategorias");
      const data = await response.json();
      console.log("Datos completos de subcategorías:", data);
      setSubcategorias(data); // Guardar los datos completos
    } catch (error) {
      console.error("Error al obtener subcategorías:", error);
    }
  };

  const generarTitulosVariantes = (unidad) => {
    switch (unidad) {
      case "Kg.":
        return ["1/4 Kg.", "1/2 Kg.", "1 Kg."];
      case "Unidad":
        return ["C/U", "1/2 Doc.", "1 Doc."];
      case "Porcion":
        return ["Chico", "Mediano", "Grande"];

      default:
        return ["Precio 1", "Precio 2", "Precio 3"];
    }
  };

  const handleExport = async () => {
    try {
      let allProducts = [];
      let page = 1;
      let totalPages = 1;

      while (page <= totalPages) {
        const response = await fetch(
          `/api/productos?page=${page}&pageSize=100`
        );
        console.log(`Fetching page ${page}...`);
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        const data = await response.json();
        allProducts = allProducts.concat(data.data);
        totalPages = data.meta.pagination.pageCount;
        page++;
      }

      console.log("Products fetched:", allProducts.length);
      console.log(allProducts);

      const exportData = allProducts.map((product) => {
        const precios = product.attributes.precios || {};
        const fotoData = product.attributes.foto?.data;
        const unidadMedida = product.attributes.unidadMedida || "N/A";
        const titulos = generarTitulosVariantes(unidadMedida);

        return {
          Nombre: product.attributes.nombre || "N/A",
          Descripción: product.attributes.descripcion || "N/A",
          "Unidad de Medida": unidadMedida,
          "Precio 1": precios[titulos[0]] || "N/A",
          "Precio 2": precios[titulos[1]] || "N/A",
          "Precio 3": precios[titulos[2]] || "N/A",
          Categoría:
            product.attributes.categoria?.data?.attributes?.nombre || "N/A",
          Subcategoría:
            product.attributes.subcategoria?.data?.attributes?.nombre || "N/A",
          Foto: fotoData && fotoData[0] ? fotoData[0].attributes.url : "N/A",
        };
      });

      console.log("Exporting products:", exportData);

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const dataBlob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(dataBlob, "productos.xlsx");
    } catch (error) {
      console.error("Error exporting products:", error);
    }
  };

  const handleImport = async (event) => {
    console.log("Importing file...");
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log("Imported data:", jsonData);
      setImportedData(jsonData);
      setIsPreviewVisible(true);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleConfirmImport = async () => {
    await importProducts(importedData);
    setIsPreviewVisible(false);
  };

  // const deleteAllProducts = async () => {
  //   try {
  //     const response = await fetch(`/api/productos`, {
  //       method: "DELETE",
  //     });
  //     if (!response.ok) {
  //       throw new Error("Error al eliminar todos los productos");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting all products:", error);
  //   }
  // };

  // Modificar la función importProducts
  const importProducts = async (products) => {
    console.log("=== INICIO IMPORTACIÓN DE PRODUCTOS ===");
    console.log("Categorías disponibles:", categorias);
    console.log("Subcategorías disponibles:", subcategorias);
    let successCount = 0;
    let failedCount = 0;

    for (const product of products) {
      try {
        // Buscar categoría y subcategoría
        const categoriaEncontrada = categorias?.find(
          (cat) => cat.attributes.nombre === product.Categoría
        );
        const subcategoriaEncontrada = subcategorias?.find(
          (subcat) => subcat.attributes.nombre === product.Subcategoría
        );

        console.log("Buscando categoría:", product.Categoría);
        console.log("Categoría encontrada:", categoriaEncontrada);

        const titulos = generarTitulosVariantes(product["Unidad de Medida"]);
        const precios = {};

        // Solo agregar precios si tienen valor
        if (product["Precio 1"])
          precios[titulos[0]] = product["Precio 1"].toString();
        if (product["Precio 2"])
          precios[titulos[1]] = product["Precio 2"].toString();
        if (product["Precio 3"])
          precios[titulos[2]] = product["Precio 3"].toString();

        const newProduct = {
          data: {
            nombre: product.Nombre,
            descripcion: product.Descripción || "",
            unidadMedida: product["Unidad de Medida"],
            precios,
            ...(categoriaEncontrada && {
              categoria: { id: categoriaEncontrada.id },
            }),
            ...(subcategoriaEncontrada && {
              subcategoria: { id: subcategoriaEncontrada.id },
            }),
          },
        };

        console.log(
          "Datos del producto a importar:",
          JSON.stringify(newProduct, null, 2)
        );

        const response = await fetch("/api/productos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProduct),
        });

        const responseData = await response.json();

        if (response.ok) {
          successCount++;
        } else {
          failedCount++;
          console.error("Error importando producto:", responseData);
        }
      } catch (error) {
        failedCount++;
        console.error("Error importando producto:", error);
        console.error("Detalles del error:", {
          mensaje: error.message,
          producto: product,
        });
      }
    }

    setImportStats({ success: successCount, failed: failedCount });
    toast({
      title: "Importación completada",
      description: `Se importaron ${successCount} productos correctamente${
        failedCount > 0 ? ` (${failedCount} fallidos)` : ""
      }`,
    });

    console.log("=== FIN IMPORTACIÓN DE PRODUCTOS ===");
    console.log(`Productos importados: ${successCount}`);
    console.log(`Productos fallidos: ${failedCount}`);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-4">
        <Button
          onClick={handleExport}
          variant="outline"
          size="sm"
          disabled={isExporting}
        >
          {isExporting ? "Exportando..." : "Exportar Productos"}
        </Button>
        <input
          type="file"
          accept=".xlsx"
          onChange={handleImport}
          style={{ display: "none" }}
          ref={fileInputRef}
          id="import-file"
        />
        <label htmlFor="import-file">
          <Button
            as="span"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current.click()}
          >
            Importar Productos
          </Button>
        </label>
      </div>

      <Dialog open={isPreviewVisible} onOpenChange={setIsPreviewVisible}>
        <DialogContent className="w-auto min-w-[50vw] max-w-[95vw]">
          <DialogHeader>
            <DialogTitle>Vista previa de importación</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto max-h-[70vh]">
            <table className="w-fit">
              <thead>
                <tr>
                  <th className="py-1 px-1 border-b">Nombre</th>
                  <th className="py-1 px-2 border-b">Descripción</th>
                  <th className="py-1 px-2 border-b">Unidad de Medida</th>
                  {["Precio 1", "Precio 2", "Precio 3"].map((titulo) => (
                    <th key={titulo} className="py-1 px-2 border-b">
                      {titulo}
                    </th>
                  ))}
                  <th className="py-1 px-2 border-b">Categoría</th>
                  <th className="py-1 px-2 border-b">Subcategoría</th>
                </tr>
              </thead>
              <tbody>
                {importedData.map((product, index) => (
                  <tr key={index}>
                    <td className="py-1 px-2 border-b">{product.Nombre}</td>
                    <td className="py-1 px-2 border-b">
                      {product.Descripción}
                    </td>
                    <td className="py-1 px-2 border-b">
                      {product["Unidad de Medida"]}
                    </td>
                    <td className="py-1 px-2 border-b">
                      {product["Precio 1"]}
                    </td>
                    <td className="py-1 px-2 border-b">
                      {product["Precio 2"]}
                    </td>
                    <td className="py-1 px-2 border-b">
                      {product["Precio 3"]}
                    </td>
                    <td className="py-1 px-2 border-b">{product.Categoría}</td>
                    <td className="py-1 px-2 border-b">
                      {product.Subcategoría}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <div className="flex w-full justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {importStats.success > 0 || importStats.failed > 0 ? (
                  <span>
                    Última importación: {importStats.success} exitosos,{" "}
                    {importStats.failed} fallidos
                  </span>
                ) : null}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsPreviewVisible(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleConfirmImport}>
                  Confirmar Importación
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductosExportImport;
