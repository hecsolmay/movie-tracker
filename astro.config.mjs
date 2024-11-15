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
  integrations: [tailwind(), db(), auth()],
  vite: {
    plugins: [
      AstroPWA({
        registerType: 'autoUpdate',
        manifest,
        base: '/',
        workbox: {
          globDirectory: '.vercel/output/static',
          globPatterns: ['**/*.{html,js,css,woff,woff2,ttf,eot,ico,ts}'],
          runtimeCaching: [
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 30 * 24 * 60 * 60
                }
              }
            }
          ]
        }
      })
    ]
  },
  output: 'server',
  adapter: vercel()
})
