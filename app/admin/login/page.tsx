"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F5F2] p-6 sm:p-8 font-sans text-[#423C35]">
      <div className="w-full max-w-sm sm:max-w-md space-y-8 bg-background p-8 sm:p-12 shadow-sm border border-[#E4DFD5]  transition-all duration-300">
        {/* LOGO Y TÍTULOS */}
        <div className="text-center flex flex-col items-center">
          <Logo className="w-20 sm:w-24 h-auto text-[#332D26] mb-6" />
          <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#332D26]">
            Panel de Control
          </h2>
          <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#827A70]">
            Ingresa tus credenciales
          </p>
        </div>

        {/* FORMULARIO */}
        <form className="mt-6 sm:mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] uppercase tracking-wider font-medium text-[#6A6258] mb-1.5"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="block w-full  border border-[#D5CEC4] px-4 py-3 text-[#332D26] placeholder-[#A39C93] focus:border-[#332D26] focus:outline-none focus:ring-1 focus:ring-[#332D26]/20 sm:text-sm transition-all bg-[#FAFAF9]"
                placeholder="admin@epico.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[10px] uppercase tracking-wider font-medium text-[#6A6258] mb-1.5"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="block w-full  border border-[#D5CEC4] px-4 py-3 text-[#332D26] placeholder-[#A39C93] focus:border-[#332D26] focus:outline-none focus:ring-1 focus:ring-[#332D26]/20 sm:text-sm transition-all bg-[#FAFAF9]"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* MENSAJE DE ERROR */}
          {error && (
            <div className=" border border-red-200 bg-red-50 p-3 text-xs text-red-600 text-center animate-pulse">
              {error}
            </div>
          )}

          {/* BOTÓN DE ENTRADA */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer justify-center  bg-epico-blue px-4 py-4 text-[10px] font-medium uppercase tracking-wider text-white transition-colors hover:bg-blue-800 focus:outline-none disabled:opacity-50"
          >
            {loading ? "Iniciando sesión..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
