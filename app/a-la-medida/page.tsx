"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Store,
  Tent,
  PenTool,
  Lightbulb,
  FileText,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import InnerNavbar from "@/components/layout/InnerNavbar";
import Footer from "@/components/layout/Footer";

// Opciones del Paso 1
const TIPO_PROYECTO = [
  { id: "hogar", label: "Muebles para mi hogar", icon: Home },
  { id: "comercial", label: "Local o espacio comercial", icon: Store },
  { id: "evento", label: "Stand para feria o evento", icon: Tent },
];

// Opciones del Paso 2
const NIVEL_DEFINICION = [
  {
    id: "cero",
    label: "Empiezo desde cero — necesito el servicio de diseño",
    icon: PenTool,
  },
  {
    id: "ideas",
    label: "Tengo referencias e ideas, pero nada formal todavía",
    icon: Lightbulb,
  },
  {
    id: "planos",
    label: "Tengo planos o diseños ya definidos",
    icon: FileText,
  },
];

export default function ALaMedidaPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    tipoProyecto: "",
    nivelDefinicion: "",
    nombre: "",
    email: "",
    telefono: "",
    ciudad: "",
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Validación para activar/desactivar el botón Continuar
  const isStepValid = () => {
    if (step === 1) return formData.tipoProyecto !== "";
    if (step === 2) return formData.nivelDefinicion !== "";
    if (step === 3) {
      return (
        formData.nombre.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.ciudad.trim() !== ""
      );
    }
    return false;
  };

  const handleSubmit = () => {
    // Formateamos el mensaje para WhatsApp
    const text = `*Cliente A la medida:*\n\n*Tipo de proyecto:* ${formData.tipoProyecto}\n*Nivel de definición:* ${formData.nivelDefinicion}\n\n*Datos del cliente:*\n*Nombre:* ${formData.nombre}\n*Email:* ${formData.email}\n*Teléfono:* ${formData.telefono || "No especificado"}\n*Ciudad:* ${formData.ciudad}`;

    // URL de WhatsApp con el número asignado
    const whatsappUrl = `https://wa.me/573192391641?text=${encodeURIComponent(text)}`;

    // Abrimos WhatsApp en una pestaña nueva
    window.open(whatsappUrl, "_blank");
  };

  return (
    <main className="w-full min-h-screen bg-[#F6F5F2] flex flex-col font-sans text-epico-dark overflow-x-hidden">
      <InnerNavbar theme="light" />

      <section className="flex-grow flex flex-col items-center pt-20 pb-24 px-6 md:px-10">
        <div className="w-full max-w-3xl">
          {/* HEADER DEL WIZARD */}
          <div className="mb-10">
            <h1 className="text-3xl  font-medium tracking-wide mb-4">
              {step === 3 ? "Casi listo" : "Solicita tu asesoría"}
            </h1>
            <p className="text-gray-800 font-light text-sm md:text-base leading-relaxed max-w-xl">
              {step === 3
                ? "¿A quién contactamos? Solo lo esencial. Con esto agendamos tu llamada de inmediato."
                : "Tres preguntas rápidas. Con esa información, el equipo ēpico llegará preparado a tu llamada para darte la mejor solución."}
            </p>
          </div>

          {/* BARRA DE PROGRESO */}
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-3 font-semibold">
              Paso {step} de 3
            </p>
            <div className="w-full h-[2px] bg-gray-200 relative">
              <motion.div
                className="absolute top-0 left-0 h-full bg-epico-blue"
                initial={{ width: "33%" }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* CONTENEDOR ANIMADO DE LOS PASOS */}
          <div className="min-h-[40vh] relative">
            <AnimatePresence mode="wait">
              {/* --- PASO 1 --- */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl md:text-2xl font-medium mb-8">
                    ¿Qué tipo de proyecto tienes?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {TIPO_PROYECTO.map((item) => {
                      const Icon = item.icon;
                      const isSelected = formData.tipoProyecto === item.label;
                      return (
                        <button
                          key={item.id}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              tipoProyecto: item.label,
                            })
                          }
                          className={`flex items-center gap-4 p-5 md:p-6 bg-white border cursor-pointer text-left transition-all duration-300 ${
                            isSelected
                              ? "border-epico-blue ring-1 ring-epico-blue shadow-sm"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${isSelected ? "text-epico-blue" : "text-gray-600"}`}
                            strokeWidth={1.5}
                          />
                          <span
                            className={`text-sm md:text-base font-medium ${isSelected ? "text-epico-blue" : "text-epico-dark"}`}
                          >
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* --- PASO 2 --- */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl md:text-2xl font-medium mb-8">
                    ¿Qué tanto tienes definido?
                  </h2>
                  <div className="flex flex-col gap-4">
                    {NIVEL_DEFINICION.map((item) => {
                      const Icon = item.icon;
                      const isSelected =
                        formData.nivelDefinicion === item.label;
                      return (
                        <button
                          key={item.id}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              nivelDefinicion: item.label,
                            })
                          }
                          className={`flex items-center gap-4 p-5 md:p-6 bg-white cursor-pointer border text-left transition-all duration-300 ${
                            isSelected
                              ? "border-epico-blue ring-1 ring-epico-blue shadow-sm"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 shrink-0 ${isSelected ? "text-epico-blue" : "text-gray-600"}`}
                            strokeWidth={1.5}
                          />
                          <span
                            className={`text-sm md:text-base font-medium ${isSelected ? "text-epico-blue" : "text-epico-dark"}`}
                          >
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* --- PASO 3 --- */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 bg-white p-8 md:p-10 border border-gray-200">
                    <div className="flex flex-col">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) =>
                          setFormData({ ...formData, nombre: e.target.value })
                        }
                        className="border-b border-gray-300 py-3 bg-transparent text-epico-dark focus:outline-none focus:border-epico-blue transition-colors rounded-none"
                        placeholder="Tu nombre completo"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-2">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        value={formData.ciudad}
                        onChange={(e) =>
                          setFormData({ ...formData, ciudad: e.target.value })
                        }
                        className="border-b border-gray-300 py-3 bg-transparent text-epico-dark focus:outline-none focus:border-epico-blue transition-colors rounded-none"
                        placeholder="Ej. Medellín"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="border-b border-gray-300 py-3 bg-transparent text-epico-dark focus:outline-none focus:border-epico-blue transition-colors rounded-none"
                        placeholder="correo@ejemplo.com"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-2">
                        Teléfono (Opcional)
                      </label>
                      <input
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) =>
                          setFormData({ ...formData, telefono: e.target.value })
                        }
                        className="border-b border-gray-300 py-3 bg-transparent text-epico-dark focus:outline-none focus:border-epico-blue transition-colors rounded-none"
                        placeholder="+57 300 000 0000"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CONTROLES / BOTONES */}
          <div className="mt-8 flex items-center justify-between border-t border-gray-400 pt-6">
            {step > 1 ? (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 text-sm font-medium cursor-pointer text-gray-500 hover:text-epico-dark transition-colors uppercase tracking-widest"
              >
                <ArrowLeft className="w-4 h-4" />
                Atrás
              </button>
            ) : (
              <div /> // Espaciador invisible para mantener flex-between
            )}

            {step < 3 ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`flex items-center gap-3 px-8 py-4 text-xs font-semibold uppercase tracking-widest transition-all ${
                  isStepValid()
                    ? "bg-epico-blue text-white hover:bg-blue-800 hover:shadow-lg cursor-pointer"
                    : "bg-gray-200 text-gray-600 cursor-not-allowed"
                }`}
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className={`flex items-center gap-3 px-8 py-4 text-xs font-semibold uppercase tracking-widest transition-all ${
                  isStepValid()
                    ? "bg-epico-blue text-white hover:bg-blue-800 hover:shadow-lg cursor-pointer"
                    : "bg-gray-200 text-gray-600 cursor-not-allowed"
                }`}
              >
                Enviar a WhatsApp
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
