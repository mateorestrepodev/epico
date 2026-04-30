"use client";

import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";

export default function Marquee() {
  // Creamos un array de 10 elementos para repetir el logo varias veces
  const repeatCount = Array.from({ length: 10 });

  return (
    // Según el manual: Fondo blanco, logo azul o negro.
    <section className="relative w-full overflow-hidden bg-white border-y border-gray-100">
      <div className="flex w-fit">
        <motion.div
          className="flex whitespace-nowrap items-center gap-16 pr-16 -my-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 15, // Qué tan lento se mueve. 15 es elegante.
          }}
        >
          {/* Renderizamos dos bloques idénticos para que el loop sea infinito y sin saltos */}
          <div className="flex gap-16 items-center">
            {repeatCount.map((_, i) => (
              <Logo
                key={`logo-1-${i}`}
                className="w-24 md:w-32 text-[#291df1]"
              />
            ))}
          </div>
          <div className="flex gap-16 items-center">
            {repeatCount.map((_, i) => (
              <Logo
                key={`logo-2-${i}`}
                className="w-24 md:w-32 text-[#291df1]"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
