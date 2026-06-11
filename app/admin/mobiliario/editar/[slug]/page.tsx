"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/supabase";
import { X, Plus, Trash2 } from "lucide-react";

const CATEGORIAS = [
  "Camas",
  "Comedores",
  "Mesas",
  "Nocheros",
  "Sillas de barra",
  "Sillas",
  "Sofás",
  "Zapateros",
  "Muebles de TV",
  "Escritorios",
  "Bancas",
  "Poltronas",
  "Estanterías",
];

export default function EditarMueblePage() {
  const router = useRouter();
  const params = useParams();
  const slugParam = params.slug as string;

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [productId, setProductId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState<{ label: string; price: string }[]>([]);

  const [existingMainImage, setExistingMainImage] = useState<string | null>(
    null,
  );
  const [existingHoverImage, setExistingHoverImage] = useState<string | null>(
    null,
  );
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [existingModelUrl, setExistingModelUrl] = useState<string | null>(null);

  const [newMainImage, setNewMainImage] = useState<File | null>(null);
  const [newHoverImage, setNewHoverImage] = useState<File | null>(null);
  const [newGalleryImages, setNewGalleryImages] = useState<File[]>([]);
  const [newModel3d, setNewModel3d] = useState<File | null>(null);

  // Estado para rastrear si el usuario decidió eliminar el modelo 3D existente
  const [removeModel, setRemoveModel] = useState(false);

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
          setCategory(data.category || "");
          setPrice(data.price ? data.price.toString() : "");
          setDiscount(data.discount ? data.discount.toString() : "");
          setDescription(data.description || "");
          setColors(data.colors ? data.colors.join(", ") : "");

          if (data.sizes && Array.isArray(data.sizes)) {
            setSizes(
              data.sizes.map(
                (s: { label: string; price: string | number }) => ({
                  label: s.label,
                  price: s.price.toString(),
                }),
              ),
            );
          }

          setExistingMainImage(data.image_url);
          setExistingHoverImage(data.hover_image_url);
          setExistingGallery(data.gallery || []);
          setExistingModelUrl(data.model_url);
        }
      } catch (err) {
        setError("Error al cargar datos.");
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

  const handleAddSize = () => setSizes([...sizes, { label: "", price: "" }]);
  const handleRemoveSize = (index: number) =>
    setSizes(sizes.filter((_, i) => i !== index));
  const handleSizeChange = (
    index: number,
    field: "label" | "price",
    value: string,
  ) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    setSizes(newSizes);
  };

  const handleGalleryAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files)
      setNewGalleryImages((prev) => [
        ...prev,
        ...Array.from(e.target.files as FileList),
      ]);
  };
  const removeExistingGalleryImage = (urlToRemove: string) =>
    setExistingGallery((prev) => prev.filter((url) => url !== urlToRemove));
  const removeNewGalleryImage = (indexToRemove: number) =>
    setNewGalleryImages((prev) => prev.filter((_, i) => i !== indexToRemove));

  const uploadFileToStorage = async (file: File, folder: string) => {
    const fileExt = file.name.split(".").pop();
    const filePath = `mobiliario/${folder}/${Math.random()}.${fileExt}`;
    await supabase.storage.from("epico-images").upload(filePath, file);
    return supabase.storage.from("epico-images").getPublicUrl(filePath).data
      .publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;
    setLoadingSubmit(true);
    setError(null);

    try {
      let finalImageUrl = existingMainImage;
      if (newMainImage)
        finalImageUrl = await uploadFileToStorage(newMainImage, "main");

      let finalHoverUrl = existingHoverImage;
      if (newHoverImage)
        finalHoverUrl = await uploadFileToStorage(newHoverImage, "hover");

      // === LÓGICA DEL MODELO 3D ===
      let finalModelUrl = existingModelUrl;
      // Si el usuario subió uno nuevo, lo reemplazamos
      if (newModel3d) {
        finalModelUrl = await uploadFileToStorage(newModel3d, "models");
      }
      // Si el usuario decidió eliminar el actual y no subió uno nuevo
      else if (removeModel) {
        finalModelUrl = null;
      }

      const finalGalleryUrls = [...existingGallery];
      for (const file of newGalleryImages)
        finalGalleryUrls.push(await uploadFileToStorage(file, "gallery"));

      const colorsArray = colors
        ? colors
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [];

      const formattedSizes = sizes
        .filter((s) => s.label.trim() !== "" && s.price.trim() !== "")
        .map((s) => ({ label: s.label, price: parseFloat(s.price) }));

      let finalBasePrice = price ? parseFloat(price) : null;
      if (formattedSizes.length > 0) {
        finalBasePrice = Math.min(...formattedSizes.map((s) => s.price));
      }

      const { error: updateError } = await supabase
        .from("mobiliario")
        .update({
          name,
          slug,
          category,
          price: finalBasePrice,
          discount: discount ? parseInt(discount) : 0,
          description,
          colors: colorsArray,
          sizes: formattedSizes,
          image_url: finalImageUrl,
          hover_image_url: finalHoverUrl,
          gallery: finalGalleryUrls,
          model_url: finalModelUrl, // <-- Guardamos el estado final del 3D
        })
        .eq("id", productId);

      if (updateError) throw updateError;
      router.push("/admin/mobiliario");
      router.refresh();
    } catch (err) {
      setError("Error al actualizar.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingInitial)
    return (
      <main className="min-h-screen flex items-center justify-center animate-pulse">
        Cargando...
      </main>
    );

  return (
    <main className="min-h-screen bg-[#F6F5F2] text-[#423C35] font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-background border p-8 rounded-xl">
        <header className="mb-10 border-b pb-6 flex justify-between items-center">
          <h1 className="text-2xl font-medium">Editar: {name}</h1>
          <Link
            href="/admin/mobiliario"
            className="text-xs uppercase hover:text-black"
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
          {/* BLOQUE 1: DATOS BÁSICOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase mb-2">Nombre *</label>
              <input
                type="text"
                required
                value={name}
                onChange={handleNameChange}
                className="w-full bg-[#FAFAF9] border px-4 py-3 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs uppercase mb-2">Slug *</label>
              <input
                type="text"
                readOnly
                value={slug}
                className="w-full bg-[#ECE9E2] border px-4 py-3 rounded-md font-mono"
              />
            </div>
            <div>
              <label className="block text-xs uppercase mb-2">
                Categoría *
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#FAFAF9] border px-4 py-3 rounded-md"
              >
                <option value="">Selecciona...</option>
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase mb-2">
                Colores (Ej: #000000, #FFFFFF)
              </label>
              <input
                type="text"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                className="w-full bg-[#FAFAF9] border px-4 py-3 rounded-md"
              />
            </div>
          </div>

          {/* BLOQUE 2: PRECIOS Y TAMAÑOS */}
          <div className="border-t pt-8">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-xs uppercase font-medium">
                Variaciones de Tamaño / Precio
              </label>
              <button
                type="button"
                onClick={handleAddSize}
                className="text-[10px] uppercase font-bold bg-gray-200 px-3 py-1 rounded flex items-center gap-1 cursor-pointer hover:bg-gray-300"
              >
                <Plus size={12} /> Añadir Medida
              </button>
            </div>

            {sizes.length === 0 ? (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 w-full">
                  <label className="block text-[10px] mb-2 text-gray-500">
                    Precio Base
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#FAFAF9] border px-4 py-3 rounded-md"
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-[10px] text-gray-500 mb-2">
                    Descuento (%) Opcional
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full bg-[#FAFAF9] border px-4 py-3 rounded-md"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                  <div className="flex-1 w-full md:w-auto">
                    <label className="block text-[10px] text-gray-500 mb-1">
                      Descuento Global (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      placeholder="Ej: 15"
                      className="w-full md:w-1/2 bg-[#FAFAF9] border px-4 py-2 rounded-md text-sm"
                    />
                  </div>
                  <div className="flex-1 w-full md:w-auto pt-2 md:pt-0">
                    <span className="text-[10px] text-epico-blue font-medium bg-blue-50 px-3 py-2 rounded-md block w-max">
                      💡 El Precio Base se calculará automáticamente.
                    </span>
                  </div>
                </div>
                {sizes.map((size, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row gap-3 p-3 border border-gray-100 rounded-md bg-gray-50/50"
                  >
                    <input
                      type="text"
                      placeholder="Ej: 140x190cm"
                      value={size.label}
                      onChange={(e) =>
                        handleSizeChange(idx, "label", e.target.value)
                      }
                      className="flex-1 bg-white border px-4 py-2 rounded-md text-sm"
                    />
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="Precio"
                        value={size.price}
                        onChange={(e) =>
                          handleSizeChange(idx, "price", e.target.value)
                        }
                        className="w-full md:w-32 bg-white border px-4 py-2 rounded-md text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(idx)}
                        className="text-red-500 hover:text-red-700 p-2 cursor-pointer"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BLOQUE 3: DESCRIPCIÓN */}
          <div>
            <label className="block text-xs uppercase mb-2">
              Descripción Técnica
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#FAFAF9] border px-4 py-3 rounded-md resize-y"
            />
          </div>

          {/* BLOQUE 4: MULTIMEDIA */}
          <div className="border-t pt-8">
            <h2 className="text-sm uppercase mb-6">Archivos Multimedia</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Principal */}
              <div className="border p-6 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold">Principal *</span>
                  <label className="bg-epico-blue text-white text-[10px] px-3 py-1 rounded cursor-pointer">
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
                <div className="text-[10px] text-zinc-500">
                  {newMainImage ? newMainImage.name : "✓ Conservando actual"}
                </div>
              </div>

              {/* Hover */}
              <div className="border p-6 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold">Hover</span>
                  <label className="bg-epico-blue text-white text-[10px] px-3 py-1 rounded cursor-pointer">
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
                <div className="text-[10px] text-zinc-500">
                  {newHoverImage
                    ? newHoverImage.name
                    : "✓ Conservando actual/vacío"}
                </div>
              </div>

              {/* Galería */}
              <div className="md:col-span-2 border p-6 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold">Galería</span>
                  <label className="bg-epico-blue text-white text-[10px] px-3 py-1 rounded cursor-pointer">
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
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {existingGallery.map((url, idx) => (
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
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 cursor-pointer hover:bg-red-600"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  {newGalleryImages.map((file, idx) => (
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

              {/* === NUEVO BLOQUE: MODELO 3D === */}
              <div className="md:col-span-2 border p-6 rounded-xl bg-gray-50/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold">
                    Modelo 3D (.glb / .gltf)
                  </span>
                  <div className="flex gap-2">
                    {/* Botón para eliminar el 3D actual si existe */}
                    {existingModelUrl && !removeModel && !newModel3d && (
                      <button
                        type="button"
                        onClick={() => setRemoveModel(true)}
                        className="flex items-center gap-1 bg-red-100 text-red-600 hover:bg-red-200 text-[10px] px-3 py-1 rounded cursor-pointer"
                      >
                        <Trash2 size={12} /> Eliminar
                      </button>
                    )}
                    <label className="bg-epico-blue text-white text-[10px] px-3 py-1 rounded cursor-pointer hover:opacity-90">
                      {existingModelUrl ? "Reemplazar" : "Subir Modelo"}
                      <input
                        type="file"
                        accept=".glb,.gltf"
                        className="hidden"
                        onChange={(e) => {
                          setNewModel3d(e.target.files?.[0] || null);
                          setRemoveModel(false); // Si sube uno nuevo, cancelamos el borrado
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-600 mt-2">
                  {newModel3d ? (
                    <span className="text-epico-blue font-medium">
                      Nuevo archivo: {newModel3d.name}
                    </span>
                  ) : removeModel ? (
                    <span className="text-red-500 italic">
                      El modelo 3D actual será eliminado al guardar.
                    </span>
                  ) : existingModelUrl ? (
                    <span className="text-green-600">
                      ✓ Modelo 3D actual activo.
                    </span>
                  ) : (
                    <span>Sin modelo 3D. Puedes subir uno más adelante.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 flex justify-end items-center gap-4">
            {loadingSubmit && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-epico-blue animate-pulse">
                Procesando cambios...
              </span>
            )}
            <button
              type="submit"
              disabled={loadingSubmit}
              className="bg-epico-blue text-white px-8 py-4 text-xs uppercase rounded-md cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loadingSubmit ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
