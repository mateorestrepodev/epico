"use client";

import React, { useState } from "react";
import { useCartStore } from "@/lib/store/useCartStore";
import { ProductData } from "@/types/product";
import dynamic from "next/dynamic";
import Image from "next/image";

interface Size {
  label: string;
  price: number;
}

interface Texture {
  name: string;
  image_url: string;
}

interface ExtendedProductData {
  id: number;
  name: string;
  price: number | null;
  discount?: number | null;
  textures?: Texture[];
  sizes?: Size[];
  model_url?: string | null;
  image_url: string;
}

interface ProductActionsProps {
  product: ExtendedProductData;
}

const ModelViewerModal = dynamic(() => import("./ModelViewerModal"), {
  ssr: false,
});

export default function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [show3DModal, setShow3DModal] = useState<boolean>(false);
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);

  // Estado: Controla la textura ampliada en el modal
  const [zoomedTexture, setZoomedTexture] = useState<Texture | null>(null);

  const hasSizes = product.sizes && product.sizes.length > 0;
  const initialSize = hasSizes ? product.sizes![0] : null;

  const [selectedSize, setSelectedSize] = useState<Size | null>(initialSize);

  const [selectedTextureName, setSelectedTextureName] = useState<string>(
    product.textures && product.textures.length > 0
      ? product.textures[0].name
      : "Estándar",
  );

  const addToCart = useCartStore((state) => state.addToCart);
  const openCart = useCartStore((state) => state.openCart);

  const discountPercentage = product.discount || 0;
  const currentOriginalPrice = selectedSize
    ? selectedSize.price
    : product.price;

  const currentDisplayPrice = currentOriginalPrice
    ? currentOriginalPrice - (currentOriginalPrice * discountPercentage) / 100
    : null;

  const handleAddToCart = () => {
    const finalPrice = currentDisplayPrice || 0;

    // Al añadir al carrito, convertimos a minúsculas 'cm'
    const finalName = selectedSize
      ? `${product.name} (${selectedSize.label.toLowerCase().includes("cm") ? selectedSize.label.toLowerCase() : `${selectedSize.label} cm`})`
      : product.name;

    const cartProduct = {
      ...product,
      name: finalName,
      price: finalPrice,
    } as unknown as ProductData;

    addToCart(cartProduct, selectedTextureName, quantity);
    openCart();
  };

  const handleCustomWhatsApp = () => {
    const text = `Hola, estoy interesado en un producto a la medida:\n\n*Producto:* ${product.name}\nMe gustaría cotizar opciones personalizadas.`;
    window.open(
      `https://wa.me/573242548059?text=${encodeURIComponent(text)}`,
      "_blank",
    );
    setShowCustomModal(false);
  };

  return (
    <div className="w-full flex flex-col flex-shrink-0">
      {currentOriginalPrice ? (
        <div className="flex flex-col items-start gap-1 mb-2">
          {discountPercentage > 0 && (
            <span className="bg-red-600 text-white px-2 py-1 text-[10px] font-bold tracking-widest uppercase  mb-1 flex items-center gap-1 w-max">
              🔥 -{discountPercentage}% OFF
            </span>
          )}
          <div className="flex items-center gap-3">
            <p className="text-2xl md:text-3xl tracking-wider font-light text-gray-800">
              ${Number(currentDisplayPrice).toLocaleString("es-CO")} COP
            </p>
            {discountPercentage > 0 && (
              <p className="text-sm tracking-wider font-light text-gray-400 line-through">
                ${Number(currentOriginalPrice).toLocaleString("es-CO")}
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-2xl md:text-3xl tracking-wider font-light text-gray-800 mb-2">
          Cotizar
        </p>
      )}
      <p className="text-xs text-gray-500 font-light tracking-wide mb-8">
        Envío calculado al finalizar la compra.
      </p>

      {/* TEXTURAS CUADRADAS CON ZOOM DIRECTO Y MICRO-COPY */}
      {product.textures && product.textures.length > 0 && (
        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-3 flex flex-col gap-1">
            <span>
              Textura / Acabado:{" "}
              <span className="text-epico-dark font-semibold">
                {selectedTextureName}
              </span>
            </span>
            <span className="text-[9px] text-gray-400 normal-case tracking-normal">
              (Toca la textura seleccionada para ampliarla)
            </span>
          </span>
          <div className="flex flex-wrap gap-3 px-1">
            {product.textures.map((tex, idx) => (
              <button
                key={idx}
                onClick={() => {
                  // Con un solo clic: seleccionamos la textura y abrimos el modal de zoom a la vez
                  setSelectedTextureName(tex.name);
                  setZoomedTexture(tex);
                }}
                title={tex.name}
                className={`relative w-12 h-12 md:w-14 md:h-14 overflow-hidden shadow-black transition-all cursor-pointer group ${
                  selectedTextureName === tex.name
                    ? "border-epico-dark scale-105 shadow-md"
                    : "border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100"
                }`}
              >
                <Image
                  src={tex.image_url}
                  alt={tex.name}
                  fill
                  className="object-cover"
                  sizes="60px"
                />
              </button>
            ))}
          </div>

          {/* --- MODAL OPTIMIZADO (ZOOM) --- */}
          {zoomedTexture && (
            <div
              className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-sm p-6"
              onClick={() => setZoomedTexture(null)}
            >
              {/* Botón de cerrar flotante */}
              <button
                onClick={() => setZoomedTexture(null)}
                className="absolute top-6 right-6 md:top-8 md:right-10 text-white/70 hover:text-white transition-colors cursor-pointer z-[130] bg-black/40 p-2 rounded-full"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Contenedor controlado (max-w-md para que mantenga un tamaño acorde) */}
              <div
                className="relative w-full max-w-md aspect-square flex flex-col items-center justify-center bg-[#F6F5F2] border border-white/10 p-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full h-full overflow-hidden bg-[#FAFAF9]">
                  <Image
                    src={zoomedTexture.image_url}
                    alt={zoomedTexture.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 450px"
                    quality={100}
                    priority
                  />
                </div>
                {/* Pie de modal con el nombre de la textura */}
                <div className="w-full text-center pt-4 border-t border-gray-200 mt-2">
                  <p className="text-gray-800 tracking-widest uppercase text-xs font-semibold">
                    {zoomedTexture.name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAMAÑOS */}
      {hasSizes && (
        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-3 block">
            Tamaño
          </span>
          <div className="flex flex-wrap gap-3">
            {product.sizes!.map((size, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 text-xs border transition-colors cursor-pointer ${
                  selectedSize?.label === size.label
                    ? "border-epico-dark bg-epico-dark text-white font-medium"
                    : "border-gray-300 text-gray-600 hover:border-gray-500"
                }`}
              >
                {size.label.toLowerCase().includes("cm")
                  ? size.label.toLowerCase()
                  : `${size.label} cm`}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setShowCustomModal(true)}
        className="relative w-full border border-gray-500 font-medium py-3 px-12 mb-4 text-[10px] md:text-xs uppercase tracking-wider md:tracking-widest text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer text-center group"
      >
        <span className="block w-full leading-snug">
          Quiero personalizar a la medida
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute right-7 top-1/2 -translate-y-1/2 text-[#25D366] transition-transform group-hover:scale-110"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.06-.177-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </button>

      <div className="flex gap-4 mb-4 w-full">
        <div className="flex items-center justify-between border border-gray-300 bg-transparent px-3 py-2 w-32 flex-shrink-0">
          <button
            onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
            className="text-gray-500 hover:text-epico-dark text-lg px-2 cursor-pointer"
          >
            −
          </button>
          <span className="text-epico-dark font-medium text-sm">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="text-gray-500 hover:text-epico-dark text-lg px-2 cursor-pointer"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-epico-blue text-white font-medium py-4 px-2 text-[10px] md:text-xs uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer"
        >
          Añadir a la cesta
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => setShow3DModal(true)}
          disabled={!product.model_url}
          className={`w-full border font-medium py-3 text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-colors ${
            product.model_url
              ? "border-epico-dark text-epico-dark hover:bg-epico-dark hover:text-white cursor-pointer"
              : "border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          {product.model_url ? "Ver en 3D" : "3D No Disponible"}
        </button>
      </div>

      {showCustomModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white p-8 max-w-sm w-full text-center shadow-2xl border border-gray-200">
            <h3 className="text-xl font-medium text-epico-dark mb-2">
              ¿Diseño a la medida?
            </h3>
            <p className="text-sm text-gray-600 font-light mb-6">
              Serás redirigido a WhatsApp para hablar con nuestro equipo sobre
              modificaciones para:
              <br />
              <strong className="font-medium text-epico-blue mt-2 block">
                {product.name}
              </strong>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCustomModal(false)}
                className="flex-1 py-3 text-xs uppercase tracking-wider border border-gray-300 text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleCustomWhatsApp}
                className="flex-1 py-3 text-xs uppercase tracking-wider bg-[#25D366] text-white hover:opacity-90 cursor-pointer"
              >
                Ir a WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {show3DModal && product.model_url && (
        <ModelViewerModal
          productName={product.name}
          modelUrl={product.model_url}
          onClose={() => setShow3DModal(false)}
        />
      )}
    </div>
  );
}
