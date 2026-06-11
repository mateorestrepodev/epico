// components/proyectos/ProyectosGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  images: string[];
  title: string;
}

export default function ProyectosGallery({ images, title }: Props) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {images.map((src, i) => (
          <div
            key={i}
            onClick={() => setSelectedImg(src)}
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
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 cursor-pointer"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImg(null);
              }}
              className="absolute top-6 right-6 md:top-10 md:right-10 text-white/50 hover:text-white transition-colors z-[101]"
            >
              <X size={36} strokeWidth={1} />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full max-w-7xl max-h-[85vh] cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImg}
                alt={title}
                fill
                quality={100}
                sizes="100vw" // CORRECCIÓN: Se añade sizes para evitar el warning en pantalla completa
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
