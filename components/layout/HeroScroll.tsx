// components/layout/HeroScroll.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useAnimate } from "framer-motion";
import { X } from "lucide-react";
import Logo from "@/components/ui/Logo";

const NAV_LINKS = [
  { label: "Mobiliario", href: "/mobiliario" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

export default function HeroScroll() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const pathname = usePathname();

  const [curtainScope, animateCurtain] = useAnimate();
  const [logoScope, animateLogo] = useAnimate();
  const [burgerScope, animateBurger] = useAnimate();

  useEffect(() => {
    const update = () =>
      setDims({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!dims) return;

    // Detectamos si es móvil o desktop para alinear el logo en la esquina igual que tu Navbar
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
            top: 20, // Padding superior
            left: isDesktop ? 32 : 20, // px-8 (32) en PC, px-5 (20) en móvil
            x: "0%",
            y: "0%",
            scale: 0.85, // Lo encogemos un poquito para que quede tamaño Navbar
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

  if (!dims) return null;

  return (
    <div className="relative w-full h-screen z-50">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/epicohero.png"
          alt="ēpico — Mobiliario Auténtico"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* ISOTIPO CENTRADO SOBRE LA FOTO (Este se queda en la foto) */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 px-8 flex items-end h-full justify-between z-10 pointer-events-none pb-8">
          <div className="flex items-center gap-10 md:gap-16">
            {/* Rectángulo largo */}
            <div className="w-12 h-2.5 md:w-12 md:h-3 bg-epico-blue" />
            {/* Cuadro pequeño */}
            <div className="w-2.5 h-2.5 md:w-5 md:h-3 bg-epico-blue" />
          </div>
          <span className="text-epico-blue text-[10px] md:text-xs font-bold tracking-widest uppercase">
            ESTUDIOĒPICO.COM
          </span>
        </div>
      </div>

      {/* Telón azul */}
      <motion.div
        ref={curtainScope}
        style={{ height: dims.h }}
        className="absolute top-0 left-0 w-full bg-[#291df1] z-10 overflow-hidden"
      >
        {/* TEXTO SLOGAN: Se va con el telón azul hacia arriba */}
        <div className="absolute bottom-10 w-full text-center text-white/80 text-xs tracking-[0.3em] pl-[0.3em] uppercase">
          Objetos auténticos
        </div>
      </motion.div>

      {/* Logo — Animado desde el centro */}
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
        <Logo className="w-full h-auto drop-shadow-md" />
      </motion.div>

      {/* Hamburguesa */}
      <motion.button
        ref={burgerScope}
        style={{ opacity: 0 }}
        onClick={() => setMenuOpen(true)}
        className="absolute top-[22px] right-7 z-20 flex flex-col gap-[4px] cursor-pointer hover:opacity-70 transition-opacity"
        aria-label="Abrir menú"
      >
        <span className="block w-7 h-[4px] bg-[#291df1]" />
        <span className="block w-7 h-[4px] bg-[#291df1]" />
        <span className="block w-7 h-[4px] bg-[#291df1]" />
      </motion.button>

      {/* Panel de menú */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 w-1/2 h-full z-40 cursor-pointer bg-black/5"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              key="menu-panel"
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="fixed top-0 right-0 w-full md:w-1/2 h-full bg-[#291df1] z-50 flex flex-col justify-between p-7 shadow-2xl"
            >
              {/* Botón cerrar */}
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-8 right-8 text-white text-3xl cursor-pointer hover:opacity-60 hover:rotate-90 transition-all duration-300"
                aria-label="Cerrar menú"
              >
                <X size={36} strokeWidth={1.5} />
              </button>

              {/* Links */}
              <nav className="flex flex-col gap-2 mt-4">
                {NAV_LINKS.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.1 + i * 0.07,
                        ease: [0.76, 0, 0.24, 1],
                      }}
                      className="flex items-center gap-3 text-white text-4xl font-light tracking-tight hover:opacity-60 transition-opacity"
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3"
                      >
                        <span
                          className={`text-2xl transition-all duration-300 ${
                            isActive
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-2"
                          }`}
                        >
                          →
                        </span>
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="flex flex-row justify-between items-start md:items-end gap-1 text-white/70 text-[9px] tracking-widest uppercase">
                <span>CREAR Y PERMANECER</span>
                <a
                  href="https://www.instagram.com/estudioepico/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:text-white transition-colors cursor-pointer"
                >
                  @estudioepico
                </a>
                <span>Est. 2022 MDE/COL</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
