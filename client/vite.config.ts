import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  plugins: [
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Member Waitlist',
        short_name: 'Waitlist',
        start_url: '.',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#0a84ff',
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/your-api\.com\/.*$/,
            handler: 'NetworkFirst',
            options: { cacheName: 'api-cache' }
          },
          {
            urlPattern: ({ request }) =>
              ['document', 'script', 'style'].includes(request.destination),
            handler: 'StaleWhileRevalidate'
          }
        ]
      }
    })
  ],
})