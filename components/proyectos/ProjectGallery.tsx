// components/proyectos/ProjectGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { PROJECTS } from "@/lib/constants/projects";

// ─── Modal ────────────────────────────────────────────────────────────────────
function ImageModal({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6 cursor-zoom-out"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl aspect-[4/3] rounded-sm overflow-hidden"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 896px"
          className="object-cover"
        />
      </motion.div>
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:opacity-60 transition-opacity"
        aria-label="Cerrar"
      >
        <X size={32} strokeWidth={1.5} />
      </button>
    </motion.div>
  );
}

// ─── Galería ──────────────────────────────────────────────────────────────────
type Props = {
  projectIndex: number; // índice del proyecto activo
};

export default function ProjectGallery({ projectIndex }: Props) {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const currentProject = PROJECTS[projectIndex];

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProject.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 w-full"
        >
          {currentProject.gallery.map((src, i) => (
            <div
              key={i}
              onClick={() => setModalImage(src)}
              className="relative group cursor-pointer aspect-square bg-[#f5f5f5] overflow-hidden"
            >
              <Image
                src={src}
                alt={`${currentProject.title} — foto ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay azul hover */}
              <div className="absolute inset-0 bg-[#291df1]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-start p-6 z-10">
                <span className="text-white text-sm font-medium tracking-widest uppercase translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  Ver imagen
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {modalImage && (
          <ImageModal
            src={modalImage}
            alt={currentProject.title}
            onClose={() => setModalImage(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
