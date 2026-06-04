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

export default function NuevoMueblePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados del Formulario
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(""); // Precio base
  const [description, setDescription] = useState("");
  const [colors, setColors] = useState("");

  // Estado para medidas dinámicas
  const [sizes, setSizes] = useState<{ label: string; price: string }[]>([]);

  // Estados de Archivos
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
    field: "label" | "price",
    value: string,
  ) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    setSizes(newSizes);
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
    const { error } = await supabase.storage
      .from("epico-images")
      .upload(filePath, file);
    if (error) throw error;
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

      const galleryUrls = [];
      for (const file of galleryImages)
        galleryUrls.push(await uploadFileToStorage(file, "gallery"));

      const colorsArray = colors
        ? colors
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [];

      // Filtrar sizes vacíos y asegurar números
      const formattedSizes = sizes
        .filter((s) => s.label.trim() !== "" && s.price.trim() !== "")
        .map((s) => ({ label: s.label, price: parseFloat(s.price) }));

      const { error: insertError } = await supabase.from("mobiliario").insert([
        {
          name,
          slug,
          category,
          price: price ? parseFloat(price) : null,
          description,
          colors: colorsArray,
          sizes: formattedSizes,
          image_url: imageUrl,
          hover_image_url: hoverImageUrl,
          gallery: galleryUrls,
          model_url: modelUrl,
        },
      ]);

      if (insertError) throw insertError;
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
      <div className="max-w-4xl mx-auto bg-background border border-[#E4DFD5] p-8 md:p-10 shadow-sm rounded-xl">
        <header className="mb-10 border-b border-[#E4DFD5] pb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium text-[#332D26]">
              Añadir Mobiliario
            </h1>
          </div>
          <Link
            href="/admin/mobiliario"
            className="text-xs uppercase tracking-wider text-[#827A70] hover:text-epico-dark"
          >
            ← Cancelar
          </Link>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm">{error}</div>
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
                className="w-full bg-[#FAFAF9] border px-4 py-3 text-sm rounded-md"
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
                className="w-full bg-[#ECE9E2] border px-4 py-3 text-sm rounded-md font-mono"
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
                className="w-full bg-[#FAFAF9] border px-4 py-3 text-sm rounded-md"
              >
                <option value="">Selecciona una categoría...</option>
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-[#6A6258] mb-2 font-medium">
                Colores (Ej: #000000, #FFFFFF)
              </label>
              <input
                type="text"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                placeholder="Hexadecimales separados por coma"
                className="w-full bg-[#FAFAF9] border px-4 py-3 text-sm rounded-md"
              />
            </div>
          </div>

          <div className="border-t border-[#E4DFD5] pt-8">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-xs uppercase text-[#6A6258] font-medium">
                Variaciones de Tamaño / Precio
              </label>
              <button
                type="button"
                onClick={handleAddSize}
                className="text-[10px] uppercase font-bold bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 flex items-center gap-1"
              >
                <Plus size={12} /> Añadir Medida
              </button>
            </div>

            {sizes.length === 0 ? (
              <div>
                <label className="block text-[10px] text-gray-500 mb-2">
                  Precio Base Único (Si no tiene medidas variables)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ej: 1500000"
                  className="w-1/2 bg-[#FAFAF9] border px-4 py-3 text-sm rounded-md"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[10px] text-gray-500">
                  Agrega el nombre de la medida y su precio específico. (Ej:
                  140x190cm - 1500000)
                </p>
                {sizes.map((size, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <input
                      type="text"
                      placeholder="Medida (Ej: Queen 160x190)"
                      value={size.label}
                      onChange={(e) =>
                        handleSizeChange(idx, "label", e.target.value)
                      }
                      className="flex-1 bg-[#FAFAF9] border px-4 py-2 text-sm rounded-md"
                    />
                    <input
                      type="number"
                      placeholder="Precio"
                      value={size.price}
                      onChange={(e) =>
                        handleSizeChange(idx, "price", e.target.value)
                      }
                      className="flex-1 bg-[#FAFAF9] border px-4 py-2 text-sm rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(idx)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <X size={18} />
                    </button>
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
              placeholder="La descripción respeta los saltos de línea que pongas aquí..."
              className="w-full bg-[#FAFAF9] border px-4 py-3 text-sm rounded-md resize-y"
            />
          </div>

          <div className="border-t border-[#E4DFD5] pt-8">
            <h2 className="text-sm font-medium uppercase text-[#332D26] mb-6">
              Archivos Multimedia
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-background border p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="block text-xs font-semibold">
                      Principal *
                    </span>
                  </div>
                  <label className="bg-epico-blue text-white text-[10px] uppercase px-4 py-2 rounded-md cursor-pointer hover:opacity-90">
                    Elegir
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
                {mainImage ? (
                  <span className="text-[11px] text-epico-blue truncate">
                    {mainImage.name}
                  </span>
                ) : (
                  <span className="text-[11px] text-zinc-400">Sin archivo</span>
                )}
              </div>

              <div className="bg-background border p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="block text-xs font-semibold">Hover</span>
                  </div>
                  <label className="bg-epico-blue text-white text-[10px] uppercase px-4 py-2 rounded-md cursor-pointer hover:opacity-90">
                    Elegir
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
                {hoverImage ? (
                  <span className="text-[11px] text-epico-blue truncate">
                    {hoverImage.name}
                  </span>
                ) : (
                  <span className="text-[11px] text-zinc-400">Opcional</span>
                )}
              </div>

              <div className="md:col-span-2 bg-background border p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <span className="text-xs font-semibold">
                    Galería Múltiple
                  </span>
                  <label className="bg-epico-blue text-white text-[10px] uppercase px-4 py-2 rounded-md cursor-pointer hover:opacity-90">
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
                {galleryImages.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 bg-zinc-50 p-4 rounded-lg">
                    {galleryImages.map((file, idx) => (
                      <div key={idx} className="relative aspect-square border">
                        <Image
                          src={URL.createObjectURL(file)}
                          fill
                          className="object-cover"
                          alt=""
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <span className="text-[11px] text-zinc-400">
                      Sin galería
                    </span>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 bg-background border p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-semibold">
                    Modelo 3D (.glb)
                  </span>
                  <label className="bg-epico-blue text-white text-[10px] uppercase px-4 py-2 rounded-md cursor-pointer hover:opacity-90">
                    Elegir
                    <input
                      type="file"
                      accept=".glb,.gltf"
                      className="hidden"
                      onChange={(e) => setModel3d(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
                {model3d ? (
                  <span className="text-[11px] text-epico-blue truncate">
                    {model3d.name}
                  </span>
                ) : (
                  <span className="text-[11px] text-zinc-400">Opcional</span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-[#E4DFD5] pt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-epico-blue text-white px-8 py-4 text-xs uppercase hover:opacity-90 disabled:opacity-50 rounded-md shadow-sm"
            >
              {loading ? "Publicando..." : "Publicar Mueble"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
