"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIAS = [
  "Todos",
  "Camas",
  "Comedores",
  "Mesas",
  "Nocheros",
  "Sillas de barra",
  "Sillas",
  "Sofás",
  "Zapateros",
  "Muebles de TV",
  "Escritorios",
  "Bancas",
  "Poltronas",
  "Estanterías",
];

export default function CategoryNav() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriaActiva = searchParams.get("categoria") || "Todos";

  // Referencias y estados para el Drag-to-Scroll
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragged, setDragged] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setDragged(false);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault(); // Previene la selección de texto nativa

    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2.5; // Velocidad de arrastre optimizada

    // Umbral: Solo lo consideramos "arrastre" si se mueve más de 5px
    if (Math.abs(walk) > 5) {
      setDragged(true);
    }

    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleClick = (cat: string, e: React.MouseEvent) => {
    // Si el usuario arrastró, bloqueamos el clic de navegación
    if (dragged) {
      e.preventDefault();
      return;
    }
    e.preventDefault();

    const url =
      cat === "Todos"
        ? "/mobiliario"
        : `/mobiliario?categoria=${encodeURIComponent(cat)}`;
    router.push(url, { scroll: false });
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-background/95 backdrop-blur-md sticky top-0 z-30 transition-all select-none">
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        // Ajustamos los paddings para que no se vea ni muy pegado arriba ni abajo
        className="w-full max-w-[1500px] mx-auto flex items-center gap-6 md:gap-10 overflow-x-auto whitespace-nowrap px-6 md:px-10 py-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing"
      >
        {CATEGORIAS.map((cat) => {
          const isActive = cat === categoriaActiva;
          return (
            <button
              key={cat}
              draggable={false} // Evita el "ghost drag" del navegador
              onClick={(e) => handleClick(cat, e)}
              className={`text-[11px] uppercase tracking-[0.25em] transition-all duration-300 relative pb-1 block font-medium flex-shrink-0 ${
                isActive ? "text-[#1A00FF]" : "text-gray-400 hover:text-black"
              }`}
            >
              {cat}
              {isActive && (
                <span className="absolute bottom-[-4px] left-0 w-full h-[1.5px] bg-[#1A00FF]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
