"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/supabase";

export default function EditarMueblePage() {
  const router = useRouter();
  const params = useParams();
  const slugParam = params.slug as string;

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [productId, setProductId] = useState<number | null>(null);

  // Estados del Formulario (Textos)
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [colors, setColors] = useState("");

  // Estados para URLs existentes en BD
  const [existingMainImage, setExistingMainImage] = useState<string | null>(
    null,
  );
  const [existingHoverImage, setExistingHoverImage] = useState<string | null>(
    null,
  );
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [existingModelUrl, setExistingModelUrl] = useState<string | null>(null);

  // Estados para Nuevos Archivos
  const [newMainImage, setNewMainImage] = useState<File | null>(null);
  const [newHoverImage, setNewHoverImage] = useState<File | null>(null);
  // Cambiamos a array para poder eliminar elementos individuales antes de subir
  const [newGalleryImages, setNewGalleryImages] = useState<File[]>([]);
  const [newModel3d, setNewModel3d] = useState<File | null>(null);

  // Cargar datos
  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from("mobiliario")
          .select("*")
          .eq("slug", slugParam)
          .single();

        if (error) throw error;
        if (data) {
          setProductId(data.id);
          setName(data.name || "");
          setSlug(data.slug || "");
          setPrice(data.price ? data.price.toString() : "");
          setDescription(data.description || "");
          setColors(data.colors ? data.colors.join(", ") : "");

          setExistingMainImage(data.image_url);
          setExistingHoverImage(data.hover_image_url);
          setExistingGallery(data.gallery || []);
          setExistingModelUrl(data.model_url);
        }
      } catch (err: unknown) {
        console.error(err);
        setError("Error al cargar los datos del producto.");
      } finally {
        setLoadingInitial(false);
      }
    }

    if (slugParam) fetchProduct();
  }, [slugParam]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setSlug(
      value
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/[^\w\-]+/g, ""),
    );
  };

  // --- Lógicas de Galería Múltiple (Visual) ---
  const handleGalleryAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewGalleryImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeExistingGalleryImage = (urlToRemove: string) => {
    setExistingGallery((prev) => prev.filter((url) => url !== urlToRemove));
  };

  const removeNewGalleryImage = (indexToRemove: number) => {
    setNewGalleryImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };
  // ---------------------------------------------

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
    if (!productId) return;
    setLoadingSubmit(true);
    setError(null);

    try {
      if (!slug) throw new Error("El slug es obligatorio.");

      let finalImageUrl = existingMainImage;
      if (newMainImage)
        finalImageUrl = await uploadFileToStorage(newMainImage, "main");

      let finalHoverUrl = existingHoverImage;
      if (newHoverImage)
        finalHoverUrl = await uploadFileToStorage(newHoverImage, "hover");

      let finalModelUrl = existingModelUrl;
      if (newModel3d)
        finalModelUrl = await uploadFileToStorage(newModel3d, "models");

      // La galería final es lo que quedó de la existente + las nuevas subidas
      const finalGalleryUrls = [...existingGallery]; // <-- Aquí está el cambio
      if (newGalleryImages.length > 0) {
        for (let i = 0; i < newGalleryImages.length; i++) {
          finalGalleryUrls.push(
            await uploadFileToStorage(newGalleryImages[i], "gallery"),
          );
        }
      }

      const colorsArray = colors
        ? colors
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [];

      const { error: updateError } = await supabase
        .from("mobiliario")
        .update({
          name,
          slug,
          price: price ? parseFloat(price) : null,
          description,
          colors: colorsArray,
          image_url: finalImageUrl,
          hover_image_url: finalHoverUrl,
          gallery: finalGalleryUrls,
          model_url: finalModelUrl,
        })
        .eq("id", productId);

      if (updateError) throw updateError;

      router.push("/admin/mobiliario");
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError("Ocurrió un error inesperado al actualizar el producto.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingInitial) {
    return (
      <main className="min-h-screen bg-[#F6F5F2] flex items-center justify-center">
        <p className="text-[#827A70] uppercase tracking-wider text-sm animate-pulse">
          Cargando producto...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F5F2] text-[#423C35] font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-background border border-[#E4DFD5] p-8 shadow-sm rounded-xl">
        <header className="mb-10 border-b border-[#E4DFD5] pb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium tracking-tight">
              Editar: {name}
            </h1>
            <p className="text-xs text-[#827A70] mt-1">
              Actualiza la información, precios o archivos de este mueble.
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
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECCIÓN 1: DATOS BÁSICOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase text-[#6A6258] mb-2 font-medium">
                Nombre *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={handleNameChange}
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
                Precio (COP)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#FAFAF9] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md focus:outline-none focus:border-epico-blue transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#6A6258] mb-2 font-medium">
                Colores (Separados por coma)
              </label>
              <input
                type="text"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                className="w-full bg-[#FAFAF9] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md focus:outline-none focus:border-epico-blue transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-[#6A6258] mb-2 font-medium">
              Descripción Técnica
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#FAFAF9] border border-[#D5CEC4] px-4 py-3 text-sm rounded-md focus:outline-none focus:border-epico-blue transition-colors resize-none"
            />
          </div>

          {/* SECCIÓN 2: ARCHIVOS MULTIMEDIA REDISEÑADA */}
          <div className="border-t border-[#E4DFD5] pt-8">
            <h2 className="text-sm font-medium uppercase text-[#332D26] mb-2">
              Reemplazar Archivos Multimedia
            </h2>
            <p className="text-xs text-[#827A70] mb-6">
              Si no seleccionas un archivo nuevo, se conservará el actual.
            </p>

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
                    Cambiar
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setNewMainImage(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                  {newMainImage ? (
                    <>
                      <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-zinc-200">
                        <Image
                          src={URL.createObjectURL(newMainImage)}
                          alt="New Main"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-epico-blue truncate">
                        {newMainImage.name}
                      </span>
                    </>
                  ) : existingMainImage ? (
                    <>
                      <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-zinc-200">
                        <Image
                          src={existingMainImage}
                          alt="Current Main"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-green-600">
                        ✓ Archivo actual conservado
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
                    Cambiar
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setNewHoverImage(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                  {newHoverImage ? (
                    <>
                      <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-zinc-200">
                        <Image
                          src={URL.createObjectURL(newHoverImage)}
                          alt="New Hover"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-epico-blue truncate">
                        {newHoverImage.name}
                      </span>
                    </>
                  ) : existingHoverImage ? (
                    <>
                      <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-zinc-200">
                        <Image
                          src={existingHoverImage}
                          alt="Current Hover"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-green-600">
                        ✓ Archivo actual conservado
                      </span>
                    </>
                  ) : (
                    <span className="text-[11px] text-zinc-400">
                      No hay imagen hover
                    </span>
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
                      Añade o elimina fotos del carrusel
                    </span>
                  </div>
                  <label className="bg-epico-blue text-white text-[10px] uppercase tracking-wider font-medium px-4 py-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity w-max">
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

                {/* Grid de Miniaturas de la Galería */}
                {existingGallery.length > 0 || newGalleryImages.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                    {/* Fotos Existentes */}
                    {existingGallery.map((url, idx) => (
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

                    {/* Fotos Nuevas (Por subir) */}
                    {newGalleryImages.map((file, idx) => (
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
                          className="absolute top-1 right-1 bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
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
                      La galería está vacía
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
                    Cambiar
                    <input
                      type="file"
                      accept=".glb,.gltf"
                      className="hidden"
                      onChange={(e) =>
                        setNewModel3d(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                  {newModel3d ? (
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
                        {newModel3d.name}
                      </span>
                    </>
                  ) : existingModelUrl ? (
                    <>
                      <div className="w-10 h-10 bg-green-50 rounded flex items-center justify-center flex-shrink-0 border border-green-100">
                        <svg
                          width="20"
                          height="20"
                          className="text-green-600"
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
                      <span className="text-[11px] font-medium text-green-600">
                        ✓ Archivo actual conservado
                      </span>
                    </>
                  ) : (
                    <span className="text-[11px] text-zinc-400">
                      Sin modelo 3D asignado
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E4DFD5] pt-6 flex justify-end">
            <button
              type="submit"
              disabled={loadingSubmit}
              className="bg-epico-blue text-white font-medium px-8 py-4 text-xs uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-3 rounded-md shadow-sm"
            >
              {loadingSubmit ? "Guardando cambios..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
