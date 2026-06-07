// app/sitemap.ts
import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://estudioepico.com' // Cambia por tu dominio real

  // 1. Obtenemos todos los slugs de mobiliario
  const { data: mobiliario } = await supabase
    .from('mobiliario')
    .select('slug, updated_at') // Actualizamos cuando editas algo

  // 2. Obtenemos todos los slugs de proyectos
  const { data: proyectos } = await supabase
    .from('proyectos')
    .select('slug, updated_at')

  // 3. Mapeamos las rutas dinámicas de mobiliario
  const mobiliarioUrls = (mobiliario || []).map((mueble) => ({
    url: `${baseUrl}/mobiliario/${mueble.slug}`,
    lastModified: mueble.updated_at ? new Date(mueble.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // 4. Mapeamos las rutas dinámicas de proyectos
  const proyectosUrls = (proyectos || []).map((proyecto) => ({
    url: `${baseUrl}/proyectos/${proyecto.slug}`,
    lastModified: proyecto.updated_at ? new Date(proyecto.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // 5. Rutas Estáticas principales
  const staticUrls = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0, // El Home es lo más importante
    },
    {
      url: `${baseUrl}/mobiliario`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/proyectos`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ]

  // Retornamos todas las rutas combinadas
  return [...staticUrls, ...mobiliarioUrls, ...proyectosUrls]
}