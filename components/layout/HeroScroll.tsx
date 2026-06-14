"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useAnimate } from "framer-motion";
import Logo from "@/components/ui/Logo";
import dynamic from "next/dynamic"; // <-- IMPORTAMOS DYNAMIC

// === OPTIMIZACIÓN DE RENDIMIENTO ===
// El menú ya no bloquea el hilo principal. Se descarga en segundo plano.
const MenuOverlay = dynamic(() => import("@/components/layout/MenuOverlay"), {
  ssr: false,
});

export default function HeroScroll() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);

  const router = useRouter();

  const [curtainScope, animateCurtain] = useAnimate();
  const [logoScope, animateLogo] = useAnimate();
  const [burgerScope, animateBurger] = useAnimate();

  const [touchStartY, setTouchStartY] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const update = () =>
      setDims({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!dims) return;

    const isDesktop = window.innerWidth >= 768;

    const timer = setTimeout(async () => {
      await Promise.all([
        animateCurtain(
          curtainScope.current,
          { height: 0 },
          { duration: 1.2, ease: [0.76, 0, 0.24, 1] },
        ),
        animateLogo(
          logoScope.current,
          {
            top: 20,
            left: isDesktop ? 32 : 20,
            x: "0%",
            y: "0%",
            scale: 0.85,
            color: "#291df1",
          },
          { duration: 1.2, ease: [0.76, 0, 0.24, 1] },
        ),
      ]);
      await animateBurger(
        burgerScope.current,
        { opacity: 1 },
        { duration: 0.3, ease: "easeOut" },
      );
    }, 3000);

    return () => clearTimeout(timer);
  }, [dims]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isNavigating) return;
    const touchEndY = e.changedTouches[0].clientY;
    const distance = touchStartY - touchEndY;

    if (distance > 50) {
      setIsNavigating(true);
      router.push("/mobiliario");
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isNavigating) return;

    if (e.deltaY > 50) {
      setIsNavigating(true);
      router.push("/mobiliario");
    }
  };

  if (!dims) return null;

  return (
    <div
      className="fixed inset-0 w-full h-[100dvh] z-50 overflow-hidden touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/epicohero.png"
          alt="ēpico"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center hidden md:block"
        />
        <Image
          src="/epicoheromobile.png"
          alt="ēpico Mobile"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center md:hidden"
        />

        <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between z-10">
          <div
            className="w-[100px] md:w-[130px] lg:w-[170px] aspect-[3/1] bg-epico-blue [mask-image:url('/isotipo.svg')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:left_bottom] [-webkit-mask-image:url('/isotipo.svg')] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:left_bottom]"
            role="img"
            aria-label="Isotipo Estudio Épico"
          />
        </div>
      </div>

      <motion.div
        ref={curtainScope}
        style={{ height: dims.h }}
        className="absolute top-0 left-0 w-full bg-[#291df1] z-10 overflow-hidden pointer-events-none"
      >
        <div className="absolute bottom-10 w-full text-center font-semibold text-white/80 text-xs tracking-[0.3em] pl-[0.3em] uppercase">
          Objetos auténticos
        </div>
      </motion.div>

      <motion.div
        ref={logoScope}
        style={{
          top: dims.h / 2,
          left: dims.w / 2,
          x: "-50%",
          y: "-50%",
          scale: 1,
          color: "#ffffff",
          transformOrigin: "top left",
        }}
        className="absolute z-20 w-28 md:w-36 pointer-events-none select-none"
      >
        <Logo className="w-full h-auto -ml-3 md:-ml-5 drop-shadow-md" />
      </motion.div>

      <motion.button
        ref={burgerScope}
        style={{ opacity: 0 }}
        onClick={() => setMenuOpen(true)}
        className="absolute top-[22px] right-7 z-20 flex flex-col gap-[4px] cursor-pointer hover:opacity-70 transition-opacity pointer-events-auto"
        aria-label="Abrir menú"
      >
        <span className="block w-7 h-[4px] bg-[#291df1]" />
        <span className="block w-7 h-[4px] bg-[#291df1]" />
        <span className="block w-7 h-[4px] bg-[#291df1]" />
      </motion.button>

      {/* Menú Lazy Loaded */}
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
