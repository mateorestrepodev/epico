// components/3d/Modal3D.tsx
"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Handbag } from "lucide-react";
import Model from "./Model";
import { useCartStore } from "@/lib/store/useCartStore";

// Ajustado a los nombres exactos de la tabla en Supabase
export type ProductData = {
  id: string | number;
  name: string;
  description: string;
  price: number;
  colors: string[];
  model_url: string;
  image_url: string;
};

interface Modal3DProps {
  isVisible: boolean;
  onClose: () => void;
  product: ProductData | null;
}

export default function Modal3D({ isVisible, onClose, product }: Modal3DProps) {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const { addToCart, openCart } = useCartStore();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setSelectedColor("");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isVisible, product]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const colorToSave =
      selectedColor ||
      (product.colors && product.colors.length > 0
        ? product.colors[0]
        : "Estándar");

    // Para el carrito de compras (Zustand), mapeamos las URLs
    const cartProduct = {
      ...product,
      imageUrl: product.image_url,
      modelUrl: product.model_url,
    };

    addToCart(cartProduct, colorToSave);
    onClose();

    setTimeout(() => {
      openCart();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-white overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 md:top-8 md:right-8 z-50 p-2 text-black hover:opacity-60 transition-opacity bg-white/50 backdrop-blur-md rounded-full md:bg-transparent md:backdrop-blur-none cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X size={32} strokeWidth={1.5} />
          </button>

          <div className="relative w-full h-[50vh] md:h-full md:w-[60%] bg-[#f5f5f5] cursor-grab active:cursor-grabbing">
            {product.model_url ? (
              <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
                <Environment preset="city" />
                <ambientLight intensity={0.5} />
                <directionalLight
                  position={[10, 10, 10]}
                  intensity={1}
                  castShadow
                />

                <Suspense
                  fallback={
                    <Html center>
                      <div className="flex flex-col items-center text-epico-blue">
                        <Loader2 className="animate-spin mb-2" size={32} />
                        <span className="text-xs tracking-[0.2em] uppercase font-semibold">
                          Cargando...
                        </span>
                      </div>
                    </Html>
                  }
                >
                  <Model url={product.model_url} />
                  <ContactShadows
                    position={[0, -1, 0]}
                    opacity={0.4}
                    scale={10}
                    blur={2}
                    far={4}
                  />
                </Suspense>

                <OrbitControls
                  enablePan={false}
                  minDistance={2}
                  maxDistance={8}
                  autoRotate
                  autoRotateSpeed={0.5}
                />
              </Canvas>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 uppercase tracking-widest text-xs">
                Modelo 3D no disponible
              </div>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-[10px] md:text-xs font-medium tracking-widest uppercase text-gray-400 w-full text-center pointer-events-none">
              Arrastra para rotar • Scroll para zoom
            </div>
          </div>

          <div className="w-full h-[50vh] md:h-full md:w-[40%] bg-white flex flex-col px-8 py-10 md:p-16 overflow-y-auto">
            <div className="mt-auto md:mt-0 max-w-md mx-auto w-full flex flex-col h-full justify-center">
              <div className="mb-8">
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-black mb-4">
                  {product.name}
                </h2>
                <p className="text-2xl font-light text-epico-blue">
                  {formatPrice(product.price)}
                </p>
              </div>

              <div className="mb-10">
                <p className="text-gray-600 leading-relaxed font-light text-sm md:text-base">
                  {product.description}
                </p>
              </div>

              {product.colors && product.colors.length > 0 && (
                <div className="mb-10">
                  <span className="text-xs text-black tracking-widest uppercase mb-4 block font-medium">
                    Acabados Disponibles
                  </span>
                  <div className="flex gap-4">
                    {product.colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-300 cursor-pointer ${
                          selectedColor === color
                            ? "border-epico-blue scale-110"
                            : "border-transparent hover:scale-105 shadow-sm"
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Seleccionar color ${color}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto md:mt-8">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-epico-blue text-white py-4 px-8 flex items-center justify-center gap-3 hover:bg-blue-800 transition-colors duration-300 group cursor-pointer"
                >
                  <Handbag
                    size={20}
                    className="group-hover:-translate-y-1 transition-transform duration-300"
                  />
                  <span className="text-sm font-semibold tracking-widest uppercase">
                    Agregar al Carrito
                  </span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
