"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryClientProps {
  images: string[];
  productName: string;
}

export default function ProductGalleryClient({
  images,
  productName,
}: ProductGalleryClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback visualmente consistente si no hay imágenes
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full min-h-[500px] md:min-h-[600px] bg-[#E8E3D9] flex flex-col items-center justify-center border border-[#D0C7B9]">
        <svg
          className="w-12 h-12 text-[#867B6E] mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
        <span className="text-[#645C50] text-sm tracking-widest uppercase">
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
    // Estructura principal: Fija la altura y asegura que no colapse
    <div className="flex gap-4 w-full h-[500px] md:h-[600px] lg:h-[75vh]">
      {/* 1. Columna de Miniaturas (Izquierda) - Solo si hay más de 1 imagen */}
      {images.length > 1 && (
        <div className="hidden md:flex flex-col gap-3 w-20 xl:w-24 h-full overflow-y-auto scrollbar-hide pr-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative aspect-[3/4] w-full flex-shrink-0 overflow-hidden transition-all duration-300 border ${
                currentIndex === idx
                  ? "opacity-100 border-[#7A7265]"
                  : "opacity-60 hover:opacity-100 border-transparent"
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

      {/* 2. Imagen Principal (Visor Grande) */}
      <div className="relative flex-grow h-full bg-[#E8E3D9] overflow-hidden group border border-[#D0C7B9]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentIndex]}
              alt={`${productName} - Vista principal`}
              fill
              priority={currentIndex === 0}
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Flechas de Navegación - Solo si hay más de 1 imagen */}
        {images.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={prevImage}
              className="w-10 h-10 md:w-12 md:h-12 bg-[#F4F1EB] text-[#4A4238] flex items-center justify-center hover:bg-[#EBE7DF] transition-colors shadow-sm"
              aria-label="Anterior"
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
              className="w-10 h-10 md:w-12 md:h-12 bg-[#F4F1EB] text-[#4A4238] flex items-center justify-center hover:bg-[#EBE7DF] transition-colors shadow-sm"
              aria-label="Siguiente"
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
          </div>
        )}
      </div>
    </div>
  );
}
