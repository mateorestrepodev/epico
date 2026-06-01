// components/mobiliario/ProductGrid.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/supabase";

// Definimos la interfaz actualizada con los nuevos campos de la base de datos
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

  // Petición a Supabase al cargar el componente
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
        <p className="text-zinc-500 uppercase tracking-widest text-sm animate-pulse">
          Cargando catálogo...
        </p>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[1600px] mx-auto  px-5 md:px-8 pb-24 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
        {products.map((product, index) => (
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
            className="relative w-full group cursor-pointer aspect-square bg-zinc-900 overflow-hidden block"
          >
            {/* El Link envuelve toda la tarjeta para llevarnos al detalle del producto */}
            <Link
              href={`/mobiliario/${product.slug}`}
              className="block w-full h-full"
            >
              {/* 1. Imagen Principal (Base) */}
              {product.image_url && (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`object-cover transition-opacity duration-700 ease-in-out ${
                    product.hover_image_url
                      ? "group-hover:opacity-0"
                      : "group-hover:scale-105"
                  }`}
                />
              )}

              {/* 2. Imagen Hover (Swap) - Solo se renderiza si existe en la BD */}
              {product.hover_image_url && (
                <Image
                  src={product.hover_image_url}
                  alt={`${product.name} vista real`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover absolute inset-0 opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
                />
              )}

              {/* Capa de Información con Gradiente Oscuro */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end z-10">
                <h3 className="text-white text-2xl md:text-3xl font-medium tracking-tight mb-1">
                  {product.name}
                </h3>
                <p className="text-zinc-300 text-sm font-light tracking-wider uppercase">
                  {product.price
                    ? `$${Number(product.price).toLocaleString()} COP`
                    : "Consultar precio"}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
