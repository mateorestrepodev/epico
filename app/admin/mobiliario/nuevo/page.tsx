"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/supabase";

export default function NuevoMueblePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados del Formulario
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [colors, setColors] = useState("");

  // Estados de Archivos
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [hoverImage, setHoverImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]); // Usamos array para poder manipularlos
  const [model3d, setModel3d] = useState<File | null>(null);

  // Helper para generar el slug automáticamente
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, "-") // Reemplaza espacios por guiones
      .replace(/[^\w\-]+/g, ""); // Remueve caracteres especiales
    setSlug(generatedSlug);
  };

  // --- Lógicas de Galería Múltiple ---
  const handleGalleryAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setGalleryImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };
  // -------------------------------------

  // Helper asíncrono para subir un archivo individual a Supabase Storage
  const uploadFileToStorage = async (
    file: File,
    folder: string,
  ): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `mobiliario/${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("epico-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("epico-images")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!mainImage)
        throw new Error("La imagen principal (Render/Base) es obligatoria.");
      if (!slug)
        throw new Error("El slug es obligatorio para la URL del producto.");

      // 1. Subir Imagen Principal
      const imageUrl = await uploadFileToStorage(mainImage, "main");

      // 2. Subir Imagen Hover (Opcional)
      let hoverImageUrl = null;
      if (hoverImage) {
        hoverImageUrl = await uploadFileToStorage(hoverImage, "hover");
      }

      // 3. Subir Archivo 3D (.glb/.gltf) (Opcional)
      let modelUrl = null;
      if (model3d) {
        modelUrl = await uploadFileToStorage(model3d, "models");
      }

      // 4. Subir Imágenes de la Galería (Masivo)
      const galleryUrls: string[] = [];
      if (galleryImages && galleryImages.length > 0) {
        for (let i = 0; i < galleryImages.length; i++) {
          const url = await uploadFileToStorage(galleryImages[i], "gallery");
          galleryUrls.push(url);
        }
      }

      // 5. Formatear colores/acabados (Separados por coma)
      const colorsArray = colors
        ? colors
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [];

      // 6. Insertar registro definitivo en la tabla de Supabase
      const { error: insertError } = await supabase.from("mobiliario").insert([
        {
          name,
          slug,
          price: price ? parseFloat(price) : null,
          description,
          colors: colorsArray,
          image_url: imageUrl,
          hover_image_url: hoverImageUrl,
          gallery: galleryUrls,
          model_url: modelUrl,
        },
      ]);

      if (insertError) throw insertError;

      // Éxito: Redirigimos al catálogo del panel
      router.push("/admin/mobiliario");
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al subir el producto.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F5F2] text-[#423C35] font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-background border border-[#E4DFD5] p-8 md:p-10 shadow-sm rounded-xl">
        {/* Cabecera */}
        <header className="mb-10 border-b border-[#E4DFD5] pb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-[#332D26]">
              Añadir Pieza de Mobiliario
            </h1>
            <p className="text-xs text-[#827A70] mt-1">
              Carga de metadatos, galerías multimedia y archivos volumétricos
              3D.
            </p>
          </div>
          <Link
            href="/admin/mobiliario"
            className="text-xs uppercase tracking-wider text-[#827A70] hover:text-[#332D26] transition-colors"
          >
            ← Cancelar
          </Link>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECCIÓN 1: DATOS BÁSICOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#6A6258] mb-2 font-medium">
                Nombre del Producto *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={handleNameChange}
                placeholder="Ej: Silla Vela"
                className="w-full bg-[#FAFAF9] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md focus:outline-none focus:border-epico-blue transition-colors text-[#332D26]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#6A6258] mb-2 font-medium">
                URL Slug (Automático) *
              </label>
              <input
                type="text"
                required
                value={slug}
                readOnly
                placeholder="silla-vela"
                className="w-full bg-[#ECE9E2] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md focus:outline-none text-[#554E45] font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#6A6258] mb-2 font-medium">
                Precio (COP)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ej: 1140000"
                className="w-full bg-[#FAFAF9] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md focus:outline-none focus:border-epico-blue transition-colors text-[#332D26]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#6A6258] mb-2 font-medium">
                Acabados / Colores (Separados por coma)
              </label>
              <input
                type="text"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                placeholder="Roble Macizo, Negro Mate, Nogal"
                className="w-full bg-[#FAFAF9] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md focus:outline-none focus:border-epico-blue transition-colors text-[#332D26]"
              />
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#6A6258] mb-2 font-medium">
              Descripción Técnica
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Escribe los detalles de la estructura, madera, terminaciones..."
              className="w-full bg-[#FAFAF9] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md focus:outline-none focus:border-epico-blue transition-colors text-[#332D26] resize-none"
            />
          </div>

          {/* SECCIÓN 2: ARCHIVOS MULTIMEDIA REDISEÑADA */}
          <div className="border-t border-[#E4DFD5] pt-8">
            <h2 className="text-sm font-medium uppercase tracking-wider text-[#332D26] mb-6">
              Subir Archivos Multimedia
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Box 1: Imagen Principal */}
              <div className="bg-background border border-zinc-200 p-6 rounded-xl flex flex-col justify-between shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="block text-xs font-semibold text-[#332D26]">
                      Imagen Principal *
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Portada del producto
                    </span>
                  </div>
                  <label className="bg-epico-blue text-white text-[10px] uppercase tracking-wider font-medium px-4 py-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity w-max">
                    Elegir Archivo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setMainImage(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                  {mainImage ? (
                    <>
                      <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-zinc-200">
                        <Image
                          src={URL.createObjectURL(mainImage)}
                          alt="Main"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-epico-blue truncate">
                        {mainImage.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-[11px] text-zinc-400">
                      Sin archivo seleccionado
                    </span>
                  )}
                </div>
              </div>

              {/* Box 2: Imagen Hover */}
              <div className="bg-background border border-zinc-200 p-6 rounded-xl flex flex-col justify-between shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="block text-xs font-semibold text-[#332D26]">
                      Imagen Hover
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Al pasar el mouse
                    </span>
                  </div>
                  <label className="bg-epico-blue text-white text-[10px] uppercase tracking-wider font-medium px-4 py-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity w-max">
                    Elegir Archivo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setHoverImage(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                  {hoverImage ? (
                    <>
                      <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-zinc-200">
                        <Image
                          src={URL.createObjectURL(hoverImage)}
                          alt="Hover"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-epico-blue truncate">
                        {hoverImage.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-[11px] text-zinc-400">Opcional</span>
                  )}
                </div>
              </div>

              {/* Box 3: Galería (Ocupa 2 columnas) */}
              <div className="md:col-span-2 bg-background border border-zinc-200 p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <span className="block text-xs font-semibold text-[#332D26]">
                      Galería Múltiple
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Añade fotos para el carrusel
                    </span>
                  </div>
                  <label className="bg-epico-blue text-white text-[10px] uppercase tracking-wider font-medium px-4 py-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity w-max">
                    Elegir Archivos
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleGalleryAdd}
                    />
                  </label>
                </div>

                {/* Grid de Miniaturas de la Galería por subir */}
                {galleryImages.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                    {galleryImages.map((file, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-md overflow-hidden border border-zinc-200 group"
                      >
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Gallery ${idx}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1 right-1 bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100 text-center">
                    <span className="text-[11px] text-zinc-400">
                      No has seleccionado imágenes para la galería
                    </span>
                  </div>
                )}
              </div>

              {/* Box 4: Modelo 3D (Ocupa 2 columnas) */}
              <div className="md:col-span-2 bg-background border border-zinc-200 p-6 rounded-xl flex flex-col justify-between shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="block text-xs font-semibold text-[#332D26]">
                      Modelo 3D (.glb)
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Archivo interactivo para el visor
                    </span>
                  </div>
                  <label className="bg-epico-blue text-white text-[10px] uppercase tracking-wider font-medium px-4 py-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity w-max">
                    Elegir Archivo
                    <input
                      type="file"
                      accept=".glb,.gltf"
                      className="hidden"
                      onChange={(e) => setModel3d(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                  {model3d ? (
                    <>
                      <div className="w-10 h-10 bg-epico-blue/10 rounded flex items-center justify-center flex-shrink-0">
                        <svg
                          width="20"
                          height="20"
                          className="text-epico-blue"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                          <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                      </div>
                      <span className="text-[11px] font-medium text-epico-blue truncate">
                        {model3d.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-[11px] text-zinc-400">
                      Sin archivo seleccionado
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* BOTÓN DE GUARDADO */}
          <div className="border-t border-[#E4DFD5] pt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-epico-blue text-white font-medium px-8 py-4 text-xs uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-3 rounded-md shadow-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Subiendo Producto...
                </>
              ) : (
                "Publicar en Catálogo"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
