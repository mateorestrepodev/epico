// components/mobiliario/ProductGrid.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/supabase";

export interface ProductGridData {
  id: number;
  name: string;
  price: number;
  image_url: string;
  hover_image_url?: string;
  slug: string;
}

export default function ProductGrid() {
  const [products, setProducts] = useState<ProductGridData[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para controlar los "taps" en dispositivos móviles
  const [activeTouchId, setActiveTouchId] = useState<number | null>(null);

  const router = useRouter();

  // Carga de productos
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("mobiliario")
        .select("id, name, price, image_url, hover_image_url, slug")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al cargar mobiliario:", error);
      }

      if (data) {
        setProducts(data as ProductGridData[]);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="w-full max-w-[1600px] mx-auto px-5 md:px-8 py-24 flex justify-center items-center">
        <p className="text-zinc-500 uppercase tracking-wider text-sm animate-pulse">
          Cargando catálogo...
        </p>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[1600px] mx-auto px-5 md:px-8 py-16 md:py-20">
      <h1 className="text-2xl font-light tracking-wider text-epico-dark mb-10">
        Mobiliario / Productos
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
        {products.map((product, index) => {
          // Determinamos si este producto específico tiene el estado "activo" por touch
          const isActive = activeTouchId === product.id;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: (index % 3) * 0.1,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="relative w-full flex flex-col group"
            >
              {/* --- TÍTULO PARA MOBILE / TABLET (Visible arriba de la foto) --- */}
              <div className="lg:hidden mb-4">
                <h3 className="text-[14px] font-light  tracking-wider text-gray-900">
                  {product.name}
                </h3>
              </div>

              {/* --- CONTENEDOR DE LA IMAGEN E INTERACTIVIDAD --- */}
              <div
                className="relative w-full aspect-square bg-zinc-100 overflow-hidden cursor-pointer shadow-lg shadow-black/40 "
                // Lógica de Desktop (Hover normal)
                onMouseEnter={() => {
                  // Si estamos en un dispositivo con mouse (width >= 1024 típicamente),
                  // limpiamos el estado táctil para no interferir
                  if (window.innerWidth >= 1024) setActiveTouchId(null);
                }}
                // Lógica de Mobile/Tablet (Doble Tap)
                onClick={(e) => {
                  e.preventDefault(); // Evitamos que el Link actúe de inmediato

                  // Si es Desktop, navegamos de inmediato
                  if (window.innerWidth >= 1024) {
                    router.push(`/mobiliario/${product.slug}`);
                    return;
                  }

                  // Si es Mobile/Tablet y es el PRIMER tap
                  if (!isActive) {
                    setActiveTouchId(product.id);
                  }
                  // Si es el SEGUNDO tap (ya estaba activo)
                  else {
                    router.push(`/mobiliario/${product.slug}`);
                  }
                }}
              >
                {/* 1. Imagen Principal */}
                {product.image_url && (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`object-cover transition-opacity duration-700 ease-in-out  ${
                      // Desktop Hover o Mobile Active
                      product.hover_image_url && isActive
                        ? "opacity-0 lg:group-hover:opacity-0"
                        : !product.hover_image_url && isActive
                          ? "scale-105 "
                          : "l" // Fallback para cuando no hay hover_img
                    }`}
                  />
                )}

                {/* 2. Imagen Secundaria (Swap) */}
                {product.hover_image_url && (
                  <Image
                    src={product.hover_image_url}
                    alt={`${product.name} vista real`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`object-cover absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      isActive
                        ? "opacity-100"
                        : "opacity-0 lg:group-hover:opacity-100"
                    }`}
                  />
                )}

                {/* 3. Capa de Información (Desktop Hover / Mobile Active) */}
                <div
                  className={`absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-all duration-500 flex flex-col justify-end z-10
                    ${
                      isActive
                        ? "translate-y-0 opacity-100" // Activo en móvil
                        : "translate-y-4 opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100" // Desktop hover
                    }
                  `}
                >
                  {/* Título interno (Solo visible en Desktop, oculto en Mobile) */}
                  <h3 className="hidden lg:block text-white text-3xl font-medium tracking-tight mb-1">
                    {product.name}
                  </h3>

                  <p className="text-zinc-300 text-sm font-light tracking-wider uppercase">
                    {product.price
                      ? `$${Number(product.price).toLocaleString()} COP`
                      : "Consultar precio"}
                  </p>

                  {/* Instrucción sutil en móvil para indicar el segundo tap */}
                  <p className="lg:hidden text-white/60 text-[10px] mt-2 tracking-wider uppercase">
                    Toca de nuevo para ver
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
