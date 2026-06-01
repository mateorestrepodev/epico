"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/supabase";
import imageCompression from "browser-image-compression";

export default function EditarProyecto() {
  const router = useRouter();
  const params = useParams();
  const slugParam =
    typeof params.slug === "string" ? decodeURIComponent(params.slug) : "";

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [projectId, setProjectId] = useState<number | null>(null);

  // Estados del Formulario (Textos) - Categoría eliminada
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [year, setYear] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  // Estados para URLs existentes
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);

  // Estados para Nuevos Archivos
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);

  // Cargar datos
  useEffect(() => {
    async function loadProject() {
      try {
        const { data, error } = await supabase
          .from("proyectos")
          .select("*")
          .eq("slug", slugParam)
          .single();

        if (error) throw error;
        if (data) {
          setProjectId(data.id);
          setTitle(data.title || "");
          setSlug(data.slug || "");
          setYear(data.year || "");
          setLocation(data.location || "");
          setDescription(data.description || "");

          setExistingCoverUrl(data.image_url);
          setExistingGalleryUrls(data.gallery_urls || []);
        }
      } catch (err: unknown) {
        console.error(err);
        setError("Error al cargar los datos del proyecto.");
      } finally {
        setLoadingInitial(false);
      }
    }

    if (slugParam) loadProject();
  }, [slugParam]);

  // Manejo de la galería
  const handleGalleryAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewGalleryFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeExistingGalleryImage = (urlToRemove: string) => {
    setExistingGalleryUrls((prev) => prev.filter((url) => url !== urlToRemove));
  };

  const removeNewGalleryImage = (indexToRemove: number) => {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  // --- COMPRESIÓN A WEBP ---
  const uploadFileToStorage = async (
    file: File,
    folder: string,
  ): Promise<string> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: false,
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!projectId) return;
    setLoadingSubmit(true);
    setError(null);

    try {
      if (!slug) throw new Error("El slug es obligatorio.");

      // Lógica de reemplazo de Portada
      let finalCover = existingCoverUrl;
      if (newCoverFile) {
        finalCover = await uploadFileToStorage(newCoverFile, "covers");
      }

      // Lógica de suma de Galería
      const finalGallery = [...existingGalleryUrls];
      if (newGalleryFiles.length > 0) {
        for (let i = 0; i < newGalleryFiles.length; i++) {
          finalGallery.push(
            await uploadFileToStorage(newGalleryFiles[i], "gallery"),
          );
        }
      }

      // GUARDADO EXACTO
      const { error: updateError } = await supabase
        .from("proyectos")
        .update({
          title,
          slug,
          year,
          location,
          description,
          image_url: finalCover,
          gallery_urls: finalGallery,
        })
        .eq("id", projectId);

      if (updateError) throw updateError;

      router.push("/admin/proyectos");
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError("Error al actualizar la base de datos");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-[#827A70] uppercase tracking-widest text-sm animate-pulse">
          Cargando proyecto...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F5F2] text-[#423C35] font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white border border-[#E4DFD5] p-8 shadow-sm rounded-xl">
        <header className="mb-10 border-b border-[#E4DFD5] pb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium tracking-tight">
              Editar: {title}
            </h1>
            <p className="text-xs text-[#827A70] mt-1">
              Actualiza la información y galería de este proyecto
              arquitectónico.
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
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECCIÓN 1: DATOS BÁSICOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase text-[#6A6258] mb-2 font-medium">
                Título del Proyecto *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#FAFAF9] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md focus:outline-none focus:border-epico-blue transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#6A6258] mb-2 font-medium">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                readOnly
                className="w-full bg-[#ECE9E2] border border-[#D5CEC4] px-4 py-3 text-sm text-[#554E45] rounded-md cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#6A6258] mb-2 font-medium">
                Año
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-[#FAFAF9] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md focus:outline-none focus:border-epico-blue transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#6A6258] mb-2 font-medium">
                Ubicación
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#FAFAF9] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md focus:outline-none focus:border-epico-blue transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase text-[#6A6258] mb-2 font-medium">
                Descripción del Proyecto
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#FAFAF9] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md focus:outline-none focus:border-epico-blue transition-colors resize-none"
              />
            </div>
          </div>

          {/* SECCIÓN 2: ARCHIVOS MULTIMEDIA */}
          <div className="border-t border-[#E4DFD5] pt-8">
            <h2 className="text-sm font-medium uppercase text-[#332D26] mb-6">
              Reemplazar Archivos Multimedia
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
                    Cambiar
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setNewCoverFile(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                  {newCoverFile ? (
                    <>
                      <div className="relative w-16 h-10 rounded overflow-hidden flex-shrink-0 border border-zinc-200">
                        <Image
                          src={URL.createObjectURL(newCoverFile)}
                          alt="New Cover"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-epico-blue truncate">
                        {newCoverFile.name}
                      </span>
                    </>
                  ) : existingCoverUrl ? (
                    <>
                      <div className="relative w-16 h-10 rounded overflow-hidden flex-shrink-0 border border-zinc-200">
                        <Image
                          src={existingCoverUrl}
                          alt="Current Cover"
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                      <span className="text-[11px] font-medium text-green-600">
                        ✓ Archivo actual conservado
                      </span>
                    </>
                  ) : (
                    <span className="text-[11px] text-zinc-400">
                      Sin portada
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
                      Añade o elimina fotos del proyecto
                    </span>
                  </div>
                  <label className="bg-epico-blue text-white text-[10px] uppercase tracking-widest font-medium px-4 py-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity w-max">
                    Añadir Fotos
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleGalleryAdd}
                    />
                  </label>
                </div>

                {existingGalleryUrls.length > 0 ||
                newGalleryFiles.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                    {/* Fotos Existentes */}
                    {existingGalleryUrls.map((url, idx) => (
                      <div
                        key={`old-${idx}`}
                        className="relative aspect-square rounded-md overflow-hidden border border-zinc-200 group"
                      >
                        <Image
                          src={url}
                          alt={`Gallery old ${idx}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingGalleryImage(url)}
                          className="absolute top-1 right-1 bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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

                    {/* Fotos Nuevas */}
                    {newGalleryFiles.map((file, idx) => (
                      <div
                        key={`new-${idx}`}
                        className="relative aspect-square rounded-md overflow-hidden border-2 border-epico-blue group"
                      >
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Gallery new ${idx}`}
                          fill
                          className="object-cover opacity-80"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="bg-epico-blue text-white text-[8px] px-1 rounded-sm uppercase tracking-widest">
                            Nuevo
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeNewGalleryImage(idx)}
                          className="absolute top-1 right-1 bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto cursor-pointer"
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
                      La galería de este proyecto está vacía
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-[#E4DFD5] pt-6 flex justify-end">
            <button
              type="submit"
              disabled={loadingSubmit}
              className="bg-epico-blue text-white font-medium px-8 py-4 text-xs uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-3 rounded-md shadow-sm cursor-pointer"
            >
              {loadingSubmit ? "Guardando cambios..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
