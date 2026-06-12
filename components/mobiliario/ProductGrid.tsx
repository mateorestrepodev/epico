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

interface ProductGridProps {
  categoria: string;
}

export default function ProductGrid({ categoria }: ProductGridProps) {
  const [products, setProducts] = useState<ProductGridData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTouchId, setActiveTouchId] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);

      let query = supabase
        .from("mobiliario")
        .select("id, name, price, image_url, hover_image_url, slug")
        .order("created_at", { ascending: false });

      if (categoria && categoria !== "Todos") {
        query = query.eq("category", categoria);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error al cargar mobiliario:", error);
      }

      if (data) {
        setProducts(data as ProductGridData[]);
      }
      setLoading(false);
    }

    fetchProducts();
  }, [categoria]);

  if (loading) {
    return (
      <section className="w-full max-w-[1600px] mx-auto px-5 md:px-8 pt-20 pb-32 flex justify-center items-center">
        <p className="text-zinc-500 uppercase tracking-wider text-sm animate-pulse">
          Cargando catálogo...
        </p>
      </section>
    );
  }

  // Estado Vacío - Ajuste de padding para no verse "perdido" en la pantalla
  if (!loading && products.length === 0) {
    return (
      <section className="w-full max-w-[1600px] mx-auto px-5 md:px-8 pt-20 pb-32 flex flex-col justify-center items-center text-center">
        <h2 className="text-2xl font-light text-epico-dark mb-4">
          Nuevas piezas en camino
        </h2>
        <p className="text-zinc-500 max-w-md font-light leading-relaxed">
          Actualmente estamos diseñando y fabricando nuevas piezas para la
          categoría{" "}
          <span className="font-medium text-black uppercase tracking-wider text-xs">
            {categoria}
          </span>
          . Vuelve pronto para descubrir nuestras novedades.
        </p>
      </section>
    );
  }

  return (
    // Redujimos el padding top (pt-8) para acercar el contenido a las pestañas
    <section className="w-full max-w-[1600px] mx-auto px-5 md:px-8 pt-8 pb-20">
      <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-light tracking-wider text-epico-dark">
          {categoria === "Todos" ? "Catálogo Completo" : categoria}
        </h1>
        <span className="text-xs text-zinc-400 uppercase tracking-widest hidden md:block">
          {products.length} {products.length === 1 ? "Pieza" : "Piezas"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
        {products.map((product, index) => {
          const isActive = activeTouchId === product.id;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: (index % 3) * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="relative w-full flex flex-col group"
            >
              <div className="lg:hidden mb-4 flex justify-between items-baseline">
                <h3 className="text-[14px] font-medium tracking-wider text-gray-900">
                  {product.name}
                </h3>
                <span className="text-[11px] text-zinc-500 tracking-wider">
                  {product.price
                    ? `$${Number(product.price).toLocaleString()} COP`
                    : "Consultar"}
                </span>
              </div>

              <div
                className="relative w-full aspect-square bg-zinc-100 overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-500"
                onMouseEnter={() => {
                  if (window.innerWidth >= 1024) setActiveTouchId(null);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  if (window.innerWidth >= 1024) {
                    router.push(`/mobiliario/${product.slug}`);
                    return;
                  }
                  if (!isActive) {
                    setActiveTouchId(product.id);
                  } else {
                    router.push(`/mobiliario/${product.slug}`);
                  }
                }}
              >
                {product.image_url && (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`object-cover transition-all duration-700 ease-in-out ${
                      product.hover_image_url && isActive
                        ? "opacity-0 lg:group-hover:opacity-0"
                        : !product.hover_image_url && isActive
                          ? "scale-105"
                          : "opacity-100"
                    }`}
                  />
                )}

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

                <div
                  className={`absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-all duration-500 flex flex-col justify-end z-10
                    ${
                      isActive
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
                    }
                  `}
                >
                  <h3 className="hidden lg:block text-white text-3xl font-medium tracking-tight mb-1 drop-shadow-sm">
                    {product.name}
                  </h3>
                  <p className="hidden lg:block text-zinc-200 text-sm font-light tracking-wider uppercase drop-shadow-sm">
                    {product.price
                      ? `Desde $${Number(product.price).toLocaleString()} COP`
                      : "Consultar precio"}
                  </p>
                  <p className="lg:hidden text-white text-[11px] font-medium tracking-wider uppercase drop-shadow-md">
                    Toca de nuevo para ver detalles
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
