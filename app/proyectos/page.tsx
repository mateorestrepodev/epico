// app/proyectos/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import InnerNavbar from "@/components/layout/InnerNavbar";
import ProjectGrid, { ProjectData } from "@/components/proyectos/ProjectGrid";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase/supabase";

export default function ProyectosPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargamos los proyectos desde Supabase
  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from("proyectos")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProjects(data as ProjectData[]);
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm uppercase tracking-widest text-gray-400 animate-pulse">
          Cargando portafolio...
        </p>
      </div>
    );
  }

  // Tomamos los primeros 3 proyectos para la sección destacada
  const featuredProjects = projects.slice(0, 3);

  return (
    <main className="relative w-full min-h-screen bg-background overflow-x-hidden flex flex-col">
      <InnerNavbar theme="light" />

      <div className="pt-24">
        {/* 1. SECCIÓN SUPERIOR: 3 Proyectos Destacados (Editorial Layout) */}
        <section className="w-full max-w-[1600px] mx-auto px-5 md:px-8 mb-24 md:mb-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 h-auto md:h-[75vh]">
            {/* Proyecto Principal (Ocupa 8 columnas) */}
            {featuredProjects[0] && (
              <Link
                href={`/proyectos/${featuredProjects[0].id}`}
                className="relative md:col-span-8 h-[60vh] md:h-full bg-gray-100 overflow-hidden group cursor-pointer block"
              >
                <Image
                  src={featuredProjects[0].image_url}
                  alt={featuredProjects[0].title}
                  fill
                  className="object-cover transition-transform duration-1000 "
                />
                <div className="absolute inset-0 bg-epico-blue/70 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 md:p-12 z-10">
                  <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <span className="text-white/70 text-[10px] md:text-xs tracking-widest uppercase mb-2 block font-semibold">
                      {featuredProjects[0].category} —{" "}
                      {featuredProjects[0].year}
                    </span>
                    <h2 className="text-white text-4xl md:text-6xl font-medium tracking-tight">
                      {featuredProjects[0].title}
                    </h2>
                  </div>
                </div>
              </Link>
            )}

            {/* Proyectos Secundarios */}
            <div className="md:col-span-4 flex flex-col gap-5 md:gap-8 h-[100vh] md:h-full">
              {featuredProjects.slice(1, 3).map((project) => (
                <Link
                  href={`/proyectos/${project.id}`}
                  key={project.id}
                  className="relative h-1/2 bg-gray-200 overflow-hidden group cursor-pointer block"
                >
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-epico-blue/70 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-8 z-10">
                    <div className="translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <span className="text-white/70 text-[10px] tracking-widest uppercase mb-2 block font-semibold">
                        {project.category} — {project.year}
                      </span>
                      <h2 className="text-white text-2xl font-medium tracking-tight">
                        {project.title}
                      </h2>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 2. SECCIÓN MEDIA: Manifiesto */}
        <section className="w-full bg-epico-blue/5 py-24 md:py-40 px-5 md:px-8 mb-24 md:mb-32">
          <div className="max-w-5xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-epico-blue font-semibold mb-8 md:mb-12"
            >
              Nuestra Visión Espacial
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="text-3xl md:text-5xl font-medium tracking-tight text-epico-dark leading-[1.15]"
            >
              Diseñamos atmósferas con un propósito. Cada proyecto es una
              narrativa visual donde el mobiliario auténtico dialoga con la
              arquitectura para crear experiencias atemporales.
            </motion.h3>
          </div>
        </section>

        {/* 3. SECCIÓN INFERIOR: Grilla */}
        <div className="w-full max-w-[1600px] mx-auto px-5 md:px-8 mb-12">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-epico-dark">
            Portafolio Completo
          </h2>
        </div>

        {/* Le pasamos la lista entera a la grilla inferior */}
        <ProjectGrid projects={projects} />

        <Footer />
      </div>
    </main>
  );
}
