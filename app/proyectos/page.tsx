// app/proyectos/page.tsx
import InnerNavbar from "@/components/layout/InnerNavbar";
import ProjectGrid from "@/components/proyectos/ProjectGrid";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase/supabase";

export const revalidate = 60; // Actualiza el caché cada minuto si hay nuevos proyectos

export default async function ProyectosPage() {
  // Cargamos los proyectos directamente en el servidor (Cero parpadeos)
  const { data, error } = await supabase
    .from("proyectos")
    .select("*")
    .order("created_at", { ascending: false });

  const projects = data || [];

  return (
    <main className="relative w-full min-h-screen bg-background overflow-x-hidden flex flex-col">
      <InnerNavbar theme="light" showCart={false} />

      <div className="flex-grow flex flex-col">
        <ProjectGrid projects={projects} />
      </div>

      <Footer />
    </main>
  );
}
