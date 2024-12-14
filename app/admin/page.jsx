import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export default function Component() {
  return (
    <main>
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              👋 ¡Bienvenido a ScreenNet!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-6">
              ¿Listo para que tus pantallas brillen? ✨ Seguí estos simples
              pasos:
            </p>

            <div className="space-y-4">
              {/* Paso 1 */}
              <div className="flex items-center gap-4">
                <span className="text-2xl">🛒</span>
                <div className="flex-1">
                  <p className="font-semibold">1. Cargá tus productos</p>
                  <p className="text-sm text-gray-500">
                    Agregá promos, precios y descripciones para mostrar en tus
                    pantallas.
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <a href="/admin/productos">
                    Ir a Productos <ChevronRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>

              {/* Paso 2 */}
              <div className="flex items-center gap-4">
                <span className="text-2xl">🎨</span>
                <div className="flex-1">
                  <p className="font-semibold">2. Diseñá una plantilla</p>
                  <p className="text-sm text-gray-500">
                    Personalizá cabeceras, columnas, videos y más para tus
                    pantallas.
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <a href="/admin/plantillas">
                    Ir a Plantillas <ChevronRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>

              {/* Paso 3 */}
              <div className="flex items-center gap-4">
                <span className="text-2xl">📺</span>
                <div className="flex-1">
                  <p className="font-semibold">3. Asigná una pantalla</p>
                  <p className="text-sm text-gray-500">
                    Elegí qué televisor de qué local mostrará tu contenido.
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <a href="/admin/pantallas">
                    Ir a Pantallas <ChevronRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <p className="mt-6 text-lg font-semibold">
              ¡Y listo! Tu contenido estará listo para brillar en todas tus
              pantallas. 🚀
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
