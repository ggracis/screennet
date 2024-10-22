"use client";
import {
  Moon,
  Sun,
  Layout,
  ShoppingCart,
  MapPin,
  Monitor,
  Sliders,
  LogOut,
  Tags,
  BrushIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";

export default function Navbar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const { setTheme, theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside
      className={`transition-all duration-300 ease-in-out bg-muted/40 border-r flex flex-col 
      w-20 h-screen pr-2 ${isSidebarOpen ? "md:w-40" : "md:w-20"} `}
    >
      {/* Navbar para móviles */}
      <div className="flex justify-between items-center p-4 md:hidden">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          <Layout className="h-6 w-6" />
        </Button>
      </div>

      {/* Sidebar para dispositivos móviles */}
      {isSidebarOpen && (
        <nav className="fixed top-0 left-0 w-50 h-full bg-muted/90 shadow-lg p-4 md:hidden z-50">
          <div className="flex justify-end mb-4 h-5 w-5">
            <Button variant="outline" size="icon" onClick={toggleSidebar}>
              <Layout className="h-6 w-6" />
            </Button>
          </div>
          <div className="space-y-4">
            <Button variant="ghost" className="flex items-center w-full">
              <Tags className="h-5 w-5" />
              <span className="ml-2">Productos</span>
            </Button>
            <Button variant="ghost" className="flex items-center w-full">
              <MapPin className="h-5 w-5" />
              <span className="ml-2">Locales</span>
            </Button>
            <Button variant="ghost" className="flex items-center w-full">
              <Monitor className="h-5 w-5" />
              <span className="ml-2">Pantallas</span>
            </Button>
            <Button variant="ghost" className="flex items-center w-full">
              <BrushIcon className="h-5 w-5" />
              <span className="ml-2">Plantillas</span>
            </Button>
            <Button variant="ghost" className="flex items-center w-full">
              <Sliders className="h-5 w-5" />
              <span className="ml-2">Preferencias</span>
            </Button>
          </div>
          <Separator className="my-4" />
          <Button
            variant="ghost"
            className="flex items-center w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-2">Cerrar sesión</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Toggle
              className="w-full"
              aria-label="Toggle dark mode"
              pressed={theme === "dark"}
              onPressedChange={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-5 w-5" />
                  <span className="ml-2">Modo claro</span>
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5" />
                  <span className="ml-2">Modo oscuro</span>
                </>
              )}
            </Toggle>
          </div>
        </nav>
      )}

      {/* Navbar para escritorio */}
      <div className="hidden md:flex flex-col p-4 space-y-4 fixed ">
        <Button
          className="ml-1"
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
        >
          <Layout className="h-5 w-5" />
        </Button>
        <nav className="space-y-4 gap-4 ">
          <Link href="/admin/productos">
            <Button
              variant={
                isMounted && pathname === "/admin/productos"
                  ? "outline"
                  : "ghost"
              }
              className="flex items-center w-full justify-start my-2"
              title="Productos"
            >
              <Tags className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-2">Productos</span>}
            </Button>
          </Link>

          <Link href="/admin/locales">
            <Button
              variant={
                isMounted && pathname === "/admin/locales" ? "outline" : "ghost"
              }
              className="flex items-center w-full justify-start my-2"
              title="Locales"
            >
              <MapPin className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-2">Locales</span>}
            </Button>
          </Link>

          <Link href="/admin/pantallas">
            <Button
              variant={
                isMounted && pathname === "/admin/pantallas"
                  ? "outline"
                  : "ghost"
              }
              className="flex items-center w-full justify-start my-2"
              title="Pantallas"
            >
              <Monitor className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-2">Pantallas</span>}
            </Button>
          </Link>

          <Link href="/admin/plantillas">
            <Button
              variant={
                isMounted && pathname === "/admin/plantillas"
                  ? "outline"
                  : "ghost"
              }
              className="flex items-center w-full justify-start my-2"
              title="Plantillas"
            >
              <BrushIcon className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-2">Plantillas</span>}
            </Button>
          </Link>

          <Link href="/admin/preferencias">
            <Button
              variant={
                isMounted && pathname === "/admin/preferencias"
                  ? "outline"
                  : "ghost"
              }
              className="flex items-center w-full justify-start my-2"
              title="Preferencias"
            >
              <Sliders className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-2">Preferencias</span>}
            </Button>
          </Link>
        </nav>
        <Separator className="my-4" />
        <Toggle
          aria-label="Toggle dark mode"
          pressed={theme === "dark"}
          onPressedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-2">Modo claro</span>}
            </>
          ) : (
            <>
              <Moon className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-2">Modo oscuro</span>}
            </>
          )}
        </Toggle>
        <Button
          variant="ghost"
          className="flex items-center w-full justify-start my-2"
          onClick={handleLogout}
          title="Cerrar sesión"
        >
          <LogOut className="h-5 w-5" />
          {isSidebarOpen && <span className="ml-2">Cerrar sesión</span>}
        </Button>
      </div>
    </aside>
  );
}
