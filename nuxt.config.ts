// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ["node"],
      },
    },
  },
  runtimeConfig: {
    stravaClientSecret: process.env.STRAVA_CLIENT_SECRET,
    public: {
      stravaClientId: process.env.STRAVA_CLIENT_ID,
    },
  },
});
