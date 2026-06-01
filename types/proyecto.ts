// types/proyecto.ts
export interface ProyectoFormData {
  title: string;
  slug: string;
  year: string;
  category: string;
  location: string;
  description: string;
  image_url: string; // Portada
  gallery: string[]; // Array de URLs
}