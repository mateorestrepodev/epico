// components/mobiliario/DetalleMobiliarioGallery.tsx
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
  // 1. ESTADOS Y REFERENCIAS
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 2. LÓGICA DE NEGOCIO Y FUNCIONES (Declaradas antes de los useEffect)

  // Lógica de Navegación Galería Principal
  const nextMainImage = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevMainImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  // Lógica de Navegación Lightbox (Modal)
  const nextLightboxImage = () =>
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevLightboxImage = () =>
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const openLightbox = () => {
    setLightboxIndex(currentIndex); // Inicia el modal en la foto actual
    setIsFullscreen(true);
  };

  const closeLightbox = () => {
    setCurrentIndex(lightboxIndex); // Sincroniza el fondo con la última foto vista en el modal
    setIsFullscreen(false);
  };

  // Manejo de Gestos Táctiles
  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStartX(e.targetTouches[0].clientX);

  const handleMainTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const distance = touchStartX - touchEndX;
    if (distance > 50) nextMainImage();
    else if (distance < -50) prevMainImage();
  };

  const handleLightboxTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const distance = touchStartX - touchEndX;
    if (distance > 50) nextLightboxImage();
    else if (distance < -50) prevLightboxImage();
  };

  // 3. EFECTOS DEL CICLO DE VIDA (useEffect)

  // Auto-scrollear la miniatura activa en Desktop
  useEffect(() => {
    if (thumbnailRefs.current[currentIndex] && !isFullscreen) {
      thumbnailRefs.current[currentIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentIndex, isFullscreen]);

  // Manejo de eventos del teclado (solo activos cuando el modal está abierto)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextLightboxImage();
      if (e.key === "ArrowLeft") prevLightboxImage();
    };

    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen, lightboxIndex]); // Añadimos lightboxIndex como dependencia para que el cierre sincronice correctamente

  // 4. RENDERIZADOS CONDICIONALES
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-[#E8E3D9] flex flex-col items-center justify-center border border-[#D0C7B9]">
        <span className="text-[#645C50] text-sm tracking-wider uppercase font-medium">
          Imagen no disponible
        </span>
      </div>
    );
  }

  // 5. RENDER PRINCIPAL (JSX)
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 w-full h-full overflow-hidden">
        {/* --- MINIATURAS (Desktop) --- */}
        {images.length > 1 && (
          <div className="hidden md:flex flex-col gap-3 w-20 xl:w-28 h-full overflow-y-auto pr-1 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {images.map((img, idx) => (
              <button
                key={idx}
                ref={(el) => {
                  thumbnailRefs.current[idx] = el;
                }}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ver imagen ${idx + 1}`}
                className={`relative aspect-square w-full flex-shrink-0 overflow-hidden transition-all duration-300 bg-[#E8E3D9] ${
                  currentIndex === idx
                    ? "opacity-100 "
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`Miniatura ${idx + 1}`}
                  fill
                  sizes="100px"
                  className="object-cover pointer-events-none"
                />
              </button>
            ))}
          </div>
        )}

        {/* --- IMAGEN PRINCIPAL --- */}
        <div
          className="relative flex-grow w-full h-full bg-[#E8E3D9] overflow-hidden group cursor-zoom-in"
          onClick={openLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleMainTouchEnd}
        >
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
                priority={true}
                fetchPriority="high"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                className="object-cover object-center pointer-events-none"
              />
            </motion.div>
          </AnimatePresence>

          {/* Botones de Navegación Principal */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevMainImage();
                }}
                aria-label="Imagen anterior"
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
                onClick={(e) => {
                  e.stopPropagation();
                  nextMainImage();
                }}
                aria-label="Siguiente imagen"
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

      {/* --- LIGHTBOX (PANTALLA COMPLETA) --- */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={closeLightbox}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleLightboxTouchEnd}
          >
            {/* Botón de Cerrar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              className="absolute top-6 right-6 md:top-8 md:right-10 text-white/60 hover:text-white transition-colors z-[110]"
              aria-label="Cerrar pantalla completa"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Contenedor de la Imagen Fullscreen animada por lightboxIndex */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full max-w-[90vw] max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[lightboxIndex]}
                    alt={`${productName} - Vista ampliada`}
                    fill
                    quality={100}
                    sizes="100vw"
                    className="object-contain pointer-events-none"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Controles del Lightbox */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevLightboxImage();
                  }}
                  className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-[110]"
                  aria-label="Imagen anterior modal"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextLightboxImage();
                  }}
                  className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-[110]"
                  aria-label="Siguiente imagen modal"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
