// components/ui/Preloader.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "auto";
    }, 2200);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-epico-dark"
        >
          {/* PRIMERO: El Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-28 md:w-36 text-white"
          >
            <Logo className="w-full h-auto" />
          </motion.div>

          {/* SEGUNDO: El texto (Slogan) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            // LA CORRECCIÓN: 'w-full text-center' asegura el eje central.
            // 'pl-[0.3em]' balancea el espacio invisible que deja el tracking al final.
            className="absolute bottom-10 w-full text-center text-white/50 text-xs tracking-[0.3em] pl-[0.3em] uppercase"
          >
            Objetos auténticos
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
