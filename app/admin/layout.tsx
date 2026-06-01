"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import Logo from "@/components/ui/Logo";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Estado para el menú móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const navigation = [
    { name: "Mobiliario", href: "/admin/mobiliario" },
    { name: "Proyectos", href: "/admin/proyectos" },
  ];

  // 1. LÓGICA: Comprobamos si estamos en la página de login
  const isLoginPage = pathname === "/admin/login";

  // Si estamos en el login, devolvemos SOLO la página de login, sin sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // De lo contrario, devolvemos todo el layout normal (Sidebar + Contenido)
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* ================= SIDEBAR DESKTOP ================= */}
      <aside className="hidden w-1/6 flex-col border-r border-black md:flex">
        <div className="flex h-24 items-center justify-start border-b border-black px-8 flex-shrink-0">
          <Link href="/">
            <Logo className="w-28 h-auto text-black transition-opacity hover:opacity-70 cursor-pointer" />
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-6 p-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <p className="text-xs font-bold tracking-widest text-gray-700">
            PANEL DE CONTROL
          </p>
          <div className="flex flex-col space-y-4">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center text-sm uppercase tracking-wider transition-colors ${
                    isActive
                      ? "font-bold text-[var(--color-epico-blue)]"
                      : "text-black hover:text-[var(--color-epico-blue)]"
                  }`}
                >
                  {isActive && <span className="mr-3">→</span>}
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-black p-8 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm uppercase tracking-wider text-black transition-colors hover:text-red-600 cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ================= CONTENIDO PRINCIPAL Y HEADER MÓVIL ================= */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <header className="flex h-20 flex-shrink-0 items-center justify-between border-b border-black px-6 md:hidden bg-[var(--color-background)] z-50">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            <Logo className="w-24 h-auto text-black transition-opacity hover:opacity-70 cursor-pointer" />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-sm uppercase tracking-wider cursor-pointer font-medium hover:text-[var(--color-epico-blue)] transition-colors"
          >
            {isMobileMenuOpen ? "Cerrar" : "Menú"}
          </button>
        </header>

        {/* ================= MENÚ DESPLEGABLE MÓVIL ================= */}
        {isMobileMenuOpen && (
          <div className="absolute top-20 left-0 right-0 bottom-0 bg-[var(--color-background)] z-40 flex flex-col p-8 md:hidden overflow-y-auto">
            <p className="text-xs font-bold tracking-widest text-gray-700 mb-8">
              Navegación
            </p>
            <div className="flex flex-col space-y-6 flex-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg uppercase tracking-wider transition-colors ${
                      isActive
                        ? "font-bold text-[var(--color-epico-blue)]"
                        : "text-black hover:text-[var(--color-epico-blue)]"
                    }`}
                  >
                    {isActive && <span className="mr-3">→</span>}
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-gray-300 pt-8 mt-8">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left text-sm font-bold uppercase tracking-wider text-red-600 transition-colors cursor-pointer"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}

        {/* ================= RENDERIZADO DE LAS PÁGINAS ================= */}
        <main className="flex-1 overflow-y-auto p-6 md:p-16">{children}</main>
      </div>
    </div>
  );
}
