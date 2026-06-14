// components/proyectos/ProyectosGallery.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
  title: string;
}

export default function ProyectosGallery({ images, title }: Props) {
  // 1. ESTADOS
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState(0);

  // 2. LÓGICA DE NAVEGACIÓN Y GESTOS (Declarados antes del useEffect)
  const nextImage = () => {
    setSelectedIndex((prev) =>
      prev === null ? null : prev === images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setSelectedIndex((prev) =>
      prev === null ? null : prev === 0 ? images.length - 1 : prev - 1,
    );
  };

  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStartX(e.targetTouches[0].clientX);

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const distance = touchStartX - touchEndX;
    if (distance > 50) nextImage();
    else if (distance < -50) prevImage();
  };

  // 3. EFECTOS DEL CICLO DE VIDA
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]); // Solo depende de selectedIndex porque next/prevImage no usan variables externas reactivas directamente

  // 4. RENDERIZADO
  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {images.map((src, i) => (
          <div
            key={i}
            onClick={() => setSelectedIndex(i)}
            className="relative aspect-[5/4] bg-gray-100 overflow-hidden group cursor-pointer"
          >
            <Image
              src={src}
              alt={`${title} - Galería ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />

            {/* Overlay Azul en Hover */}
            <div className="absolute inset-0 bg-epico-blue/0 group-hover:bg-epico-blue/80 transition-colors duration-500 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-xs tracking-[0.2em] uppercase font-medium translate-y-4 group-hover:translate-y-0 transform">
                Ampliar
              </span>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 cursor-pointer"
          >
            {/* Botón Cerrar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(null);
              }}
              className="absolute top-6 right-6 md:top-8 md:right-10 text-white/50 hover:text-white transition-colors z-[101]"
              aria-label="Cerrar galería"
            >
              <X size={32} strokeWidth={1.5} />
            </button>

            {/* Contenedor de la Imagen con animación interna */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full max-w-7xl max-h-[85vh] cursor-default flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[selectedIndex]}
                    alt={`${title} - Ampliada ${selectedIndex + 1}`}
                    fill
                    quality={100}
                    sizes="100vw"
                    className="object-contain pointer-events-none"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Controles de Navegación (Solo si hay más de 1 imagen) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-[101]"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft size={28} strokeWidth={1.5} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-[101]"
                  aria-label="Siguiente imagen"
                >
                  <ChevronRight size={28} strokeWidth={1.5} />
                </button>

                {/* Contador Visual Inferior */}
                <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 text-white/60 text-xs tracking-widest font-mono select-none">
                  {selectedIndex + 1} / {images.length}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
