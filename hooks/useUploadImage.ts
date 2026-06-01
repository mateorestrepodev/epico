import { createBrowserClient } from '@supabase/ssr';

export const useUploadImage = () => {
  // Inicializamos el cliente de navegador para que adjunte automáticamente tu cookie de sesión
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const upload = async (file: File, folder: string) => {
    try {
      // Extraemos la extensión y creamos un nombre único
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      // La ruta final será ej: proyectos/casa-llanogrande/abc123xyz.jpg
      const filePath = `proyectos/${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('epico-images')
        .upload(filePath, file);

      if (error) {
        console.error("Error detallado de Supabase:", error);
        throw error;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('epico-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error subiendo la imagen:", error);
      throw error;
    }
  };

  return { upload };
};