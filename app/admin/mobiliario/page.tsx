"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/supabase";

interface Mueble {
  id: number;
  name: string;
  category: string | null;
  price: number | null;
  image_url: string | null;
  slug: string;
}

export default function AdminMobiliarioDashboard() {
  const [mobiliario, setMobiliario] = useState<Mueble[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    const fetchMobiliario = async () => {
      try {
        const { data, error } = await supabase
          .from("mobiliario")
          .select("id, name, category, price, image_url, slug")
          .order("id", { ascending: false });

        if (error) throw error;
        setMobiliario(data || []);
      } catch (error) {
        console.error("Error cargando inventario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMobiliario();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar "${name}"? Esta acción no se puede deshacer.`,
    );

    if (!confirmar) return;

    setIsDeleting(id);
    try {
      const { error } = await supabase.from("mobiliario").delete().eq("id", id);
      if (error) throw error;
      setMobiliario((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Hubo un error al eliminar el producto.");
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-[#827A70] uppercase tracking-wider text-sm animate-pulse">
          Cargando inventario...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full text-[#423C35] font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b border-[#E4DFD5] pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-wider text-[#332D26] mb-1">
            Mobiliario
          </h1>
          <p className="text-sm text-[#827A70] tracking-wide">
            Gestión de catálogo de mobiliario
          </p>
        </div>
        <Link
          href="/admin/mobiliario/nuevo"
          className="bg-epico-blue text-white px-6 py-3 rounded-sm text-xs uppercase tracking-wider font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          + Nuevo Mueble
        </Link>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        {mobiliario.length > 0 ? (
          mobiliario.map((item) => (
            <div
              key={item.id}
              className="bg-background border border-[#E4DFD5] rounded-sm overflow-hidden flex flex-col group shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative aspect-[5/4] w-full bg-[#EBE7DF] overflow-hidden p-4">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover  transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[#827A70] text-xs uppercase tracking-widest">
                    Sin imagen
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between bg-background">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-lg text-[#332D26] truncate tracking-wide">
                      {item.name}
                    </h3>
                  </div>
                  {item.category && (
                    <span className="text-[10px] uppercase tracking-widest text-epico-blue font-semibold mb-2 block">
                      {item.category}
                    </span>
                  )}
                  <p className="text-[#827A70] text-sm font-normal tracking-wide">
                    {item.price
                      ? `$${Number(item.price).toLocaleString()} COP`
                      : "Precio variable / Sin precio"}
                  </p>
                </div>

                <div className="flex gap-3  pt-3  border-t border-gray-100">
                  <Link
                    href={`/admin/mobiliario/editar/${item.slug}`}
                    className="flex-1 text-center text-[10px] uppercase tracking-wider font-medium text-white transition-colors border border-[#D5CEC4]  py-2.5 rounded-sm bg-epico-blue"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    disabled={isDeleting === item.id}
                    className="flex-1 text-center text-[10px] uppercase tracking-wider font-medium text-red-600 hover:text-red-700 transition-colors border border-red-200 hover:border-red-300 bg-red-50 py-2.5 rounded-sm disabled:opacity-50 cursor-pointer"
                  >
                    {isDeleting === item.id ? "Borrando..." : "Eliminar"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full border border-dashed border-[#D5CEC4] rounded-sm p-16 flex flex-col justify-center items-center text-center bg-background shadow-sm">
            <p className="text-[#6A6258] text-sm mb-6 font-light">
              El catálogo de mobiliario está vacío o no hay productos
              registrados.
            </p>
            <Link
              href="/admin/mobiliario/nuevo"
              className="text-[#7B6E5F] text-xs uppercase tracking-wider font-medium border-b border-[#7B6E5F] hover:text-[#332D26] hover:border-[#332D26] pb-1 transition-colors"
            >
              Añadir tu primer producto
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
