// app/proyectos/[slug]/page.tsx
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

  const galeriaUrls: string[] = (proyecto.gallery_urls || []).filter(
    (url: string) => url && typeof url === "string" && url.trim() !== "",
  );

  const todasLasImagenes = [proyecto.image_url, ...galeriaUrls].filter(
    (img): img is string => typeof img === "string" && img.trim() !== "",
  );

  const heroImageDesktop = proyecto.image_url || null;
  // Si no suben imagen móvil, usamos la de desktop como respaldo
  const heroImageMobile = proyecto.image_mobile_url || heroImageDesktop;

  return (
    <main className="relative w-full min-h-screen bg-background overflow-x-hidden flex flex-col">
      <InnerNavbar theme="dark" />

      {/* 1. HERO: Altura 100svh (Small Viewport Height) para evitar el salto en móviles */}
      {heroImageDesktop ? (
        <section className="relative w-full h-[100svh] bg-[#111]">
          {/* IMAGEN DESKTOP / TABLET */}
          <Image
            src={heroImageDesktop}
            alt={`Portada de ${proyecto.title}`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center hidden md:block opacity-90"
          />

          {/* IMAGEN MOBILE */}
          <Image
            src={heroImageMobile}
            alt={`Portada de ${proyecto.title} Mobile`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center md:hidden opacity-90"
          />

          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </section>
      ) : (
        <section className="relative w-full h-[100svh] bg-epico-dark" />
      )}

      {/* 2. FRANJA BLANCA: Solo título, empujado debajo del Hero */}
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
