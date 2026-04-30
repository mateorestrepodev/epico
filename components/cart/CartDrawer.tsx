// components/cart/CartDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, Handbag } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/lib/store/useCartStore";

// Número de WhatsApp de Juanita (con código de país, sin el '+')
const WHATSAPP_NUMBER = "573192391641";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
  } = useCartStore();

  // Estados para el formulario del cliente
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  // Limpiamos el formulario cada vez que se abre/cierra el carrito
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCustomerName("");
        setCustomerAddress("");
      }, 300);
    }
  }, [isOpen]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isFormValid =
    customerName.trim().length > 0 && customerAddress.trim().length > 0;

  const handleWhatsAppCheckout = () => {
    if (items.length === 0 || !isFormValid) return;

    // Construimos el mensaje con la estructura exacta solicitada por Juanita
    let rawMessage = `Hola mi nombre es *${customerName.trim()}*\n`;
    rawMessage += `Mi dirección es: *${customerAddress.trim()}*\n\n`;
    rawMessage += `*Resumen de pedido:*\n`;

    items.forEach((item) => {
      rawMessage += `- ${item.quantity}x ${item.product.name}\n`;
      if (item.selectedColor) {
        rawMessage += `  Color/Acabado: ${item.selectedColor}\n`;
      }
      rawMessage += `  Precio Unitario: ${formatPrice(item.product.price)}\n\n`;
    });

    rawMessage += `*Total antes de envío:* ${formatPrice(getTotalPrice())}`;

    // Codificamos el mensaje para URL
    const encodedMessage = encodeURIComponent(rawMessage);

    // Redirigimos a WhatsApp
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`,
      "_blank",
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Telón oscuro de fondo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm cursor-pointer"
          />

          {/* Panel Deslizante Lateral */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              duration: 0.4,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[101] flex flex-col shadow-2xl"
          >
            {/* Cabecera del Carrito */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-medium tracking-tight flex items-center gap-2">
                <Handbag size={20} />
                Tu Selección
              </h2>
              <button
                onClick={closeCart}
                className="p-2 hover:opacity-60 transition-opacity cursor-pointer"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Lista de Productos */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                  <Handbag strokeWidth={1} />
                  <p className="tracking-widest uppercase text-xs">
                    El carrito está vacío
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor}`}
                    className="flex gap-4 items-center"
                  >
                    <div className="relative w-20 h-24 bg-[#f5f5f5] shrink-0">
                      {item.product.image_url && (
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1 flex flex-col">
                      <h3 className="font-medium text-lg">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-2">
                        {formatPrice(item.product.price)}
                      </p>

                      {item.selectedColor && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[10px] tracking-widest uppercase text-gray-400">
                            Acabado:
                          </span>
                          <span
                            className="w-3 h-3 rounded-full border border-gray-200"
                            style={{ backgroundColor: item.selectedColor }}
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-200 rounded-full px-2 py-1">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedColor,
                                item.quantity - 1,
                              )
                            }
                            className="p-1 hover:opacity-50 cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedColor,
                                item.quantity + 1,
                              )
                            }
                            className="p-1 hover:opacity-50 cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            removeFromCart(item.product.id, item.selectedColor)
                          }
                          className="text-gray-400 hover:text-red-500 transition-colors ml-auto p-2 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer: Formulario, Resumen y Checkout */}
            {items.length > 0 && (
              <div className="p-6 bg-gray-50 border-t border-gray-100 mt-auto">
                {/* Formulario de Datos */}
                <div className="flex flex-col gap-3 mb-6">
                  <input
                    type="text"
                    placeholder="TU NOMBRE COMPLETO"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-epico-blue transition-colors placeholder:text-gray-400 placeholder:text-xs placeholder:tracking-widest uppercase"
                  />
                  <input
                    type="text"
                    placeholder="DIRECCIÓN DE ENTREGA"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-epico-blue transition-colors placeholder:text-gray-400 placeholder:text-xs placeholder:tracking-widest uppercase"
                  />
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-semibold tracking-widest uppercase text-gray-500">
                    Total
                  </span>
                  <span className="text-2xl font-medium">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>

                <button
                  onClick={handleWhatsAppCheckout}
                  disabled={!isFormValid}
                  className={`w-full py-4 px-6 flex justify-center items-center gap-3 transition-all group ${
                    isFormValid
                      ? "bg-[#291df1] text-white hover:bg-blue-800 cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <span className="font-semibold tracking-widest uppercase text-sm">
                    Finalizar compra
                  </span>
                  <span
                    className={`transition-transform ${isFormValid ? "group-hover:translate-x-1" : ""}`}
                  >
                    →
                  </span>
                </button>
                <p className="text-[10px] text-center text-gray-400 mt-4 tracking-widest uppercase select-none">
                  Envío calculado al finalizar la compra.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
