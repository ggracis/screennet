import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ProductProvider } from "@/contexts/ProductContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "SCREEN.NET",
  description:
    "¡Hazlo más fácil y poderoso con SCREENET! Gestiona y personaliza las pantallas de tu negocio desde un solo lugar.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProductProvider>{children}</ProductProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
