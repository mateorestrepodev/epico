// components/proyectos/ProjectGrid.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Definimos la estructura exacta de la tabla "proyectos" en Supabase
export interface ProjectData {
  id: number;
  slug: string;
  title: string;
  year: string;
  category: string;
  city: string; // <-- AÑADIDO: Asegúrate de que tu BD devuelva esto
  image_url: string;
  gallery_urls?: string[];
}

export default function ProjectGrid({ projects }: { projects: ProjectData[] }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="w-full max-w-[1600px] mx-auto bg-background px-6 md:px-10 py-24 md:py-32">
      {/* Cuadrícula de 2 columnas en lugar de 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 lg:gap-x-12 lg:gap-y-20">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.6,
              delay: (index % 2) * 0.1, // Cambiado a % 2 por las 2 columnas
              ease: [0.76, 0, 0.24, 1],
            }}
            className="group flex flex-col"
          >
            {/* Info Arriba: Nombre y Ciudad */}
            <div className="mb-4">
              <h3 className="text-sm  font-bold uppercase tracking-widest text-gray-900">
                {project.title}
              </h3>
              <p className="text-[10px]  uppercase tracking-[0.2em] text-gray-500 mt-1 font-medium">
                {project.city || "Ubicación"}
              </p>
            </div>

            {/* Imagen con Hover Azul */}
            <Link
              href={`/proyectos/${project.slug}`}
              className="relative w-full aspect-[3/2] bg-gray-100 overflow-hidden block cursor-pointer"
            >
              {project.image_url && (
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                  className="object-cover transition-transform duration-1000 "
                />
              )}

              {/* Overlay Azul Épico Hover */}
              <div className="absolute inset-0 bg-epico-blue/0 group-hover:bg-epico-blue/80 transition-colors duration-500 flex items-center justify-center z-10">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-all duration-500 text-xs md:text-sm tracking-[0.2em] uppercase font-medium translate-y-4 group-hover:translate-y-0 transform">
                  Ir al proyecto
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
