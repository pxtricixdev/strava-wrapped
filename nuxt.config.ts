// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxtjs/seo"],
  css: ["~/assets/css/main.css"],
  site: {
    url: "https://fitwrapped.vercel.app/",
    name: "Strava Wrapped",
    description:
      "Genera tu resumen semanal de Strava y compártelo como imagen: distancia, tiempo, calorías, desglose por deporte y racha.",
    defaultLocale: "es",
  },
  robots: {
    disallow: ["/callback", "/connect"],
  },
  sitemap: {
    exclude: ["/callback", "/connect"],
  },
  app: {
    head: {
      htmlAttrs: { lang: "es" },
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      ],
      meta: [
        { name: "theme-color", content: "#fc4c02" },
        { name: "format-detection", content: "telephone=no" },
      ],
    },
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ["node"],
      },
    },
  },
  runtimeConfig: {
    stravaClientId: process.env.STRAVA_CLIENT_ID,
    stravaClientSecret: process.env.STRAVA_CLIENT_SECRET,
    stravaRedirectUri: process.env.STRAVA_REDIRECT_URI,
    public: {
      stravaClientId: process.env.STRAVA_CLIENT_ID,
      stravaRedirectUri: process.env.STRAVA_REDIRECT_URI,
    },
  },
});
