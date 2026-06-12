import { Metadata } from "next";
import Image from "next/image";
import InnerNavbar from "@/components/layout/InnerNavbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/mobiliario/ProductGrid";
import CategoryNav from "@/components/mobiliario/CategoryNav";

export const metadata: Metadata = {
  title: "Mobiliario de Diseño",
  description:
    "Explora nuestro catálogo de mobiliario de diseño atemporal hecho a medida. Camas, comedores, sofás y piezas auténticas creadas por Estudio ēpico.",
};

export const revalidate = 60;

type PageProps = {
  searchParams: Promise<{ categoria?: string }>;
};

export default async function MobiliarioPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const categoriaActiva = resolvedSearchParams.categoria || "Todos";

  const repeatedText = Array(15).fill("estudioepico.com");

  return (
    <main className="w-full bg-background min-h-screen flex flex-col selection:bg-[#1A00FF] selection:text-white">
      <style>{`
        @keyframes marqueeLeftToRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-lr {
          display: flex;
          width: max-content;
          animation: marqueeLeftToRight 30s linear infinite;
        }
      `}</style>

      <InnerNavbar theme="light" />

      {/* 1. SECCIÓN HERO */}
      <section className="relative w-full h-[100dvh] overflow-hidden bg-[#FAFAF9]">
        <Image
          src="/epicoheromobiliario.png"
          alt="Mobiliario de diseño Estudio ēpico"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center hidden md:block"
        />

        <Image
          src="/epicoheromobiliariomobile.png"
          alt="Mobiliario de diseño Estudio ēpico Mobile"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center md:hidden"
        />

        {/* Franja Azul Animada */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 overflow-hidden bg-[#1A00FF] z-10 pointer-events-none flex items-center h-5">
          <div className="animate-marquee-lr items-center">
            <div className="flex items-center gap-8 md:gap-16 pr-8 md:pr-16 shrink-0 h-full">
              {repeatedText.map((text, i) => (
                <span
                  key={`a-${i}`}
                  className="text-white text-[10px] md:text-[15px] font-semibold leading-none"
                >
                  {text}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-8 md:gap-16 pr-8 md:pr-16 shrink-0 h-full">
              {repeatedText.map((text, i) => (
                <span
                  key={`b-${i}`}
                  className="text-white text-[10px] md:text-[15px] font-semibold leading-none"
                >
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. MENÚ DE CATEGORÍAS (Barra Arrastrable) */}
      <CategoryNav />

      {/* 3. GRILLA DE PRODUCTOS - Eliminado el py-12 redundante */}
      <div className="flex-grow bg-background">
        <ProductGrid categoria={categoriaActiva} />
      </div>

      <Footer />
    </main>
  );
}
