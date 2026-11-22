// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4
  },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt'
  ],
  css: [
    '~/assets/css/main.css'
  ],
  typescript: {
    strict: true
  },
  devtools: { enabled: false }
})
