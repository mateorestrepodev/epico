"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

  return (
    <main className="relative w-full min-h-screen bg-background overflow-x-hidden flex flex-col">
      <InnerNavbar theme="light" showCart={false} />

      {/* Quitamos el pt-24 de aquí para que el azul llegue hasta el borde superior */}
      <div className="flex-grow flex flex-col">
        {/* 1. SECCIÓN SUPERIOR: min-h-screen para que ocupe toda la vista inicial */}
        <section className="relative w-full min-h-screen flex items-center justify-center bg-epico-blue px-6 pt-24 pb-20">
          {/* leading-relaxed ajusta el interlineado para que respire más */}
          <div className="text-center max-w-5xl leading-relaxed md:leading-[1.4]">
            {projects.map((project, i) => (
              <span key={project.id}>
                <Link
                  href={`/proyectos/${project.slug}`}
                  // Tamaños de texto reducidos para mayor elegancia
                  className="inline-block text-xl md:text-3xl lg:text-4xl font-light text-white transition-transform duration-300 hover:scale-105"
                >
                  {project.title}
                </Link>

                {/* Separador '/' adaptado al nuevo tamaño de texto */}
                {i < projects.length - 1 && (
                  <span className="text-white/80 mx-2 md:mx-3 text-xl md:text-3xl lg:text-4xl font-light align-middle">
                    {" / "}
                  </span>
                )}
              </span>
            ))}
          </div>
        </section>

        {/* 2. SECCIÓN DE CUADRÍCULA */}
        <ProjectGrid projects={projects} />
      </div>

      <Footer />
    </main>
  );
}
