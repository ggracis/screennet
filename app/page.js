"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";

import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Producto", href: "#Producto" },
  { name: "Características", href: "#Caracteristicas" },
  { name: "Reseñas", href: "#Resenas" },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <div className="font-sans">
      <div className="bg-white pb-7">
        <header className="absolute inset-x-0 top-0 z-50">
          <nav
            aria-label="Global"
            className="flex items-center justify-between p-6 lg:px-8"
          >
            <div className="flex lg:flex-1">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">SCREEN.NET</span>
                <Image
                  width={32}
                  height={32}
                  alt="Screen.net"
                  title="Screen.net"
                  src="/icon.png"
                  className="h-8 w-auto"
                />
              </a>
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm/6 font-semibold text-gray-900"
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <a
                href="./admin"
                className="text-sm/6 font-semibold text-gray-900"
              >
                Iniciar sesión <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </nav>
          <Dialog
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
            className="lg:hidden"
          >
            <div className="fixed inset-0 z-50" />
            <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">SCREEN.NET</span>
                  <Image
                    width={32}
                    height={32}
                    alt="Screen.net"
                    title="Screen.net"
                    src="/icon.png"
                    className="h-8 w-auto"
                  />
                </a>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="py-6">
                    <a
                      href="./admin/"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Iniciar sesión
                    </a>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </Dialog>
        </header>

        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                La cartelería digital nunca fue tan inteligente.{" "}
                <a
                  href="#Caracteristicas"
                  className="font-semibold text-indigo-600"
                >
                  <span aria-hidden="true" className="absolute inset-0" />
                  Leer más <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                SCREEN.NET
                <br />
                La revolución de la cartelería digital
              </h1>
              <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                ¡Hazlo más fácil y poderoso con SCREEN.NET! <br />
                Gestiona y personaliza las pantallas de tu negocio desde un solo
                lugar.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="/contacto"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Prueba gratuita
                </a>
                <a
                  href="#Caracteristicas"
                  className="text-sm/6 font-semibold text-gray-900"
                >
                  Leer más <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            />
          </div>
        </div>
      </div>
      <section className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-4xl mx-auto  bg-gray-100 py-3 mb-7 px-1 rounded-lg shadow-md">
          <h2 id="Producto" className="m-6 text-3xl font-bold text-gray-900">
            SCREEN.NET EN ACCIÓN
          </h2>
          <p className="my-6 text-lg text-gray-800">
            Gestiona y personaliza las pantallas de tu negocio desde un solo
            lugar,
            <br />
            conectá, comunicá y crece con la solución más avanzada del mercado.
          </p>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.play}
            className="max-w-full  lg:mx-12"
          >
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-4xl font-semibold">
                          {index + 1}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden lg:flex" />
            <CarouselNext className="hidden lg:flex" />
          </Carousel>
        </div>
      </section>

      {/* Beneficios */}
      <section
        id="Caracteristicas"
        className="py-12 bg-white px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          ¿QUÉ HACE A SCREEN.NET ÚNICO?
        </h2>
        <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center bg-gray-50 p-6 rounded-lg shadow-md">
            <span className="text-3xl">🎯</span>
            <p className="mt-4 text-gray-800">
              Gestión centralizada: Controla todas las pantallas desde una sola
              plataforma.
            </p>
          </div>
          <div className="text-center bg-gray-50 p-6 rounded-lg shadow-md">
            <span className="text-3xl">🚀</span>
            <p className="mt-4 text-gray-800">
              Contenido automatizado: Genera imágenes y videos con tecnología de
              IA.
            </p>
          </div>
          <div className="text-center bg-gray-50 p-6 rounded-lg shadow-md">
            <span className="text-3xl">📲</span>
            <p className="mt-4 text-gray-800">
              Conexión interactiva: Vincula promociones, menús y sorteos con
              códigos QR.
            </p>
          </div>
          <div className="text-center bg-gray-50 p-6 rounded-lg shadow-md">
            <span className="text-3xl">🌐</span>
            <p className="mt-4 text-gray-800">
              Soporte multiplataforma: Compatible con pantallas, Smart TVs y
              redes sociales.
            </p>
          </div>
        </div>
        <div className="text-center mt-10">
          <a
            href="/contacto"
            className="rounded-md bg-indigo-600 px-3.5 py-3.5  text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Empieza a transformar tu negocio hoy mismo
          </a>
        </div>
      </section>

      {/* Testimonios */}
      <section id="Resenas" className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          EMPRESAS QUE YA CONFÍAN EN SCREEN.NET
        </h2>
        <div className="max-w-6xl mx-auto mt-6 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-800 italic">
              &quot;Desde que usamos SCREEN.NET, hemos mejorado nuestra
              comunicación con los clientes y ahorrado tiempo en la gestión de
              promociones.&quot;
            </p>
            <p className="mt-4 text-gray-600 font-bold">
              — Juan Pérez, Gerente de Tienda Local
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-800 italic">
              &quot;SCREEN.NET nos ha permitido centralizar el contenido de
              nuestras sucursales. Ahora todo se gestiona más rápido y sin
              complicaciones.&quot;
            </p>
            <p className="mt-4 text-gray-600 font-bold">
              — María Gómez, Propietaria
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-800 italic">
              &quot;Con SCREEN.NET, hemos transformado la experiencia de
              nuestros clientes, creando campañas interactivas que conectan con
              ellos.&quot;
            </p>
            <p className="mt-4 text-gray-600 font-bold">
              — Carlos López, Gerente de Marketing
            </p>
          </div>
        </div>
      </section>

      {/* Llamada Final a la Acción */}
      <section className="py-12 bg-indigo-600 text-white text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl mb-10 font-bold">
          Lleva tu cartelería digital al siguiente nivel con SCREEN.NET
        </h2>
        <a
          href="/contacto"
          className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Comenzar ahora
        </a>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-800 text-white text-center px-4 sm:px-6 lg:px-8">
        <p>© 2024 SCREEN.NET. Todos los derechos reservados.</p>
        <div className="mt-4 flex justify-center space-x-6">
          <p>Soporte técnico 24/7</p>
          <a href="/contacto" className="hover:underline">
            Contacto
          </a>
        </div>
      </footer>
    </div>
  );
}
