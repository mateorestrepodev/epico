import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/supabase";
import DetalleMobiliarioGallery from "@/components/mobiliario/DetalleMobiliarioGallery";
import ProductActions from "@/components/mobiliario/ProductActions";
import InnerNavbar from "@/components/layout/InnerNavbar";
import Footer from "@/components/layout/Footer";

export const revalidate = 60;

export default async function DetalleMobiliarioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const { data: product, error } = await supabase
    .from("mobiliario")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !product) {
    notFound();
  }

  const rawImages = [product.image_url, ...(product.gallery || [])];
  const productImages = Array.from(new Set(rawImages)).filter(
    (img): img is string => typeof img === "string" && img.trim() !== "",
  );

  return (
    <main className="relative w-full h-screen bg-background overflow-hidden flex flex-col">
      <InnerNavbar theme="light" />

      <div className="flex-grow pt-28 pb-8 w-full mx-auto px-6 md:px-10 max-w-[1500px] overflow-hidden">
        <article className="h-full flex flex-col md:flex-row gap-8 lg:gap-16">
          {/* COLUMNA IZQUIERDA: Galería */}
          <div className="w-full md:w-[60%] lg:w-[65%] h-full overflow-hidden">
            <DetalleMobiliarioGallery
              images={productImages}
              productName={product.name}
            />
          </div>

          {/* COLUMNA DERECHA: Datos y Acciones (SCROLL INTERNO) */}
          <div className="w-full md:w-[40%] lg:w-[35%] h-full overflow-y-auto scrollbar-hide pb-20 pr-2 md:pr-6 flex flex-col items-start text-left">
            <Link
              href="/mobiliario"
              className="text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-epico-blue mb-8 transition-colors inline-block"
            >
              ← Volver al catálogo
            </Link>

            <h1 className="text-4xl md:text-5xl font-medium text-epico-dark mb-4 leading-none tracking-wide">
              {product.name}
            </h1>

            {/* El precio ahora se controla y se muestra DENTRO de ProductActions para que sea reactivo a las medidas */}
            <ProductActions product={product} />

            {/* AQUÍ OCURRE LA MAGIA DEL TEXTO: whitespace-pre-wrap respeta todos tus saltos de línea */}
            <div className="w-full text-left mt-6">
              <div className="whitespace-pre-wrap text-sm text-gray-600 font-light leading-relaxed">
                {product.description ||
                  "Diseño atemporal con estructura maciza."}
              </div>
              <p className="mt-6 font-medium text-xs uppercase tracking-widest text-epico-dark">
                El tiempo de producción es de 30 a 35 días hábiles.
              </p>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
