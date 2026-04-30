// app/proyectos/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; // <-- AÑADIDO
import { motion } from "framer-motion";
import InnerNavbar from "@/components/layout/InnerNavbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase/supabase";
import { ProjectData } from "@/components/proyectos/ProjectGrid";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = Number(params.id);

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSingleProject() {
      const { data, error } = await supabase
        .from("proyectos")
        .select("*")
        .eq("id", projectId)
        .single();

      if (!error && data) {
        setProject(data as ProjectData);
      }
      setLoading(false);
    }

    if (projectId) fetchSingleProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm uppercase tracking-widest text-gray-400 animate-pulse">
          Abriendo proyecto...
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background flex-col gap-4">
        <h1 className="text-2xl font-medium">Proyecto no encontrado</h1>
        {/* CORRECCIÓN AQUÍ: Usamos <Link> en lugar de <a> */}
        <Link
          href="/proyectos"
          className="text-epico-blue text-sm uppercase tracking-widest hover:underline"
        >
          Volver al portafolio
        </Link>
      </div>
    );
  }

  // Preparamos la galería asegurando que no falten imágenes para el layout Bento Box
  const galleryUrls = project.gallery_urls || [];
  const displayGallery = [
    project.image_url,
    ...(galleryUrls.length > 0 ? galleryUrls : [project.image_url]),
    project.image_url,
    project.image_url,
    project.image_url,
  ].slice(0, 5); // Cortamos a 5 exactas para el layout

  return (
    <main className="relative w-full min-h-screen bg-background overflow-x-hidden flex flex-col">
      <InnerNavbar theme="light" />

      <article className="pt-24 pb-24 md:pb-40 w-full mx-auto px-10">
        {/* CABECERA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-epico-dark leading-none">
            {project.title}
          </h1>
          <div className="md:max-w-xs md:text-right">
            <p className="text-[10px] md:text-xs tracking-widest uppercase text-epico-blue font-semibold mb-3">
              {project.category} • {project.year}
            </p>
            <p className="text-sm font-light text-gray-600 leading-relaxed">
              Capturando la esencia del diseño a través del mobiliario, la
              iluminación y la narrativa espacial de ēpico.
            </p>
          </div>
        </motion.div>

        {/* GALERÍA ESTILO BENTO BOX */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {displayGallery.map((src, i) => {
            const isLargeTopLeft = i === 0;
            const isVerticalTopRight = i === 1;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.76, 0, 0.24, 1],
                }}
                className={`relative bg-gray-200 overflow-hidden group ${
                  isLargeTopLeft
                    ? "md:col-span-2 aspect-[4/3] md:aspect-auto md:h-[400px]"
                    : isVerticalTopRight
                      ? "md:col-span-1 aspect-[3/4] md:aspect-auto md:h-[400px]"
                      : "md:col-span-1 aspect-square md:aspect-auto md:h-[250px]"
                }`}
              >
                {src && (
                  <Image
                    src={src}
                    alt={`${project.title} - Foto ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 50vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </article>

      <Footer />
    </main>
  );
}
