// app/contacto/page.tsx
"use client";

import InnerNavbar from "@/components/layout/InnerNavbar";
import { motion } from "framer-motion";
import { Smartphone, Mail, Instagram } from "lucide-react";

export default function ContactoPage() {
  // Generamos un arreglo grande para iterar nuestro SVG de fondo
  const bgItems = Array(200).fill(0);

  return (
    <main className="w-full min-h-screen flex flex-col bg-[#FDFDFD] selection:bg-white selection:text-epico-blue overflow-hidden">
      {/* El Navbar va transparente para no chocar con el fondo */}
      <InnerNavbar theme="light" />

      {/* Contenedor Principal */}
      <div className="relative flex-1 flex items-center justify-center w-full overflow-hidden pt-20 pb-8">
        {/* === FONDO DE LOGOS SVG (Aislado para evitar scroll) === */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          {/* Añadimos gap-4 y md:gap-8 para que los SVGs respiren adecuadamente entre sí */}
          <div className="absolute flex flex-wrap content-start justify-center w-[120vw] h-[120vh] -left-[10vw] -top-[10vh] opacity-100 gap-4 md:gap-8 lg:gap-5">
            {bgItems.map((_, i) => (
              <div
                key={i}
                // Alturas escalonadas equivalentes al tamaño de texto que teníamos, con proporción 3:1
                className="h-[2.5rem] md:h-[5rem] lg:h-[70px] xl:h-[120px] aspect-[3/1] bg-epico-blue [mask-image:url('/epicocontacto.svg')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-image:url('/epicocontacto.svg')] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
              />
            ))}
          </div>
        </div>

        {/* === TARJETA CENTRAL AZUL === */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="relative z-10 bg-epico-blue text-white p-8 md:p-12 lg:p-10 w-[90%] max-w-[600px] shadow-2xl"
        >
          <div className="flex flex-col gap-8 md:gap-10">
            {/* Header: Nombre y Cargo */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-[50px] font-medium tracking-wide leading-[1.1] mb-3 md:mb-4">
                Juanita <br /> Gutiérrez Serrano
              </h1>
              <h2 className="text-lg md:text-xl font-normal tracking-widest">
                Directora creativa
              </h2>
            </div>

            {/* Body: Datos de Contacto */}
            <div className="flex flex-col gap-6 md:gap-7">
              {/* Teléfono */}
              <a
                href="https://wa.me/573242548059"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 group w-fit"
              >
                <Smartphone size={24} strokeWidth={2} />
                <span className="text-base md:text-lg tracking-wide group-hover:opacity-70 transition-opacity">
                  324 2548059
                </span>
              </a>

              {/* Correo */}
              <a
                href="mailto:juanita.gutierrez@estudioepico.com"
                className="flex items-center gap-5 group w-fit"
              >
                <Mail size={30} strokeWidth={2} />
                <span className="text-base md:text-lg tracking-wide break-all group-hover:opacity-70 transition-opacity">
                  juanita.gutierrez@estudioepico.com
                </span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/estudioepico/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 group w-fit"
              >
                <Instagram size={24} strokeWidth={2} />
                <span className="text-base md:text-lg tracking-wide group-hover:opacity-70 transition-opacity">
                  estudioepico
                </span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
