// components/3d/Model.tsx
"use client";

import { useGLTF, Center } from "@react-three/drei";

interface ModelProps {
  url: string;
}

export default function Model({ url }: ModelProps) {
  // useGLTF carga y cachea el modelo automáticamente
  const { scene } = useGLTF(url);

  return (
    // Center asegura que el modelo aparezca en el medio de la pantalla sin importar sus coordenadas originales
    <Center>
      <primitive object={scene} scale={1.5} />
    </Center>
  );
}
