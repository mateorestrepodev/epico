"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store/useCartStore";
import { ProductData } from "@/types/product";

interface ProductActionsProps {
  product: ProductData;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [show3DModal, setShow3DModal] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    if (show3DModal && !customElements.get("model-viewer")) {
      const script = document.createElement("script");
      script.type = "module";
      script.src =
        "https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js";
      document.head.appendChild(script);
    }
  }, [show3DModal]);

  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const increase = () => setQuantity((prev) => prev + 1);

  const handleAddToCart = () => {
    const defaultColor = "Estándar";
    // Al estar todos usando el mismo type, esto pasa limpio
    addToCart(product, defaultColor, quantity);
    openCart();
  };

  return (
    <div className="w-full my-6 flex flex-col flex-shrink-0">
      <div className="flex gap-4 mb-4 w-full">
        <div className="flex items-center justify-between border border-gray-300 bg-transparent px-3 py-2 w-32 flex-shrink-0">
          <button
            onClick={decrease}
            className="text-gray-500 hover:text-epico-dark transition-colors text-lg px-2 cursor-pointer"
          >
            −
          </button>
          <span className="text-epico-dark font-medium text-sm">
            {quantity}
          </span>
          <button
            onClick={increase}
            className="text-gray-500 hover:text-epico-dark transition-colors text-lg px-2 cursor-pointer"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className="flex-1 bg-epico-blue text-white font-medium py-4 px-2 text-xs uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer"
        >
          Añadir a la cesta
        </button>
      </div>

      <button
        onClick={() => setShow3DModal(true)}
        className={`w-full border font-medium py-4 text-xs uppercase tracking-widest flex items-center justify-center gap-3 mb-4 transition-colors
           ${
             product.model_url
               ? "border-epico-dark bg-transparent text-epico-dark hover:bg-epico-dark hover:text-white cursor-pointer"
               : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60"
           }
        `}
        disabled={!product.model_url}
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

      {show3DModal && product.model_url && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10">
          <div className="relative w-full max-w-5xl h-[70vh] md:h-[80vh] bg-[#F6F5F2] rounded-sm shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-300 bg-background">
              <span className="text-sm font-medium text-epico-dark uppercase tracking-widest">
                Visor 3D: {product.name}
              </span>
              <button
                onClick={() => setShow3DModal(false)}
                className="text-gray-500 hover:text-red-500 transition-colors flex items-center gap-2 text-xs uppercase tracking-widest font-semibold cursor-pointer"
              >
                Cerrar ✕
              </button>
            </div>

            <div className="flex-grow w-full h-full relative cursor-move">
              {/* @ts-ignore */}
              <model-viewer
                src={product.model_url}
                auto-rotate
                camera-controls
                shadow-intensity="1"
                environment-image="neutral"
                exposure="1"
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#F6F5F2",
                }}
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 px-4 py-2 rounded-full shadow-sm pointer-events-none">
                <span className="text-[10px] uppercase tracking-widest text-gray-600 font-medium">
                  Arrastra para rotar • Haz scroll para acercar
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
