<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

useSeoMeta({
  title: "Conecta Strava · Strava Wrapped",
  description:
    "Conecta tu cuenta de Strava y genera tu resumen semanal al instante: distancia, tiempo, calorías, desglose por deporte y racha.",
  ogTitle: "Strava Wrapped — Tu semana, lista para stories",
  ogDescription:
    "Conecta Strava y genera un resumen compartible con distancia, tiempo, calorías y racha.",
  ogType: "website",
  twitterCard: "summary_large_image",
});

const auth = useAuthStore();
const config = useRuntimeConfig();

await auth.fetchMe();
if (auth.isAuthenticated) {
  await navigateTo("/");
}

const STRAVA_AUTH_URL = "https://www.strava.com/oauth/authorize";

function connectWithStrava() {
  const params = new URLSearchParams({
    client_id: config.public.stravaClientId as string,
    redirect_uri: config.public.stravaRedirectUri as string,
    response_type: "code",
    approval_prompt: "auto",
    scope: "read,activity:read",
  });
  window.location.href = `${STRAVA_AUTH_URL}?${params.toString()}`;
}
</script>

<template>
  <div class="min-h-screen bg-base-100 flex items-center justify-center p-6">
    <div class="w-full max-w-3xl">
      <div class="flex flex-col gap-10 lg:hidden">
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
          >
            <span class="text-primary-content font-black text-base">S</span>
          </div>
          <span
            class="text-base-content/30 text-xs tracking-widest font-semibold uppercase"
            >Strava Wrapped</span
          >
        </div>

        <div class="flex flex-col gap-5">
          <h1
            class="text-base-content font-extrabold text-5xl leading-tight tracking-tight"
          >
            Los números<br /><span class="text-primary">no mienten.</span>
          </h1>
          <p class="text-base-content/40 text-sm leading-relaxed">
            Tu resumen semanal, listo para stories.
          </p>
          <ul class="flex flex-col gap-2">
            <li class="flex items-center gap-2 text-base-content/50 text-sm">
              <span class="text-primary">✓</span> Distancia, tiempo y calorías
            </li>
            <li class="flex items-center gap-2 text-base-content/50 text-sm">
              <span class="text-primary">✓</span> Desglose por deporte
            </li>
            <li class="flex items-center gap-2 text-base-content/50 text-sm">
              <span class="text-primary">✓</span> Racha semanal
            </li>
          </ul>
        </div>

        <div class="flex flex-col gap-2">
          <button
            class="btn btn-primary btn-lg rounded-full w-full font-bold"
            @click="connectWithStrava"
          >
            Ver mi resumen →
          </button>
          <p class="text-base-content/20 text-xs text-center">
            Solo lectura · Nunca publicamos en tu nombre
          </p>
        </div>
      </div>

      <div
        class="hidden lg:grid grid-cols-2 rounded-2xl overflow-hidden border border-base-content/10"
      >
        <div class="bg-base-100 p-12 flex flex-col justify-between">
          <span
            class="text-base-content/30 text-xs tracking-widest font-semibold uppercase"
            >Strava Wrapped</span
          >
          <div class="flex flex-col gap-5">
            <h1
              class="text-base-content font-extrabold text-4xl leading-tight tracking-tight"
            >
              Los números<br /><span class="text-primary">no mienten.</span>
            </h1>
            <p class="text-base-content/40 text-sm leading-relaxed">
              Tu resumen semanal, listo para stories.
            </p>
            <ul class="flex flex-col gap-2">
              <li class="flex items-center gap-2 text-base-content/50 text-xs">
                <span class="text-primary">✓</span> Distancia, tiempo y calorías
              </li>
              <li class="flex items-center gap-2 text-base-content/50 text-xs">
                <span class="text-primary">✓</span> Desglose por deporte
              </li>
              <li class="flex items-center gap-2 text-base-content/50 text-xs">
                <span class="text-primary">✓</span> Racha semanal
              </li>
            </ul>
          </div>
          <p class="text-base-content/20 text-xs">
            Solo lectura · Nunca publicamos en tu nombre
          </p>
        </div>
        <div class="bg-base-200 p-12 flex flex-col justify-center gap-6">
          <div
            class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center"
          >
            <span class="text-primary-content font-black text-2xl">S</span>
          </div>
          <div class="flex flex-col gap-2">
            <h2 class="text-base-content font-bold text-xl leading-tight">
              Una semana entera,<br />en un vistazo.
            </h2>
            <p class="text-base-content/40 text-sm">
              Conecta Strava y genera tu resumen al instante.
            </p>
          </div>
          <button
            class="btn btn-primary rounded-full font-bold"
            @click="connectWithStrava"
          >
            Ver mi resumen →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
