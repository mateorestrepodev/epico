"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/supabase";
import { X, Plus } from "lucide-react";

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

// Interfaces estrictas para TypeScript
interface SizeState {
  label: string;
  price: string;
}

interface TextureState {
  name: string;
  file: File | null;
}

interface FormattedSize {
  label: string;
  price: number;
}

interface PayloadTexture {
  name: string;
  image_url: string;
}

export default function NuevoMueblePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [discount, setDiscount] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [sizes, setSizes] = useState<SizeState[]>([]);
  const [textures, setTextures] = useState<TextureState[]>([]);

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [hoverImage, setHoverImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [model3d, setModel3d] = useState<File | null>(null);

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
    field: keyof TextureState,
    value: string | File | null,
  ) => {
    const newTextures = [...textures];
    newTextures[index] = {
      ...newTextures[index],
      [field]: value,
    };
    setTextures(newTextures);
  };

  const handleGalleryAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files)
      setGalleryImages((prev) => [
        ...prev,
        ...Array.from(e.target.files as FileList),
      ]);
  };
  const removeGalleryImage = (indexToRemove: number) =>
    setGalleryImages((prev) => prev.filter((_, i) => i !== indexToRemove));

  const uploadFileToStorage = async (
    file: File,
    folder: string,
  ): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const filePath = `mobiliario/${folder}/${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("epico-images")
      .upload(filePath, file);
    if (uploadError) throw uploadError;
    return supabase.storage.from("epico-images").getPublicUrl(filePath).data
      .publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!mainImage) throw new Error("La imagen principal es obligatoria.");
      if (!slug) throw new Error("El slug es obligatorio.");
      if (!category) throw new Error("Debes seleccionar una categoría.");

      const imageUrl = await uploadFileToStorage(mainImage, "main");
      const hoverImageUrl = hoverImage
        ? await uploadFileToStorage(hoverImage, "hover")
        : null;
      const modelUrl = model3d
        ? await uploadFileToStorage(model3d, "models")
        : null;

      const galleryUrls: string[] = [];
      for (const file of galleryImages) {
        galleryUrls.push(await uploadFileToStorage(file, "gallery"));
      }

      const finalTextures: PayloadTexture[] = [];
      for (const tex of textures) {
        if (tex.name && tex.file) {
          const url = await uploadFileToStorage(tex.file, "textures");
          finalTextures.push({ name: tex.name, image_url: url });
        }
      }

      const formattedSizes: FormattedSize[] = sizes
        .filter((s) => s.label.trim() !== "" && s.price.trim() !== "")
        .map((s) => ({ label: s.label, price: parseFloat(s.price) }));

      let finalBasePrice: number | null = price ? parseFloat(price) : null;
      if (formattedSizes.length > 0) {
        finalBasePrice = Math.min(...formattedSizes.map((s) => s.price));
      }

      const payload = {
        name,
        slug,
        category,
        price: finalBasePrice,
        discount: discount ? parseInt(discount) : 0,
        description,
        textures: finalTextures,
        sizes: formattedSizes,
        image_url: imageUrl,
        hover_image_url: hoverImageUrl,
        gallery: galleryUrls,
        model_url: modelUrl,
      };

      const { error: insertError } = await supabase
        .from("mobiliario")
        .insert([payload]);
      if (insertError)
        throw new Error(`Error guardando en BD: ${insertError.message}`);

      router.push("/admin/mobiliario");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Error al subir el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F5F2] text-[#423C35] font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-background border border-[#E4DFD5] p-8 md:p-10 shadow-sm ">
        <header className="mb-10 border-b border-[#E4DFD5] pb-6 flex justify-between items-center">
          <h1 className="text-2xl font-medium text-[#332D26]">
            Añadir Mobiliario
          </h1>
          <Link
            href="/admin/mobiliario"
            className="text-xs uppercase tracking-wider text-[#827A70] hover:text-epico-dark"
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
              <label className="block text-xs uppercase text-[#6A6258] mb-2 font-medium">
                Nombre *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={handleNameChange}
                className="w-full bg-[#FAFAF9] border px-4 py-3 text-sm "
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#6A6258] mb-2 font-medium">
                Slug *
              </label>
              <input
                type="text"
                readOnly
                value={slug}
                className="w-full bg-[#ECE9E2] border px-4 py-3 text-sm  font-mono"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-[#6A6258] mb-2 font-medium">
                Categoría *
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#FAFAF9] border px-4 py-3 text-sm "
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
          <div className="border-t border-[#E4DFD5] pt-8">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-xs uppercase text-[#6A6258] font-medium">
                Texturas y Acabados
              </label>
              <button
                type="button"
                onClick={handleAddTexture}
                disabled={textures.length >= 4}
                className="text-[10px] uppercase font-bold bg-gray-200 px-3 py-1  hover:bg-gray-300 flex items-center gap-1 disabled:opacity-50"
              >
                <Plus size={12} /> Añadir Textura (Max 4)
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
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-2 cursor-pointer z-10"
                  >
                    <X size={18} />
                  </button>
                  <div className="w-full flex-1">
                    <label className="block text-[10px] text-gray-500 mb-1">
                      Nombre (Ej: Tela Bouclé Moka)
                    </label>
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
                    <label className="block text-[10px] text-gray-500 mb-1">
                      Imagen (Cuadrada)
                    </label>
                    <label className="bg-epico-blue text-white text-[10px] uppercase px-3 py-1.5  cursor-pointer hover:opacity-90 inline-block">
                      Elegir Imagen
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
                        required
                      />
                    </label>
                    <div className="text-[10px] text-zinc-500 mt-1 truncate w-full">
                      {tex.file ? (
                        <span className="text-epico-blue">{tex.file.name}</span>
                      ) : (
                        "Sin archivo"
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {textures.length === 0 && (
                <span className="text-[11px] text-zinc-400">
                  Sin texturas. Se mostrará Estándar.
                </span>
              )}
            </div>
          </div>

          {/* TAMAÑOS */}
          <div className="border-t border-[#E4DFD5] pt-8">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-xs uppercase text-[#6A6258] font-medium">
                Variaciones de Tamaño / Precio
              </label>
              <button
                type="button"
                onClick={handleAddSize}
                className="text-[10px] uppercase font-bold bg-gray-200 px-3 py-1  hover:bg-gray-300 flex items-center gap-1"
              >
                <Plus size={12} /> Añadir Medida
              </button>
            </div>
            {sizes.length === 0 ? (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-[10px] text-gray-500 mb-2">
                    Precio Base Único
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#FAFAF9] border px-4 py-3 text-sm "
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] text-gray-500 mb-2">
                    Descuento (%) Opcional
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full bg-[#FAFAF9] border px-4 py-3 text-sm "
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
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
                      className="w-full md:w-1/2 bg-[#FAFAF9] border px-4 py-2 text-sm "
                    />
                  </div>
                </div>
                {sizes.map((size, idx) => (
                  <div
                    key={idx}
                    className="relative flex flex-col md:flex-row gap-3 items-end md:items-center p-4 border border-gray-100  bg-gray-50/50"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(idx)}
                      className="absolute top-2 right-2 md:static md:order-last text-red-500 hover:text-red-700 p-2 z-10"
                    >
                      <X size={18} />
                    </button>
                    <div className="w-full flex-1">
                      <label className="block text-[10px] text-gray-500 mb-1 md:hidden">
                        Medida
                      </label>
                      <input
                        type="text"
                        value={size.label}
                        onChange={(e) =>
                          handleSizeChange(idx, "label", e.target.value)
                        }
                        className="w-full bg-[#FAFAF9] border px-4 py-2 text-sm "
                      />
                    </div>
                    <div className="w-full flex-1">
                      <label className="block text-[10px] text-gray-500 mb-1 md:hidden">
                        Precio Original
                      </label>
                      <input
                        type="number"
                        value={size.price}
                        onChange={(e) =>
                          handleSizeChange(idx, "price", e.target.value)
                        }
                        className="w-full bg-[#FAFAF9] border px-4 py-2 text-sm "
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase text-[#6A6258] mb-2 font-medium">
              Descripción Técnica
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#FAFAF9] border px-4 py-3 text-sm  resize-y"
            />
          </div>

          {/* MULTIMEDIA */}
          <div className="border-t border-[#E4DFD5] pt-8">
            <h2 className="text-sm font-medium uppercase text-[#332D26] mb-6">
              Archivos Multimedia
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-background border p-6  shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <span className="block text-xs font-semibold">
                    Principal *
                  </span>
                  <label className="bg-epico-blue text-white text-[10px] uppercase px-4 py-2  cursor-pointer hover:opacity-90">
                    Elegir{" "}
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
                <span className="text-[11px] text-epico-blue truncate">
                  {mainImage ? mainImage.name : "Sin archivo"}
                </span>
              </div>
              <div className="bg-background border p-6  shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <span className="block text-xs font-semibold">Hover</span>
                  <label className="bg-epico-blue text-white text-[10px] uppercase px-4 py-2  cursor-pointer hover:opacity-90">
                    Elegir{" "}
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
                <span className="text-[11px] text-zinc-400">
                  {hoverImage ? hoverImage.name : "Opcional"}
                </span>
              </div>
              <div className="md:col-span-2 bg-background border p-6  shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <span className="text-xs font-semibold">
                    Galería Múltiple
                  </span>
                  <label className="bg-epico-blue text-white text-[10px] uppercase px-4 py-2  cursor-pointer hover:opacity-90">
                    Añadir{" "}
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
                  {galleryImages.map((file, idx) => (
                    <div key={idx} className="relative aspect-square border">
                      <Image
                        src={URL.createObjectURL(file)}
                        fill
                        className="object-cover"
                        alt=""
                        sizes="100px"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 bg-background border p-6  shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-semibold">
                    Modelo 3D (.glb)
                  </span>
                  <label className="bg-epico-blue text-white text-[10px] uppercase px-4 py-2  cursor-pointer hover:opacity-90">
                    Elegir{" "}
                    <input
                      type="file"
                      accept=".glb,.gltf"
                      className="hidden"
                      onChange={(e) => setModel3d(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
                <span className="text-[11px] text-zinc-400">
                  {model3d ? model3d.name : "Opcional"}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-epico-blue text-white px-8 py-4 text-xs uppercase hover:opacity-90 disabled:opacity-50  shadow-sm"
            >
              {loading ? "Publicando..." : "Publicar Mueble"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
