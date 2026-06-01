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
    // 1. Cambiamos min-h-screen por h-screen y bloqueamos el scroll (overflow-hidden)
    <main className="relative w-full h-screen bg-background overflow-hidden flex flex-col">
      <InnerNavbar theme="light" />

      {/* 2. Este contenedor ocupa el espacio sobrante (flex-grow) y respeta el navbar (pt-24) */}
      <div className="flex-grow pt-28 pb-8 w-full mx-auto px-6 md:px-10 max-w-[1500px] overflow-hidden">
        <article className="h-full flex flex-col md:flex-row gap-8 lg:gap-16">
          {/* COLUMNA IZQUIERDA: Galería Visual (Fija, sin scroll global) */}
          <div className="w-full md:w-[60%] lg:w-[65%] h-full overflow-hidden">
            <DetalleMobiliarioGallery
              images={productImages}
              productName={product.name}
            />
          </div>

          {/* COLUMNA DERECHA: Datos y Acciones (CON SCROLL INTERNO) */}
          {/* 3. Agregamos overflow-y-auto y escondemos la barra si usas scrollbar-hide */}
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
            <p className="text-xl md:text-2xl tracking-wide font-light text-gray-800 mb-2">
              $
              {product.price
                ? Number(product.price).toLocaleString("es-CO")
                : "Cotizar"}{" "}
              COP
            </p>
            <p className="text-sm text-gray-700  font-light tracking-wide">
              Envío calculado al finalizar la compra.
            </p>

            <ProductActions product={product} />

            <div className="prose prose-sm prose-p:text-gray-600 prose-p:font-light prose-p:leading-relaxed max-w-none w-full text-left ">
              <p>
                {product.description ||
                  "Diseño atemporal con estructura en madera maciza. Equilibrio formal perfecto para cualquier espacio."}
              </p>
              <p className="mt-4 font-medium text-epico-dark">
                El tiempo de producción es de 30 a 35 días hábiles.
              </p>
            </div>

            {/* Si quieres que el footer solo aparezca al final de la descripción, 
                puedes ponerlo aquí. Por ahora, lo dejamos limpio. */}
          </div>
        </article>
      </div>
    </main>
  );
}
