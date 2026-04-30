// app/mobiliario/page.tsx
import Image from "next/image";
import InnerNavbar from "@/components/layout/InnerNavbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/mobiliario/ProductGrid";

export default function MobiliarioPage() {
  return (
    <main className="w-full bg-background min-h-screen flex flex-col">
      {/* Navegación Interna */}
      <InnerNavbar />

      {/* 1. Sección Hero (Sofá) */}
      <section className="relative w-full h-[60vh] md:h-screen">
        <Image
          src="/mobiliario.jpg"
          alt="Mobiliario ēpico"
          fill
          priority
          className="object-cover object-center"
        />
      </section>

      {/* 2. Sección de Texto (Manifiesto) */}
      <section className="w-full max-w-5xl mx-auto px-6 py-20 md:py-32 flex justify-center text-center">
        <p className="text-base md:text-xl lg:text-2xl font-medium leading-relaxed tracking-tight text-foreground">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
          nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
          volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
          ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
          Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse
          molestie consequat.
        </p>
      </section>

      {/* 3. Grid de Productos Modularizado */}
      <ProductGrid />
      <Footer />
    </main>
  );
}
