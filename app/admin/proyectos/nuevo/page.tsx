"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/supabase";
import imageCompression from "browser-image-compression";

export default function NuevoProyecto() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Estados de datos (Categoría eliminada)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    year: "",
    location: "",
    description: "",
  });

  // Estados de archivos
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  // Autogenerar slug
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title" && {
        slug: value
          .toLowerCase()
          .trim()
          .replace(/[\s_]+/g, "-")
          .replace(/[^\w\-]+/g, ""),
      }),
    }));
  };

  // Manejo de la galería
  const handleGalleryAdd = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setGalleryFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  // --- FUNCIÓN DE COMPRESIÓN A WEBP ---
  const uploadFileToStorage = async (
    file: File,
    folder: string,
  ): Promise<string> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: false, // <-- IMPORTANTE: Cambiado a false para evitar Timeout
      fileType: "image/webp",
      initialQuality: 0.95,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const fileName = `${Math.random().toString(36).substring(2, 15)}.webp`;
      const filePath = `proyectos/${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("epico-images")
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("epico-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error al comprimir o subir la imagen:", error);
      throw error;
    }
  };
  // ------------------------------------

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!coverFile) throw new Error("La imagen de portada es obligatoria.");
      if (!formData.slug) throw new Error("El slug es obligatorio.");

      let coverUrl = "";
      const galleryUrls: string[] = [];

      // 1. Subir imagen de portada comprimida
      setLoadingText("Comprimiendo y subiendo portada...");
      coverUrl = await uploadFileToStorage(coverFile, "covers");

      // 2. Subir imágenes de galería comprimidas
      if (galleryFiles.length > 0) {
        setLoadingText(
          `Comprimiendo y subiendo ${galleryFiles.length} fotos de galería...`,
        );
        for (let i = 0; i < galleryFiles.length; i++) {
          const url = await uploadFileToStorage(galleryFiles[i], "gallery");
          galleryUrls.push(url);
        }
      }

      // 3. Insertar en la tabla 'proyectos'
      setLoadingText("Guardando proyecto en base de datos...");
      const { error: insertError } = await supabase.from("proyectos").insert([
        {
          title: formData.title,
          slug: formData.slug,
          year: formData.year,
          location: formData.location,
          description: formData.description,
          image_url: coverUrl,
          gallery_urls: galleryUrls,
        },
      ]);

      if (insertError) throw insertError;

      setLoadingText("¡Proyecto publicado!");
      router.push("/admin/proyectos");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al publicar el proyecto.");
      }
      setLoading(false);
      setLoadingText("");
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F5F2] text-[#423C35] font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white border border-[#E4DFD5] p-8 md:p-10 shadow-sm rounded-xl">
        <header className="mb-10 border-b border-[#E4DFD5] pb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-[#332D26]">
              Añadir Proyecto
            </h1>
            <p className="text-xs text-[#827A70] mt-1">
              Carga de metadatos y galerías para el portafolio arquitectónico.
            </p>
          </div>
          <Link
            href="/admin/proyectos"
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
                Nombre del Proyecto *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej: Casa Llanogrande"
                className="w-full bg-[#FAFAF9] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md focus:outline-none focus:border-epico-blue transition-colors text-[#332D26]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#6A6258] mb-2 font-medium">
                URL Slug (Automático) *
              </label>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                readOnly
                placeholder="casa-llanogrande"
                className="w-full bg-[#ECE9E2] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md focus:outline-none text-[#554E45] font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#6A6258] mb-2 font-medium">
                Año
              </label>
              <input
                type="text"
                name="year"
                required
                value={formData.year}
                onChange={handleChange}
                placeholder="Ej: 2024"
                className="w-full bg-[#FAFAF9] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md focus:outline-none focus:border-epico-blue transition-colors text-[#332D26]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#6A6258] mb-2 font-medium">
                Ubicación
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="Ej: Rionegro, Antioquia"
                className="w-full bg-[#FAFAF9] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md focus:outline-none focus:border-epico-blue transition-colors text-[#332D26]"
              />
            </div>

            {/* DESCRIPCIÓN */}
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-[#6A6258] mb-2 font-medium">
                Descripción del Proyecto
              </label>
              <textarea
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Escribe los detalles arquitectónicos del proyecto..."
                className="w-full bg-[#FAFAF9] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md focus:outline-none focus:border-epico-blue transition-colors text-[#332D26] resize-none"
              />
            </div>
          </div>

          {/* SECCIÓN 2: ARCHIVOS MULTIMEDIA */}
          <div className="border-t border-[#E4DFD5] pt-8">
            <h2 className="text-sm font-medium uppercase tracking-wider text-[#332D26] mb-6">
              Subir Archivos Multimedia
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Box 1: Imagen Principal */}
              <div className="bg-white border border-zinc-200 p-6 rounded-xl flex flex-col justify-between shadow-sm md:col-span-2">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="block text-xs font-semibold text-[#332D26]">
                      Imagen de Portada *
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Imagen principal del proyecto
                    </span>
                  </div>
                  <label className="bg-epico-blue text-white text-[10px] uppercase tracking-widest font-medium px-4 py-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity w-max">
                    Elegir Archivo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      required
                      onChange={(e) =>
                        setCoverFile(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                  {coverFile ? (
                    <>
                      <div className="relative w-16 h-10 rounded overflow-hidden flex-shrink-0 border border-zinc-200">
                        <Image
                          src={URL.createObjectURL(coverFile)}
                          alt="Cover"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-epico-blue truncate">
                        {coverFile.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-[11px] text-zinc-400">
                      Sin archivo seleccionado
                    </span>
                  )}
                </div>
              </div>

              {/* Box 2: Galería */}
              <div className="md:col-span-2 bg-white border border-zinc-200 p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <span className="block text-xs font-semibold text-[#332D26]">
                      Galería del Proyecto
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Añade fotos para el carrusel
                    </span>
                  </div>
                  <label className="bg-epico-blue text-white text-[10px] uppercase tracking-widest font-medium px-4 py-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity w-max">
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

                {galleryFiles.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                    {galleryFiles.map((file, idx) => (
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
            </div>
          </div>

          {/* BOTÓN DE GUARDADO */}
          <div className="border-t border-[#E4DFD5] pt-6 flex justify-end items-center gap-4">
            {loading && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-epico-blue animate-pulse">
                {loadingText}
              </span>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-epico-blue text-white font-medium px-8 py-4 text-xs uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-3 rounded-md shadow-sm cursor-pointer"
            >
              {loading ? "Publicando..." : "Publicar Proyecto"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
