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
        <p className="text-sm uppercase tracking-wider text-gray-400 animate-pulse">
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
        <ProjectGrid projects={projects} />
      </div>

      <Footer />
    </main>
  );
}
