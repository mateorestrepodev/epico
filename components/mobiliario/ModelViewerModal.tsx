"use client";

import { useEffect } from "react";

interface ModelViewerModalProps {
  productName: string;
  modelUrl: string;
  onClose: () => void;
}

export default function ModelViewerModal({
  productName,
  modelUrl,
  onClose,
}: ModelViewerModalProps) {
  // El script pesado ahora solo se ejecuta si se abre el modal
  useEffect(() => {
    if (!customElements.get("model-viewer")) {
      const script = document.createElement("script");
      script.type = "module";
      script.src =
        "https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js";
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10">
      <div className="relative w-full max-w-5xl h-[70vh] md:h-[80vh] bg-[#F6F5F2]  shadow-2xl flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-500 bg-background">
          <span className="text-sm font-medium text-epico-dark uppercase tracking-widest">
            Visor 3D: {productName}
          </span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xs uppercase tracking-wider font-semibold cursor-pointer"
          >
            Cerrar ✕
          </button>
        </div>
        <div className="flex-grow w-full h-full relative cursor-move">
          {/* @ts-ignore */}
          <model-viewer
            src={modelUrl}
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
        </div>
      </div>
    </div>
  );
}
