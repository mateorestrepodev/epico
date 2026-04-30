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

    const timer = setTimeout(async () => {
      await Promise.all([
        animateCurtain(
          curtainScope.current,
          { height: 0 },
          { duration: 1.2, ease: [0.76, 0, 0.24, 1] },
        ),
        animateLogo(
          logoScope.current,
          { top: 20, left: 28, x: "0%", y: "0%", scale: 1, color: "#291df1" },
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
    <div className="relative w-full h-screen z-50 ">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/epicohero1.jpg"
          alt="ēpico — Mobiliario Auténtico"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Telón azul */}
      <motion.div
        ref={curtainScope}
        style={{ height: dims.h }}
        className="absolute top-0 left-0 w-full bg-[#291df1] z-10"
      />

      {/* Logo — hereda color via currentColor */}
      <motion.div
        ref={logoScope}
        style={{
          top: dims.h / 2,
          left: dims.w / 2,
          x: "-50%",
          y: "-50%",
          scale: 1.5,
          color: "#ffffff",
        }}
        className="absolute z-20 w-24 md:w-28 origin-top-left pointer-events-none select-none"
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
              className="fixed top-0 right-0 w-full md:w-1/2 h-full bg-[#291df1] z-50 flex flex-col justify-between pt-16 pl-10 md:pl-14 pr-10 pb-10 shadow-2xl"
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
              <nav className="flex flex-col gap-2 mt-10">
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
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-1 text-white/50 text-[10px] tracking-widest uppercase">
                <span>CREAR Y PERMANECER</span>
                <a
                  href="https://www.instagram.com/estudioepico/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:text-epico-blue transition-colors cursor-pointer"
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
