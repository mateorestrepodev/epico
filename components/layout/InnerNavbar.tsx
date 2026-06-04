// components/layout/InnerNavbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { Handbag } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useCartStore } from "@/lib/store/useCartStore";
import CartDrawer from "@/components/cart/CartDrawer";
import MenuOverlay from "@/components/layout/MenuOverlay"; // <-- Importamos nuestro nuevo componente

type Props = {
  theme?: "light" | "dark";
  showCart?: boolean;
};

export default function InnerNavbar({
  theme = "light",
  showCart = true,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
      ? "bg-background"
      : "bg-epico-blue";

  return (
    <>
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
          {showCart && (
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
          )}

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

      {/* AQUÍ INYECTAMOS EL NUEVO COMPONENTE */}
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
