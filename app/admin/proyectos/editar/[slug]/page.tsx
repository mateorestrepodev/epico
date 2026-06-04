// app/admin/proyectos/editar/[slug]/page.tsx
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/supabase";
import imageCompression from "browser-image-compression";
import { X } from "lucide-react";

export default function EditarProyecto() {
  const router = useRouter();
  const params = useParams();
  const slugParam =
    typeof params.slug === "string" ? decodeURIComponent(params.slug) : "";

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  const [existingMobileCoverUrl, setExistingMobileCoverUrl] = useState<
    string | null
  >(null);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);

  const [newCoverFile, setNewCoverFile] = useState<File | null>(null);
  const [newMobileCoverFile, setNewMobileCoverFile] = useState<File | null>(
    null,
  );
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);

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
          setLocation(data.location || "");
          setDescription(data.description || "");

          setExistingCoverUrl(data.image_url);
          setExistingMobileCoverUrl(data.image_mobile_url);
          setExistingGalleryUrls(data.gallery_urls || []);
        }
      } catch (err) {
        setError("Error al cargar los datos.");
      } finally {
        setLoadingInitial(false);
      }
    }
    if (slugParam) loadProject();
  }, [slugParam]);

  const handleGalleryAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files)
      setNewGalleryFiles((prev) => [
        ...prev,
        ...Array.from(e.target.files as FileList),
      ]);
  };

  const removeExistingGalleryImage = (urlToRemove: string) =>
    setExistingGalleryUrls((prev) => prev.filter((url) => url !== urlToRemove));
  const removeNewGalleryImage = (indexToRemove: number) =>
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== indexToRemove));

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
    const compressedFile = await imageCompression(file, options);
    const filePath = `proyectos/${folder}/${Math.random().toString(36).substring(2, 15)}.webp`;
    const { error } = await supabase.storage
      .from("epico-images")
      .upload(filePath, compressedFile);
    if (error) throw error;
    return supabase.storage.from("epico-images").getPublicUrl(filePath).data
      .publicUrl;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!projectId) return;
    setLoadingSubmit(true);
    setError(null);

    try {
      let finalCover = existingCoverUrl;
      let finalMobileCover = existingMobileCoverUrl;

      if (newCoverFile)
        finalCover = await uploadFileToStorage(newCoverFile, "covers");
      if (newMobileCoverFile)
        finalMobileCover = await uploadFileToStorage(
          newMobileCoverFile,
          "covers-mobile",
        );

      const finalGallery = [...existingGalleryUrls];
      if (newGalleryFiles.length > 0) {
        for (let i = 0; i < newGalleryFiles.length; i++) {
          finalGallery.push(
            await uploadFileToStorage(newGalleryFiles[i], "gallery"),
          );
        }
      }

      const { error: updateError } = await supabase
        .from("proyectos")
        .update({
          title,
          slug,
          location,
          description,
          image_url: finalCover,
          image_mobile_url: finalMobileCover,
          gallery_urls: finalGallery,
        })
        .eq("id", projectId);

      if (updateError) {
        if (updateError.code === "23505") {
          throw new Error("Ya existe un proyecto con este nombre o slug.");
        }
        throw updateError;
      }

      router.push("/admin/proyectos");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Error al actualizar.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingInitial)
    return (
      <div className="min-h-[80vh] flex items-center justify-center animate-pulse uppercase">
        Cargando...
      </div>
    );

  return (
    <main className="min-h-screen bg-[#F6F5F2] text-[#423C35] font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-background border border-[#E4DFD5] p-8 shadow-sm rounded-xl">
        <header className="mb-10 border-b border-[#E4DFD5] pb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium tracking-tight">
              Editar: {title}
            </h1>
          </div>
          <Link
            href="/admin/proyectos"
            className="text-xs uppercase tracking-wider text-[#827A70]"
          >
            ← Cancelar
          </Link>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase text-[#6A6258] mb-2 font-medium">
                Título *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#FAFAF9] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#6A6258] mb-2 font-medium">
                Slug
              </label>
              <input
                type="text"
                value={slug}
                readOnly
                className="w-full bg-[#ECE9E2] border px-4 py-3 text-sm rounded-md cursor-not-allowed text-zinc-500 font-mono"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase text-[#6A6258] mb-2 font-medium">
                Ubicación
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#FAFAF9] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase text-[#6A6258] mb-2 font-medium">
                Descripción
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#FAFAF9] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md resize-none"
              />
            </div>
          </div>

          <div className="border-t border-[#E4DFD5] pt-8">
            <h2 className="text-sm font-medium uppercase text-[#332D26] mb-6">
              Archivos Multimedia
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-background border border-zinc-200 p-6 rounded-xl flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="block text-xs font-semibold">
                      Portada Desktop *
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Horizontal (16:9)
                    </span>
                  </div>
                  <label className="bg-epico-blue text-white text-[10px] uppercase font-medium px-4 py-2 rounded-md cursor-pointer hover:opacity-90">
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
                <div className="flex gap-2 items-center text-[11px] text-zinc-500">
                  {newCoverFile ? (
                    <span className="text-epico-blue font-medium">
                      {newCoverFile.name}
                    </span>
                  ) : existingCoverUrl ? (
                    <span className="text-green-600">
                      ✓ Archivo actual conservado
                    </span>
                  ) : (
                    "Sin portada"
                  )}
                </div>
              </div>

              <div className="bg-background border border-zinc-200 p-6 rounded-xl flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="block text-xs font-semibold">
                      Portada Móvil
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Vertical (9:16)
                    </span>
                  </div>
                  <label className="bg-epico-dark text-white text-[10px] uppercase font-medium px-4 py-2 rounded-md cursor-pointer hover:opacity-90">
                    Cambiar
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setNewMobileCoverFile(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                </div>
                <div className="flex gap-2 items-center text-[11px] text-zinc-500">
                  {newMobileCoverFile ? (
                    <span className="text-epico-blue font-medium">
                      {newMobileCoverFile.name}
                    </span>
                  ) : existingMobileCoverUrl ? (
                    <span className="text-green-600">
                      ✓ Archivo actual conservado
                    </span>
                  ) : (
                    "No se ha subido portada móvil"
                  )}
                </div>
              </div>

              <div className="md:col-span-2 border border-zinc-200 p-6 rounded-xl">
                <div className="flex justify-between mb-4">
                  <span className="text-xs font-semibold">Galería</span>
                  <label className="bg-epico-blue text-white text-[10px] px-3 py-1 uppercase rounded-md cursor-pointer hover:opacity-90">
                    Añadir
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleGalleryAdd}
                    />
                  </label>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {existingGalleryUrls.map((url, idx) => (
                    <div
                      key={`old-${idx}`}
                      className="relative aspect-square border"
                    >
                      <Image
                        src={url}
                        fill
                        className="object-cover"
                        alt=""
                        sizes="100px"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingGalleryImage(url)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  {newGalleryFiles.map((file, idx) => (
                    <div
                      key={`new-${idx}`}
                      className="relative aspect-square border-2 border-epico-blue"
                    >
                      <Image
                        src={URL.createObjectURL(file)}
                        fill
                        className="object-cover opacity-80"
                        alt=""
                        sizes="100px"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewGalleryImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E4DFD5] pt-6 flex justify-end">
            <button
              type="submit"
              disabled={loadingSubmit}
              className="bg-epico-blue text-white font-medium px-8 py-4 text-xs uppercase hover:opacity-90 rounded-md cursor-pointer disabled:opacity-50 transition-opacity"
            >
              {loadingSubmit ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
