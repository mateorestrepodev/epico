"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryClientProps {
  images: string[];
  productName: string;
}

export default function DetalleMobiliarioGallery({
  images,
  productName,
}: ProductGalleryClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Referencia para controlar el scroll de las miniaturas
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Efecto mágico: Centra automáticamente la miniatura seleccionada
  useEffect(() => {
    if (thumbnailRefs.current[currentIndex]) {
      thumbnailRefs.current[currentIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center", // <-- ESTO ES LO QUE HACE LA MAGIA, OBLIGA A REVELAR LAS OCULTAS
      });
    }
  }, [currentIndex]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-[#E8E3D9] flex flex-col items-center justify-center border border-[#D0C7B9]">
        <span className="text-[#645C50] text-sm tracking-widest uppercase font-medium">
          Imagen no disponible
        </span>
      </div>
    );
  }

  const nextImage = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full h-full overflow-hidden">
      {/* Miniaturas (Izquierda) con scroll invisible y auto-centrado */}
      {images.length > 1 && (
        <div className="hidden md:flex flex-col gap-3 w-20 xl:w-28 h-full overflow-y-auto pr-1 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {images.map((img, idx) => (
            <button
              key={idx}
              // Asignamos la referencia a cada botón
              ref={(el) => {
                thumbnailRefs.current[idx] = el;
              }}
              onClick={() => setCurrentIndex(idx)}
              className={`relative aspect-square w-full flex-shrink-0 overflow-hidden transition-all duration-300 bg-[#E8E3D9] ${
                currentIndex === idx
                  ? "opacity-100 ring-1 ring-offset-2 ring-[#7A7265]"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`Miniatura ${idx + 1}`}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Visor Grande */}
      <div className="relative flex-grow w-full h-full bg-[#E8E3D9] overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentIndex]}
              alt={`${productName} - Vista principal`}
              fill
              priority={currentIndex === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-[#FDF9F2]/90 text-[#4A4238] flex items-center justify-center hover:bg-background transition-colors z-10"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-[#FDF9F2]/90 text-[#4A4238] flex items-center justify-center hover:bg-background transition-colors z-10"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
