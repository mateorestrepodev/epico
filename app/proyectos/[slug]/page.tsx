// app/proyectos/[slug]/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/supabase";
import InnerNavbar from "@/components/layout/InnerNavbar";
import Footer from "@/components/layout/Footer";
import ProyectosGallery from "@/components/proyectos/ProyectosGallery";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

// === NUEVA FUNCIÓN PARA SEO DINÁMICO ===
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const cleanSlug = decodeURIComponent(resolvedParams.slug);

  const { data: project } = await supabase
    .from("proyectos")
    .select("title, description, image_url")
    .eq("slug", cleanSlug)
    .single();

  if (!project) return { title: "Proyecto no encontrado" };

  const cleanDescription = project.description
    ? project.description.substring(0, 160).replace(/\n/g, " ") + "..."
    : `Explora el proyecto ${project.title} desarrollado por Estudio ēpico.`;

  return {
    title: project.title,
    description: cleanDescription,
    openGraph: {
      title: `${project.title} | Estudio ēpico Proyectos`,
      description: cleanDescription,
      images: [
        {
          url: project.image_url,
          width: 1920,
          height: 1080,
          alt: project.title,
        },
      ],
    },
  };
}

export default async function ProyectoDetalle({ params }: Props) {
  const resolvedParams = await params;
  const cleanSlug = decodeURIComponent(resolvedParams.slug);

  const { data: proyecto, error } = await supabase
    .from("proyectos")
    .select("*")
    .eq("slug", cleanSlug)
    .single();

  if (error || !proyecto) {
    notFound();
  }

  // Extraemos la galería asegurándonos de que no haya URLs vacías
  const galeriaUrls: string[] = (proyecto.gallery_urls || []).filter(
    (url: string) => url && typeof url === "string" && url.trim() !== "",
  );

  // La galería mostrará: [Imagen Desktop] + [Fotos de la Galería]
  // NOTA: No incluimos la imagen móvil aquí para no duplicar contenido.
  const todasLasImagenes = [proyecto.image_url, ...galeriaUrls].filter(
    (img): img is string => typeof img === "string" && img.trim() !== "",
  );

  const heroImageDesktop = proyecto.image_url || null;
  // Si no suben imagen móvil en el panel admin, usamos la de desktop como respaldo inteligente
  const heroImageMobile = proyecto.image_mobile_url || heroImageDesktop;

  return (
    <main className="relative w-full min-h-screen bg-background overflow-x-hidden flex flex-col">
      <InnerNavbar theme="dark" />

      {/* 1. HERO: Altura 100svh para evitar el salto en móviles */}
      {heroImageDesktop ? (
        <section className="relative w-full h-[100svh] bg-[#111]">
          {/* IMAGEN DESKTOP / TABLET (Se oculta en celulares con md:block) */}
          <Image
            src={heroImageDesktop}
            alt={`Portada de ${proyecto.title}`}
            fill
            priority
            sizes="100vw" // CORREGIDO: 100vw para ultra alta resolución
            className="object-cover object-center hidden md:block opacity-90"
          />

          {/* IMAGEN MOBILE (Se muestra solo en celulares con md:hidden) */}
          <Image
            src={heroImageMobile}
            alt={`Portada de ${proyecto.title} Mobile`}
            fill
            priority
            sizes="100vw" // CORREGIDO: 100vw para ultra alta resolución
            className="object-cover object-center md:hidden opacity-90"
          />

          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </section>
      ) : (
        <section className="relative w-full h-[100svh] bg-epico-dark" />
      )}

      {/* 2. FRANJA BLANCA: Título */}
      <section className="w-full bg-background py-8 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-xl md:text-2xl font-semibold uppercase tracking-widest text-epico-dark">
          {proyecto.title}
        </h1>
      </section>

      {/* 3. GALERÍA */}
      <section className="w-full px-4 md:px-10 pb-24 md:pb-40 max-w-[1600px] mx-auto flex-grow mt-2">
        <ProyectosGallery images={todasLasImagenes} title={proyecto.title} />
      </section>

      <Footer />
    </main>
  );
}
