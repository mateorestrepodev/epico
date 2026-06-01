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

  const heroImage =
    proyecto.image_url && proyecto.image_url.trim() !== ""
      ? proyecto.image_url
      : galeriaUrls.length > 0
        ? galeriaUrls[0]
        : null;

  return (
    <main className="relative w-full min-h-screen bg-background overflow-x-hidden flex flex-col">
      <InnerNavbar theme="dark" />

      {/* 1. HERO: Altura reducida (70vh en compu, 60vh en móvil) para que se asome la franja blanca */}
      {heroImage ? (
        <section className="relative w-full h-[60vh] md:h-[88vh] bg-[#111]">
          <Image
            src={heroImage}
            alt={`Portada de ${proyecto.title}`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-90"
          />
          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </section>
      ) : (
        <section className="relative w-full h-[40vh] md:h-[50vh] bg-epico-dark" />
      )}

      {/* 2. FRANJA BLANCA: Textos más pequeños y compactos */}
      <section className="w-full bg-background py-5 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-lg md:text-xl font-semibold uppercase tracking-widest text-epico-dark flex flex-wrap justify-center gap-2">
          <span>{proyecto.title}</span>
          {proyecto.year && (
            <span className="font-light text-gray-700">{proyecto.year}</span>
          )}
        </h1>
        {/* Se eliminó por completo el bloque que mostraba la categoría */}
      </section>

      {/* 3. GALERÍA: Ya sin el zoom en el hover */}
      <section className="w-full px-4 md:px-10 pb-24 md:pb-40 max-w-[1600px] mx-auto flex-grow mt-4">
        <ProyectosGallery images={todasLasImagenes} title={proyecto.title} />
      </section>

      <Footer />
    </main>
  );
}
