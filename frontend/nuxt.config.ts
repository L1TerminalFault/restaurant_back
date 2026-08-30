// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: 'https://restaurant-backend-2d2w.vercel.app/api/v1'
    }
  },
  css: ['~/assets/css/main.css'],
    app: {
        head: {
          title: 'Awaze - Digital Menu',
          meta: [
            { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
          ],
          link: [
            { rel: 'icon', type: 'image/png', href: '/assets/images/awaze_logo.png' },
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
            {
              rel: 'stylesheet',
              href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&display=swap'
            }
          ]
        }
      },
  vite: {
      plugins: [
        tailwindcss(),
      ],
    },
})
