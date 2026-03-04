export default defineNuxtConfig({
  extends: ["docus"],
  site: {
    name: "Repix",
    url: process.env.NUXT_SITE_URL || "https://repix.bansal.io",
  },
  ogImage: {
    defaults: {
      url: "/ogImage.png",
      alt: "Repix - Self-hosted image transformation service",
    },
  },
});
