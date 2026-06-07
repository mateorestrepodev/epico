// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://estudioepico.com'

  return {
    rules: {
      userAgent: '*', // Aplica para Google, Bing, Yahoo, etc.
      allow: '/', // Pueden rastrear todo el sitio público
      disallow: [
        '/admin/',       // BLOQUEAMOS el panel de administración
        '/api/',         // Bloqueamos las rutas de API
        '/*?query=',     // Bloqueamos URLs con parámetros raros
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`, // Le decimos dónde encontrar el mapa
  }
}