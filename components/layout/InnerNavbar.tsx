// components/layout/InnerNavbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { X, Handbag } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useCartStore } from "@/lib/store/useCartStore";
import CartDrawer from "@/components/cart/CartDrawer";

type Props = {
  theme?: "light" | "dark";
};

export default function InnerNavbar({ theme = "light" }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const navLinks = ["Mobiliario", "Proyectos", "Nosotros", "Contacto"];

  const { openCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const iconColor = isScrolled
    ? "text-epico-blue"
    : theme === "dark"
      ? "text-white"
      : "text-epico-blue";

  const lineBgColor = isScrolled
    ? "bg-epico-blue"
    : theme === "dark"
      ? "bg-white"
      : "bg-epico-blue";

  return (
    <>
      {/* ¡CORRECCIÓN AQUÍ!
        Dejamos el padding fijo en 'py-5 px-5 md:px-8' para ambos estados.
        Así la barra no se encoge, solo cambia su fondo suavemente.
      */}
      <nav
        className={`fixed top-0 left-0 w-full z-40 flex justify-between items-center py-5 px-5 md:px-8 transition-colors duration-500 ease-in-out ${
          isScrolled
            ? "bg-epico-light backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <Link
          href="/"
          className="hover:opacity-70 transition-opacity w-24 md:w-28 flex items-center cursor-pointer"
          aria-label="Ir al inicio"
        >
          <Logo
            className={`w-full h-auto transition-colors duration-300 ${iconColor}`}
          />
        </Link>

        {/* Zona de Botones Derechos */}
        <div className="flex items-center gap-6">
          {/* Botón Carrito */}
          <button
            onClick={openCart}
            className={`relative focus:outline-none hover:opacity-70 transition-colors duration-300 cursor-pointer ${iconColor}`}
            aria-label="Abrir carrito"
          >
            <Handbag size={26} strokeWidth={1.5} />
            {isMounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full pointer-events-none">
                {totalItems}
              </span>
            )}
          </button>

          {/* Menú Hamburguesa */}
          <button
            onClick={() => setMenuOpen(true)}
            className="focus:outline-none hover:cursor-pointer hover:opacity-70 transition-opacity flex flex-col gap-[5px]"
            aria-label="Abrir menú"
          >
            <span
              className={`block w-7 h-[4px] pointer-events-none transition-colors duration-300 ${lineBgColor}`}
            />
            <span
              className={`block w-7 h-[4px] pointer-events-none transition-colors duration-300 ${lineBgColor}`}
            />
            <span
              className={`block w-7 h-[4px] pointer-events-none transition-colors duration-300 ${lineBgColor}`}
            />
          </button>
        </div>
      </nav>

      {/* Panel Lateral del Carrito */}
      <CartDrawer />

      {/* Menú de Navegación Desplegable */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 w-full md:w-1/2 h-full z-40 cursor-pointer bg-black/20 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              key="inner-menu"
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="fixed top-0 right-0 w-full md:w-1/2 h-full bg-epico-blue z-50 flex flex-col justify-between pt-16 pl-10 md:pl-14 pr-10 pb-10 shadow-2xl"
            >
              {/* Botón cerrar */}
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-8 right-8 text-white cursor-pointer hover:opacity-60 hover:rotate-90 transition-all duration-300"
                aria-label="Cerrar menú"
              >
                <X size={36} strokeWidth={1.5} />
              </button>

              {/* Links */}
              <div className="flex flex-col gap-2 mt-10">
                {navLinks.map((link, i) => {
                  const href = `/${link.toLowerCase()}`;
                  const isActive = pathname === href;
                  return (
                    <motion.a
                      key={link}
                      href={href}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.1 + i * 0.07,
                        ease: [0.76, 0, 0.24, 1],
                      }}
                      className="flex items-center gap-3 text-white text-4xl font-light tracking-tight hover:opacity-60 transition-opacity cursor-pointer"
                    >
                      <span
                        className={
                          isActive
                            ? "text-2xl opacity-100 translate-x-0 transition-all duration-300"
                            : "text-2xl opacity-0 -translate-x-2 transition-all duration-300"
                        }
                      >
                        →
                      </span>
                      {link}
                    </motion.a>
                  );
                })}
              </div>

              {/* Footer del menú */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-1 text-white/70 text-[10px] tracking-widest uppercase">
                <span>CREAR Y PERMANECER</span>
                <a
                  href="https://www.instagram.com/estudioepico/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold  transition-colors cursor-pointer"
                >
                  @estudioepico
                </a>
                <span>Est. 2022 MDE/COL</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
