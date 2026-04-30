// app/page.tsx
import HeroScroll from "@/components/layout/HeroScroll";
import Preloader from "@/components/ui/Preloader"; // <-- Importamos el telón

export default function Home() {
  return (
    <main className="w-full relative bg-background">
      {/* 1. Nuestro telón de entrada elegante */}
      <Preloader />

      {/* 2. Secuencia de Introducción Animada */}
      <HeroScroll />
    </main>
  );
}
