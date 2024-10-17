// @ts-check
import { defineConfig } from 'astro/config'

import tailwind from '@astrojs/tailwind'

import db from '@astrojs/db'

import AstroPWA from '@vite-pwa/astro'
import { manifest } from './src/utils/pwa'

import vercel from '@astrojs/vercel/serverless'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), db()],
  vite: {
    plugins: [
      AstroPWA({
        registerType: 'autoUpdate',
        manifest,
        base: '/'
      })
    ]
  },
  output: 'server',
  adapter: vercel()
})
