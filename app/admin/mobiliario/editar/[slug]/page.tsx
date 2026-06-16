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

// Interfaces estrictas para evitar 'any'
interface SizeState {
  label: string;
  price: string;
}

interface EditTextureState {
  name: string;
  url?: string;
  file?: File | null;
}

interface DbSize {
  label: string;
  price: string | number;
}

interface DbTexture {
  name: string;
  image_url: string;
}

export default function EditarMueblePage() {
  const router = useRouter();
  const params = useParams();
  const slugParam = params.slug as string;

  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [productId, setProductId] = useState<number | null>(null);

  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [discount, setDiscount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [sizes, setSizes] = useState<SizeState[]>([]);
  const [textures, setTextures] = useState<EditTextureState[]>([]);

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
  const [removeModel, setRemoveModel] = useState<boolean>(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error: fetchError } = await supabase
          .from("mobiliario")
          .select("*")
          .eq("slug", slugParam)
          .single();
        if (fetchError) throw fetchError;
        if (data) {
          setProductId(data.id);
          setName(data.name || "");
          setSlug(data.slug || "");
          setCategory(data.category || "");
          setPrice(data.price ? data.price.toString() : "");
          setDiscount(data.discount ? data.discount.toString() : "");
          setDescription(data.description || "");

          if (data.sizes && Array.isArray(data.sizes)) {
            setSizes(
              data.sizes.map((s: DbSize) => ({
                label: s.label,
                price: s.price.toString(),
              })),
            );
          }

          if (data.textures && Array.isArray(data.textures)) {
            setTextures(
              data.textures.map((t: DbTexture) => ({
                name: t.name,
                url: t.image_url,
                file: null,
              })),
            );
          }

          setExistingMainImage(data.image_url);
          setExistingHoverImage(data.hover_image_url);
          setExistingGallery(data.gallery || []);
          setExistingModelUrl(data.model_url);
        }
      } catch (err) {
        setError("Error al cargar datos.");
      }
      pack: {
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
    field: keyof SizeState,
    value: string,
  ) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    setSizes(newSizes);
  };

  const handleAddTexture = () => {
    if (textures.length < 4)
      setTextures([...textures, { name: "", file: null }]);
  };
  const handleRemoveTexture = (index: number) =>
    setTextures(textures.filter((_, i) => i !== index));
  const handleTextureChange = (
    index: number,
    field: keyof EditTextureState,
    value: string | File | null,
  ) => {
    const newTextures = [...textures];
    newTextures[index] = { ...newTextures[index], [field]: value };
    setTextures(newTextures);
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

  const uploadFileToStorage = async (
    file: File,
    folder: string,
  ): Promise<string> => {
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

      let finalModelUrl = existingModelUrl;
      if (newModel3d)
        finalModelUrl = await uploadFileToStorage(newModel3d, "models");
      else if (removeModel) finalModelUrl = null;

      const finalGalleryUrls = [...existingGallery];
      for (const file of newGalleryImages)
        finalGalleryUrls.push(await uploadFileToStorage(file, "gallery"));

      const finalTextures = [];
      for (const tex of textures) {
        if (!tex.name) continue;
        if (tex.file) {
          const url = await uploadFileToStorage(tex.file, "textures");
          finalTextures.push({ name: tex.name, image_url: url });
        } else if (tex.url) {
          finalTextures.push({ name: tex.name, image_url: tex.url });
        }
      }

      const formattedSizes = sizes
        .filter((s) => s.label.trim() !== "" && s.price.trim() !== "")
        .map((s) => ({ label: s.label, price: parseFloat(s.price) }));

      let finalBasePrice: number | null = price ? parseFloat(price) : null;
      if (formattedSizes.length > 0)
        finalBasePrice = Math.min(...formattedSizes.map((s) => s.price));

      const { error: updateError } = await supabase
        .from("mobiliario")
        .update({
          name,
          slug,
          category,
          price: finalBasePrice,
          discount: discount ? parseInt(discount) : 0,
          description,
          textures: finalTextures,
          sizes: formattedSizes,
          image_url: finalImageUrl,
          hover_image_url: finalHoverUrl,
          gallery: finalGalleryUrls,
          model_url: finalModelUrl,
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
      <div className="max-w-4xl mx-auto bg-background border p-8 ">
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
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm  border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase mb-2">Nombre *</label>
              <input
                type="text"
                required
                value={name}
                onChange={handleNameChange}
                className="w-full bg-[#FAFAF9] border px-4 py-3 "
              />
            </div>
            <div>
              <label className="block text-xs uppercase mb-2">Slug *</label>
              <input
                type="text"
                readOnly
                value={slug}
                className="w-full bg-[#ECE9E2] border px-4 py-3  font-mono"
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
                className="w-full bg-[#FAFAF9] border px-4 py-3 "
              >
                <option value="">Selecciona...</option>
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* TEXTURAS */}
          <div className="border-t pt-8">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-xs uppercase font-medium">
                Texturas y Acabados
              </label>
              <button
                type="button"
                onClick={handleAddTexture}
                disabled={textures.length >= 4}
                className="text-[10px] uppercase font-bold bg-gray-200 px-3 py-1  flex items-center gap-1 hover:bg-gray-300 disabled:opacity-50"
              >
                <Plus size={12} /> Añadir Textura
              </button>
            </div>
            <div className="space-y-4">
              {textures.map((tex, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col md:flex-row gap-3 items-center p-4 border border-gray-100  bg-gray-50/50"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveTexture(idx)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-2"
                  >
                    <X size={18} />
                  </button>
                  <div className="w-full flex-1">
                    <label className="block text-[10px] mb-1">Nombre</label>
                    <input
                      type="text"
                      value={tex.name}
                      onChange={(e) =>
                        handleTextureChange(idx, "name", e.target.value)
                      }
                      className="w-full bg-white border px-4 py-2 text-sm "
                      required
                    />
                  </div>
                  <div className="w-full flex-1">
                    <label className="block text-[10px] mb-1">
                      Imagen (Vacío para conservar actual)
                    </label>
                    <label className="bg-epico-blue text-white text-[10px] uppercase px-3 py-1.5 rounded-md cursor-pointer hover:opacity-90 inline-block">
                      Cambiar
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleTextureChange(
                            idx,
                            "file",
                            e.target.files?.[0] || null,
                          )
                        }
                        className="hidden"
                      />
                    </label>
                    <div className="text-[10px] mt-1 truncate">
                      {tex.file ? (
                        <span className="text-epico-blue">{tex.file.name}</span>
                      ) : tex.url ? (
                        <span className="text-green-600">
                          ✓ Conservando actual
                        </span>
                      ) : (
                        <span className="text-zinc-500">Sin archivo</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TAMAÑOS */}
          <div className="border-t pt-8">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-xs uppercase font-medium">
                Variaciones de Tamaño / Precio
              </label>
              <button
                type="button"
                onClick={handleAddSize}
                className="text-[10px] uppercase font-bold bg-gray-200 px-3 py-1  flex items-center gap-1 hover:bg-gray-300"
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
                    className="w-full bg-[#FAFAF9] border px-4 py-3 "
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
                    className="w-full bg-[#FAFAF9] border px-4 py-3 "
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
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
                      className="w-full md:w-1/2 bg-[#FAFAF9] border px-4 py-2  text-sm"
                    />
                  </div>
                </div>
                {/* --- NUEVO LAYOUT DE TALLAS --- */}
                {sizes.map((size, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row gap-3 items-center w-full"
                  >
                    <div className="relative flex-1 w-full">
                      <input
                        type="text"
                        placeholder="Medida (Ej: 140x190)"
                        value={size.label}
                        onChange={(e) =>
                          handleSizeChange(idx, "label", e.target.value)
                        }
                        className="w-full bg-[#FAFAF9] border border-gray-200 px-4 py-3 text-sm outline-none focus:border-epico-blue transition-colors pr-10"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium pointer-events-none">
                        cm
                      </span>
                    </div>
                    <div className="flex w-full md:w-auto gap-3 items-center">
                      <div className="relative w-full md:w-48">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                          $
                        </span>
                        <input
                          type="number"
                          placeholder="Precio"
                          value={size.price}
                          onChange={(e) =>
                            handleSizeChange(idx, "price", e.target.value)
                          }
                          className="w-full bg-[#FAFAF9] border border-gray-200 pl-8 pr-4 py-3 text-sm outline-none focus:border-epico-blue transition-colors"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(idx)}
                        className="text-red-500 hover:text-red-700 p-2 flex-shrink-0 transition-colors cursor-pointer"
                      >
                        <X size={20} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase mb-2">
              Descripción Técnica
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#FAFAF9] border px-4 py-3  resize-y"
            />
          </div>

          {/* MULTIMEDIA */}
          <div className="border-t pt-8">
            <h2 className="text-sm uppercase mb-6">Archivos Multimedia</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="border p-6 ">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold">Principal *</span>
                  <label className="bg-epico-blue text-white text-[10px] px-3 py-1  cursor-pointer">
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
              <div className="border p-6 ">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold">Hover</span>
                  <label className="bg-epico-blue text-white text-[10px] px-3 py-1  cursor-pointer">
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
              <div className="md:col-span-2 border p-6 ">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold">Galería</span>
                  <label className="bg-epico-blue text-white text-[10px] px-3 py-1  cursor-pointer">
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
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
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
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 border p-6  bg-gray-50/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold">
                    Modelo 3D (.glb / .gltf)
                  </span>
                  <div className="flex gap-2">
                    {existingModelUrl && !removeModel && !newModel3d && (
                      <button
                        type="button"
                        onClick={() => setRemoveModel(true)}
                        className="flex items-center gap-1 bg-red-100 text-red-600 hover:bg-red-200 text-[10px] px-3 py-1  cursor-pointer"
                      >
                        <Trash2 size={12} /> Eliminar
                      </button>
                    )}
                    <label className="bg-epico-blue text-white text-[10px] px-3 py-1  cursor-pointer hover:opacity-90">
                      {existingModelUrl ? "Reemplazar" : "Subir Modelo"}
                      <input
                        type="file"
                        accept=".glb,.gltf"
                        className="hidden"
                        onChange={(e) => {
                          setNewModel3d(e.target.files?.[0] || null);
                          setRemoveModel(false);
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
                      El modelo será eliminado.
                    </span>
                  ) : existingModelUrl ? (
                    <span className="text-green-600">
                      ✓ Modelo 3D actual activo.
                    </span>
                  ) : (
                    <span>Sin modelo 3D.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 flex justify-end items-center gap-4">
            {loadingSubmit && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-epico-blue animate-pulse">
                Procesando...
              </span>
            )}
            <button
              type="submit"
              disabled={loadingSubmit}
              className="bg-epico-blue text-white px-8 py-4 text-xs uppercase  cursor-pointer hover:opacity-90 disabled:opacity-50"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
