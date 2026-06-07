// app/page.tsx
import HeroScroll from "@/components/layout/HeroScroll";
import Preloader from "@/components/ui/Preloader";

export default function Home() {
  // === DATOS ESTRUCTURADOS PARA SEO LOCAL ===
  // Esto le dice a Google que son un negocio físico en Medellín
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["FurnitureStore", "LocalBusiness"],
    name: "Estudio ēpico",
    image: "https://estudioepico.com/epicohero.png",
    "@id": "https://estudioepico.com",
    url: "https://estudioepico.com",
    telephone: "+573242548059",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Medellín",
      addressRegion: "Antioquia",
      addressCountry: "CO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 6.2442, // Coordenadas de Medellín
      longitude: -75.5812,
    },
    sameAs: ["https://www.instagram.com/estudioepico/"],
    description:
      "Estudio de mobiliario y diseño de interiores en Medellín, Colombia. Creamos objetos auténticos a la medida.",
  };

  return (
    <main className="w-full relative bg-background">
      {/* INYECTAMOS EL SEO INVISIBLE PARA GOOGLE */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Nuestro telón de entrada elegante */}
      <Preloader />

      {/* 2. Secuencia de Introducción Animada */}
      <HeroScroll />
    </main>
  );
}
