// app/nosotros/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import InnerNavbar from "@/components/layout/InnerNavbar";

// === SEO TÉCNICO ===
export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Mentes auténticas. Piezas épicas. En Épico queremos lograr un vínculo con el usuario tan único, que se logre hacer tangible su mundo interior.",
  openGraph: {
    title: "Nosotros | Estudio ēpico",
    description: "Conoce el manifiesto y la familia detrás de Estudio ēpico.",
    images: [
      {
        url: "/epiconosotros.jpeg",
        width: 1200,
        height: 630,
        alt: "Equipo de Estudio ēpico",
      },
    ],
  },
};

export default function NosotrosPage() {
  return (
    <main className="w-full min-h-screen bg-[#F6F5F2] text-epico-dark font-sans flex flex-col lg:flex-row relative">
      <InnerNavbar theme="light" />

      {/* COLUMNA IZQUIERDA: FIJA (STICKY) */}
      <section className="relative w-full lg:w-[45%] h-[60vh] lg:h-screen lg:sticky lg:top-0 overflow-hidden flex flex-col justify-end">
        {/* Imagen de fondo */}
        <Image
          src="/epiconosotros.jpeg"
          alt="Dirección creativa de Estudio ēpico"
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center grayscale"
        />
        {/* Gradiente sutil para que el texto sea siempre legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Texto sobre la imagen */}
        <div className="relative z-10 p-8 md:p-12 lg:p-16 w-full text-white">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.1] mb-6">
            Mentes auténticas.
            <br />
            Piezas épicas.
          </h1>
          <p className="text-sm md:text-base font-light text-white/90 leading-relaxed max-w-sm">
            En Épico queremos lograr un vínculo con el usuario tan único, que se
            logre hacer tangible su mundo interior.
          </p>
        </div>
      </section>

      {/* COLUMNA DERECHA: SCROLL CON LA HISTORIA */}
      <section className="w-full lg:w-[55%] flex flex-col px-6 md:px-16 lg:px-24 py-16 lg:py-20 bg-background">
        {/* Bloque: Lo que hacemos */}
        <div className="mb-20 lg:mb-32">
          <h2 className="flex items-center gap-4 text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-10">
            <span className="w-8 h-[1px] bg-gray-300"></span>
            Lo que hacemos
          </h2>

          <div className="space-y-8 pl-0 lg:pl-12">
            <p className="text-2xl md:text-3xl font-medium tracking-tight text-black leading-snug">
              Somos una empresa familiar dedicada principalmente al diseño y
              fabricación de muebles hechos a medida, y al diseño interior de
              espacios.
            </p>
            <p className="text-base text-gray-700 font-light leading-relaxed">
              Combinamos el saber hacer con vínculos memorables para transformar
              ideas, necesidades y detalles en objetos auténticos: piezas
              funcionales, llenas de intención y pensadas para cada espacio.
            </p>
          </div>
        </div>

        {/* Bloque: Quiénes estamos detrás */}
        <div>
          <h2 className="flex items-center gap-4 text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-10">
            <span className="w-8 h-[1px] bg-gray-300"></span>
            Quiénes estamos detrás
          </h2>

          <div className="space-y-12 pl-0 lg:pl-12">
            <div>
              <p className="text-xl md:text-2xl font-medium text-black leading-relaxed mb-4">
                Juanita, diseñadora y encargada del funcionamiento del negocio,
                lidera cada proyecto desde la parte comercial, el diseño, la
                fabricación y la instalación.
              </p>
            </div>

            <div className="space-y-6 text-base text-gray-700 font-light leading-relaxed">
              <p>
                A su lado está su familia: Diego, su papá, como consultor de
                estrategia y operación; David, su hermano mayor, como consultor
                financiero; e Isabela y Juliana, hermana menor y esposa de
                David, quienes apoyan la comunicación visual y las redes
                sociales.
              </p>
              <div className="p-8 bg-[#F6F5F2] border border-gray-200 mt-8 rounded-sm">
                <p className="text-black font-medium leading-relaxed">
                  Aunque cada uno aporta desde su experiencia, las decisiones
                  estratégicas de Épico se construyen en familia, uniendo
                  distintas miradas para hacer crecer la empresa con intención,
                  criterio y confianza.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
