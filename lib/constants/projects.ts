// lib/constants/projects.ts

export type Project = {
  id: number;
  title: string;
  year: string;
  category: string;
  image: string;       // Imagen principal (para el slider, cards o destacados)
  gallery: string[];   // Galería interna del proyecto
};

// Nombres extraídos de tu imagen
export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Apto Epic",
    year: "2024",
    category: "Residencial / Interiorismo",
    image: "/epicohero.jpg",
    gallery: ["/epicohero.jpg", "/epicohero1.jpg", "/mobiliario.jpg", "/epicohero.jpg"],
  },
  {
    id: 2,
    title: "Apto Sara y David",
    year: "2023",
    category: "Residencial",
    image: "/mobiliario.jpg",
    gallery: ["/mobiliario.jpg", "/epicohero.jpg", "/epicohero1.jpg", "/mobiliario.jpg"],
  },
  {
    id: 3,
    title: "Casa El Arrebol",
    year: "2023",
    category: "Arquitectura / Residencial",
    image: "/epicohero1.jpg",
    gallery: ["/epicohero1.jpg", "/mobiliario.jpg", "/epicohero.jpg", "/epicohero1.jpg"],
  },
  {
    id: 4,
    title: "Casa Elementa",
    year: "2023",
    category: "Arquitectura / Residencial",
    image: "/epicohero.jpg",
    gallery: ["/epicohero.jpg", "/epicohero1.jpg", "/mobiliario.jpg", "/epicohero.jpg"],
  },
  {
    id: 5,
    title: "Casa Talavera del Bosque",
    year: "2022",
    category: "Residencial / Interiorismo",
    image: "/mobiliario.jpg",
    gallery: ["/mobiliario.jpg", "/epicohero.jpg", "/epicohero1.jpg", "/mobiliario.jpg"],
  },
  {
    id: 6,
    title: "Cocina San Marcos",
    year: "2022",
    category: "Interiorismo Específico",
    image: "/epicohero1.jpg",
    gallery: ["/epicohero1.jpg", "/mobiliario.jpg", "/epicohero.jpg", "/epicohero1.jpg"],
  },
 
];