// app/admin/proyectos/nuevo/page.tsx
"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/supabase";
import imageCompression from "browser-image-compression";
import { X } from "lucide-react";

export default function NuevoProyecto() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    location: "",
    description: "",
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [mobileCoverFile, setMobileCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

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

  const handleGalleryAdd = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setGalleryFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!coverFile)
        throw new Error("La imagen de portada (Desktop) es obligatoria.");
      if (!formData.slug) throw new Error("El slug es obligatorio.");

      let coverUrl = "";
      let mobileCoverUrl = "";
      const galleryUrls: string[] = [];

      setLoadingText("Comprimiendo y subiendo portadas...");
      coverUrl = await uploadFileToStorage(coverFile, "covers");
      if (mobileCoverFile) {
        mobileCoverUrl = await uploadFileToStorage(
          mobileCoverFile,
          "covers-mobile",
        );
      }

      if (galleryFiles.length > 0) {
        setLoadingText(`Subiendo ${galleryFiles.length} fotos de galería...`);
        for (let i = 0; i < galleryFiles.length; i++) {
          const url = await uploadFileToStorage(galleryFiles[i], "gallery");
          galleryUrls.push(url);
        }
      }

      setLoadingText("Guardando proyecto...");

      // === CORRECCIÓN: Enviamos textos vacíos en lugar de null ===
      // Esto previene errores 400 causados por intentar enviar valores nulos
      // a columnas que podrían no tener esa configuración en la BD
      const payload = {
        title: formData.title.trim(),
        slug: formData.slug,
        location: formData.location.trim(),
        description: formData.description.trim(),
        image_url: coverUrl,
        image_mobile_url: mobileCoverUrl || "",
        gallery_urls: galleryUrls,
      };

      console.log("Enviando Payload a Supabase:", payload); // Debugger para consola

      const { error: insertError } = await supabase
        .from("proyectos")
        .insert([payload]);

      if (insertError) {
        // Log para investigar en consola el mensaje real de la BD
        console.error("🚨 ERROR EXACTO DE SUPABASE:", insertError);

        if (insertError.code === "23505") {
          throw new Error(
            "Ya existe un proyecto con este nombre o slug. Por favor, elige un nombre diferente.",
          );
        }
        // Mostramos el mensaje exacto de error en la alerta (por ejemplo: "column 'year' violates not-null")
        throw new Error(
          `Error guardando en BD: ${insertError.message || insertError.details}`,
        );
      }

      setLoadingText("¡Proyecto publicado!");
      router.push("/admin/proyectos");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Ocurrió un error inesperado al subir el proyecto.");
      setLoading(false);
      setLoadingText("");
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F5F2] text-[#423C35] font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-background border border-[#E4DFD5] p-8 md:p-10 shadow-sm rounded-xl">
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
                className="w-full bg-[#FAFAF9] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md focus:outline-none focus:border-epico-blue transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#6A6258] mb-2 font-medium">
                URL Slug *
              </label>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                readOnly
                className="w-full bg-[#ECE9E2] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md cursor-not-allowed font-mono text-[#554E45]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-[#6A6258] mb-2 font-medium">
                Ubicación{" "}
                <span className="text-gray-400 normal-case">(Opcional)</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-[#FAFAF9] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md focus:outline-none focus:border-epico-blue transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-[#6A6258] mb-2 font-medium">
                Descripción del Proyecto{" "}
                <span className="text-gray-400 normal-case">(Opcional)</span>
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-[#FAFAF9] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md focus:outline-none focus:border-epico-blue transition-colors resize-none"
              />
            </div>
          </div>

          <div className="border-t border-[#E4DFD5] pt-8">
            <h2 className="text-sm font-medium uppercase tracking-wider text-[#332D26] mb-6">
              Subir Archivos Multimedia
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-background border border-zinc-200 p-6 rounded-xl flex flex-col justify-between shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="block text-xs font-semibold text-[#332D26]">
                      Portada Desktop *
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Horizontal (16:9)
                    </span>
                  </div>
                  <label className="bg-epico-blue text-white text-[10px] uppercase tracking-wider font-medium px-4 py-2 rounded-md cursor-pointer hover:opacity-90 w-max">
                    Elegir
                    <input
                      type="file"
                      accept="image/*"
                      required
                      className="hidden"
                      onChange={(e) =>
                        setCoverFile(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                </div>
                {coverFile ? (
                  <span className="text-[11px] font-medium text-epico-blue truncate">
                    {coverFile.name}
                  </span>
                ) : (
                  <span className="text-[11px] text-zinc-400">Sin archivo</span>
                )}
              </div>

              <div className="bg-background border border-zinc-200 p-6 rounded-xl flex flex-col justify-between shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="block text-xs font-semibold text-[#332D26]">
                      Portada Móvil
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Vertical (Opcional, 9:16)
                    </span>
                  </div>
                  <label className="bg-epico-dark text-white text-[10px] uppercase tracking-wider font-medium px-4 py-2 rounded-md cursor-pointer hover:opacity-90 w-max">
                    Elegir
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setMobileCoverFile(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                </div>
                {mobileCoverFile ? (
                  <span className="text-[11px] font-medium text-epico-blue truncate">
                    {mobileCoverFile.name}
                  </span>
                ) : (
                  <span className="text-[11px] text-zinc-400">
                    Usará la de Desktop por defecto
                  </span>
                )}
              </div>

              <div className="md:col-span-2 bg-background border border-zinc-200 p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <span className="block text-xs font-semibold text-[#332D26]">
                      Galería del Proyecto
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Añade fotos para el carrusel
                    </span>
                  </div>
                  <label className="bg-epico-blue text-white text-[10px] uppercase tracking-wider font-medium px-4 py-2 rounded-md cursor-pointer hover:opacity-90 w-max">
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
                          sizes="100px"
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1 right-1 bg-red-500/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100 text-center">
                    <span className="text-[11px] text-zinc-400">
                      No has seleccionado imágenes
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-[#E4DFD5] pt-6 flex justify-end items-center gap-4">
            {loading && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-epico-blue animate-pulse">
                {loadingText}
              </span>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-epico-blue text-white font-medium px-8 py-4 text-xs uppercase hover:opacity-90 disabled:opacity-50 rounded-md shadow-sm cursor-pointer"
            >
              {loading ? "Publicando..." : "Publicar Proyecto"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
