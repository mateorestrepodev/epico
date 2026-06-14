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
    const finalName = selectedSize
      ? `${product.name} (${selectedSize.label})`
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
      `https://wa.me/573192391641?text=${encodeURIComponent(text)}`,
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

      {/* TEXTURAS CUADRADAS */}
      {product.textures && product.textures.length > 0 && (
        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-3 block">
            Textura / Acabado:{" "}
            <span className="text-epico-dark font-semibold">
              {selectedTextureName}
            </span>
          </span>
          <div className="flex flex-wrap gap-3 px-1">
            {product.textures.map((tex, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTextureName(tex.name)}
                title={tex.name}
                className={`relative w-12 h-12 md:w-14 md:h-14 overflow-hidden   shadow-black transition-all cursor-pointer ${
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
                className={`px-4 py-2 text-xs uppercase tracking-wider border transition-colors cursor-pointer ${
                  selectedSize?.label === size.label
                    ? "border-epico-dark bg-epico-dark text-white font-medium"
                    : "border-gray-300 text-gray-600 hover:border-gray-500"
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setShowCustomModal(true)}
        className="w-full border border-gray-500 font-medium py-3 mb-4 text-xs uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        A la medida
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
