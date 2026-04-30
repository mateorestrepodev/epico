// components/mobiliario/ProductGrid.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Modal3D, { ProductData } from "../3d/Modal3D";
import { supabase } from "@/lib/supabase/supabase"; // <-- IMPORTAMOS SUPABASE

export default function ProductGrid() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(
    null,
  );

  // Petición a Supabase al cargar el componente
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("mobiliario")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al cargar mobiliario:", error);
      }

      if (data) {
        setProducts(data as ProductData[]);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  const open3DViewer = (product: ProductData) => setSelectedProduct(product);
  const close3DViewer = () => setSelectedProduct(null);

  if (loading) {
    return (
      <section className="w-full max-w-[1600px] mx-auto px-5 md:px-8 py-24 flex justify-center items-center">
        <p className="text-gray-500 uppercase tracking-widest text-sm animate-pulse">
          Cargando catálogo...
        </p>
      </section>
    );
  }

  return (
    <>
      {/* Contenedor exacto al de Proyectos */}
      <section className="w-full max-w-[1600px] mx-auto bg-background px-5 md:px-8 pb-24 md:pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              onClick={() => open3DViewer(product)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: (index % 3) * 0.1,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="relative w-full group cursor-pointer aspect-square bg-gray-100 overflow-hidden block"
            >
              {/* NOTA: Usamos image_url porque así se llama la columna en Supabase */}
              {product.image_url && (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105 "
                />
              )}

              <div className="absolute inset-0 bg-epico-blue/70 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 md:p-10 z-10">
                <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <span className="text-white/70 text-[10px] md:text-xs tracking-widest uppercase mb-2 block font-semibold">
                    Ver en 3D
                  </span>
                  <h3 className="text-white text-3xl md:text-4xl font-medium tracking-tight">
                    {product.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Visor 3D Condicional */}
      <Modal3D
        isVisible={selectedProduct !== null}
        onClose={close3DViewer}
        product={selectedProduct}
      />
    </>
  );
}
