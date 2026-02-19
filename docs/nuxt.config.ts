export default defineNuxtConfig({
  extends: ['docus'],
  site: {
    name: 'Repix',
    url: process.env.NUXT_SITE_URL || 'https://repix-docs.example.com',
  },
})
