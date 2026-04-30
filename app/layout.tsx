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

export const metadata: Metadata = {
  title: "ēpico | Objetos Auténticos",
  description:
    "Estudio de mobiliario y diseño de interiores. Medellín, Colombia.",
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
