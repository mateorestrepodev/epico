"use client";

import Footer from "@/components/layout/Footer";
import InnerNavbar from "@/components/layout/InnerNavbar";
import { motion } from "framer-motion";

export default function ContactoPage() {
  return (
    <main className="w-full min-h-screen bg-background flex flex-col selection:bg-epico-blue selection:text-white">
      <InnerNavbar />

      {/* Contenedor Principal: Asimetría Editorial */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto px-8 md:px-14 lg:px-20 pt-32 pb-24 gap-16 lg:gap-12">
        {/* =========== LADO IZQUIERDO: Titular =========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="lg:w-5/12 flex flex-col justify-start"
        >
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-epico-dark mb-6">
            Contacto.
          </h1>
          <p className="text-sm md:text-base text-gray-700 font-light max-w-sm leading-relaxed">
            Estamos aquí para dar vida a tus ideas. Escríbenos para consultas
            sobre mobiliario, proyectos o colaboraciones.
          </p>
        </motion.div>

        {/* =========== LADO DERECHO: Grid de Detalles =========== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
          className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-16 lg:pt-4"
        >
          {/* Bloque 1: Email */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-epico-dark-700 mb-4 block">
              Email
            </span>
            <a
              href="mailto:juaguse@gmail.com"
              className="text-xs md:text-sm tracking-wider text-epico-dark uppercase hover:text-epico-blue transition-colors group flex flex-col items-start gap-1 w-fit"
            >
              <span>juaguse@gmail.com</span>
              {/* Línea animada hover */}
              <span className="h-[1px] w-0 bg-epico-blue group-hover:w-full transition-all duration-500 ease-out"></span>
            </a>
          </div>

          {/* Bloque 2: Redes / Contacto Directo */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-epico-dark-700 mb-4 block">
              Social / Chat
            </span>
            <div className="flex flex-col gap-5">
              {/* WhatsApp */}
              <a
                href="https://wa.me/573242548059"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-xs md:text-sm tracking-wider text-epico-dark uppercase hover:text-epico-blue transition-colors group w-fit"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.06-.177-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="relative flex flex-col">
                  324 254 80 59
                  <span className="h-[1px] w-0 bg-epico-blue group-hover:w-full transition-all duration-500 ease-out mt-1"></span>
                </span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/estudioepico/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-xs md:text-sm tracking-wider text-epico-dark uppercase hover:text-epico-blue transition-colors group w-fit"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className="relative flex flex-col">
                  @estudioepico
                  <span className="h-[1px] w-0 bg-epico-blue group-hover:w-full transition-all duration-500 ease-out mt-1"></span>
                </span>
              </a>
            </div>
          </div>

          {/* Bloque 3: Ubicación */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-epico-dark-700 mb-4 block">
              Studio / Showroom
            </span>
            <p className="text-xs md:text-sm tracking-wider text-epico-dark uppercase leading-relaxed">
              Medellín
              <br />
              Colombia
            </p>
          </div>

          {/* Bloque 4: Horarios */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-epico-dark-700 mb-4 block">
              Horarios
            </span>
            <p className="text-xs md:text-sm tracking-wider text-epico-dark uppercase leading-relaxed">
              Lunes a Viernes
              <br />9 AM — 5 PM
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
