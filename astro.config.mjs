// @ts-check
import { defineConfig } from 'astro/config'

import tailwind from '@astrojs/tailwind'

import db from '@astrojs/db'

import AstroPWA from '@vite-pwa/astro'
import { manifest } from './src/utils/pwa'

import vercel from '@astrojs/vercel/serverless'

import auth from 'auth-astro'

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    db(),
    auth(),
    AstroPWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
        type: 'module'
      },
      manifest,
      base: '/',
      workbox: {
        globPatterns: ['**/*.{css,woff,woff2,ttf,eot,ico}'],
        runtimeCaching: [
          {
            // Imágenes y otros activos estáticos
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets',
              expiration: {
                maxEntries: 100, // Máximo 100 activos
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 días de vigencia
              }
            }
          }
        ],
        navigateFallback: null
      }
    })
  ],
  vite: {},
  output: 'server',
  adapter: vercel()
})
