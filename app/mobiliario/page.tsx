// app/mobiliario/page.tsx
import Image from "next/image";
import InnerNavbar from "@/components/layout/InnerNavbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/mobiliario/ProductGrid";

export default function MobiliarioPage() {
  // Repetimos el texto suficientes veces para llenar la pantalla en monitores muy anchos
  const repeatedText = Array(15).fill("estudioepico.com");

  return (
    <main className="w-full bg-background min-h-screen flex flex-col">
      {/* Inyectamos la animación CSS aquí mismo.
        Va desde -50% hasta 0% para lograr el efecto "de izquierda a derecha".
      */}
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

      {/* Navegación Interna */}
      <InnerNavbar />

      {/* 1. Sección Hero (Sofá) 
          CAMBIO CLAVE: Usamos h-[100dvh] para que cubra exactamente 
          toda la pantalla en móviles y desktop. 
      */}
      <section className="relative w-full h-[100dvh] overflow-hidden">
        {/* 1. IMAGEN DESKTOP / TABLET (Se oculta en móviles) */}
        <Image
          src="/epicoheromobiliario.png"
          alt="Mobiliario ēpico"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center hidden md:block"
        />

        {/* 2. IMAGEN MOBILE (Se oculta en tablet/desktop) */}
        <Image
          src="/epicoheromobiliariomobile.png"
          alt="Mobiliario ēpico Mobile"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center md:hidden"
        />

        {/* Franja Azul Animada - Cambiamos py por alto fijo (h-8 y md:h-10) */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 overflow-hidden bg-[#1A00FF] z-10 pointer-events-none flex items-center h-5 ">
          <div className="animate-marquee-lr items-center">
            {/* Bloque 1 */}
            <div className="flex items-center gap-8 md:gap-16 pr-8 md:pr-16 shrink-0 h-full">
              {repeatedText.map((text, i) => (
                <span
                  key={`a-${i}`}
                  // Agregamos uppercase, leading-none y mt-[2px] para centrado óptico
                  className="text-white text-[10px] md:text-[15px] font-semibold leading-none "
                >
                  {text}
                </span>
              ))}
            </div>

            {/* Bloque 2 (Clon exacto del Bloque 1) */}
            <div className="flex items-center gap-8 md:gap-16 pr-8 md:pr-16 shrink-0 h-full">
              {repeatedText.map((text, i) => (
                <span
                  key={`b-${i}`}
                  className="text-white text-[10px] md:text-[15px] font-semibold  leading-none "
                >
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProductGrid />
      <Footer />
    </main>
  );
}
