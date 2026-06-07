// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Cargamos la fuente Neue Montreal con sus respectivos pesos
const neueMontreal = localFont({
  src: [
    {
      path: "./fonts/NeueMontreal-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/NeueMontreal-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  // Inyectamos esto como variable CSS
  variable: "--font-neue-montreal",
  display: "swap", // Evita textos invisibles mientras carga
});

// === CONFIGURACIÓN DE SEO GLOBAL ===
export const metadata: Metadata = {
  metadataBase: new URL("https://estudioepico.com"),
  alternates: {
    canonical: "/", // <--- ESTO EVITA PENALIZACIONES DE CONTENIDO DUPLICADO
  }, // Base para que las imágenes funcionen en redes sociales
  title: {
    default: "Estudio ēpico | Objetos Auténticos",
    template: "%s | Estudio ēpico", // Plantilla automática para las subpáginas
  },
  description:
    "Estudio de mobiliario y diseño de interiores en Medellín, Colombia. Creamos objetos auténticos a la medida.",
  keywords: [
    "mobiliario a la medida",
    "diseño de interiores",
    "arquitectura Medellín",
    "muebles de diseño",
    "estudio épico",
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://estudioepico.com",
    title: "Estudio ēpico | Objetos Auténticos",
    description:
      "Estudio de mobiliario y diseño de interiores en Medellín, Colombia.",
    siteName: "Estudio ēpico",
    images: [
      {
        url: "/epicohero.png", // Imagen por defecto al compartir la web
        width: 1200,
        height: 630,
        alt: "Estudio ēpico Diseño y Mobiliario",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${neueMontreal.variable} font-sans antialiased bg-background text-foreground`}
      >
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
