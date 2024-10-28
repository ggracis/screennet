import { useEffect, useState } from "react";
import useProductStore from "@/stores/useProductStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Componente1 = ({ productos, titulo }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { products, setProducts, addProduct } = useProductStore();

  useEffect(() => {
    const fetchMissingProducts = async () => {
      setLoading(true);
      try {
        const missingProducts = productos.filter(
          (id) => !products.some((p) => p.id === id)
        );

        if (missingProducts.length > 0) {
          const newProducts = await Promise.all(
            missingProducts.map(async (id) => {
              const response = await fetch(`/api/productos/${id}`);
              if (!response.ok) throw new Error(`Error fetching product ${id}`);
              const data = await response.json();
              return {
                id: data.data.id,
                nombre: data.data.attributes.nombre,
                descripcion: data.data.attributes.descripcion,
                unidadMedida: data.data.attributes.unidadMedida,
                precios: data.data.attributes.precios,
                categoria: data.data.attributes.categoria,
                subcategoria: data.data.attributes.subcategoria,
                activo: data.data.attributes.activo,
                foto: data.data.attributes.foto,
              };
            })
          );

          newProducts.forEach((product) => addProduct(product));
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMissingProducts();
  }, [productos, products, addProduct]);

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

  const displayProducts = products.filter((p) => productos.includes(p.id));

  return (
    <Card className="w-full h-full shadow-lg bg-gray-800/[.60]">
      <CardHeader className="m-0 pt-4 text-center">
        <CardTitle>{titulo}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {displayProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.nombre}</TableCell>
                <TableCell>
                  {Object.entries(product.precios || {})
                    .filter(([_, precio]) => precio) // Solo incluir precios que existen
                    .map(([titulo, precio], index, arr) => (
                      <span key={titulo}>
                        <span className="font-bold">{titulo}: </span>${precio}
                        <br />
                      </span>
                    ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Componente1;
