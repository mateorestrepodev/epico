// components/proyectos/ProjectGrid.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Definimos la estructura exacta de la tabla "proyectos" en Supabase
export interface ProjectData {
  id: number;
  title: string;
  year: string;
  category: string;
  image_url: string;
  gallery_urls: string[];
}

export default function ProjectGrid({ projects }: { projects: ProjectData[] }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="w-full max-w-[1600px] mx-auto bg-background px-5 md:px-8 pb-24 md:pb-40">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
        {projects.map((project, index) => (
          <Link href={`/proyectos/${project.id}`} key={project.id}>
            <motion.div
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
              {project.image_url && (
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105 "
                />
              )}

              {/* Overlay Azul Épico Hover */}
              <div className="absolute inset-0 bg-epico-blue/70 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 md:p-10 z-10">
                <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <span className="text-white/70 text-[10px] md:text-xs tracking-widest uppercase mb-2 block font-semibold">
                    {project.category} — {project.year}
                  </span>
                  <h3 className="text-white text-3xl md:text-4xl font-medium tracking-tight">
                    {project.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
