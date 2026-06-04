// components/layout/MenuOverlay.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// Rutas centralizadas y correctas
const NAV_LINKS = [
  { label: "A la medida", href: "/alamedida" },
  { label: "Mobiliario", href: "/mobiliario" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fondo oscuro con un leve desenfoque para que se vea premium en toda la web */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-full md:w-1/2 h-full z-[100] cursor-pointer bg-black/10 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />

          {/* Panel Lateral */}
          <motion.div
            key="menu-panel"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-0 right-0 w-full md:w-1/2 h-[100dvh] bg-[#291df1] z-[101] flex flex-col justify-between p-7 shadow-2xl pointer-events-auto"
          >
            {/* Botón Cerrar */}
            <button
              onClick={onClose}
              className="absolute top-8 right-8 text-white text-3xl cursor-pointer hover:opacity-60 hover:rotate-90 transition-all duration-300"
              aria-label="Cerrar menú"
            >
              <X size={36} strokeWidth={1.5} />
            </button>

            {/* Links de Navegación */}
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
                    className="flex items-center gap-3 text-white text-2xl font-light tracking-tight hover:opacity-60 transition-opacity"
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
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

            {/* Footer del Menú */}
            <div className="flex flex-row justify-between items-start sm:items-end gap-2 sm:gap-1 text-white/70 text-[8px] tracking-widest uppercase pb-3 md:pb-0">
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
  );
}
