<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useStrava } from "~/composables/useStrava";
import { useShare } from "~/composables/useShare";

useSeoMeta({
  title: "Mi resumen semanal · Strava Wrapped",
  description:
    "Tu resumen semanal de Strava con distancia, tiempo, calorías, desglose por deporte y racha. Listo para compartir.",
  robots: "noindex, nofollow",
});

const auth = useAuthStore();
const {
  stats,
  loading,
  error,
  fetchWeeklyStats,
  formatDuration,
  formatShortDate,
  sportLabel,
} = useStrava();
const { sharing, shareAsImage } = useShare();

const wrappedCardRef = ref<HTMLElement | null>(null);

// Hydrate user on page load
await auth.fetchMe();

if (!auth.isAuthenticated) {
  await navigateTo("/connect");
}

// Fetch stats after authentication
await fetchWeeklyStats();

async function handleShare() {
  const el = wrappedCardRef.value;
  if (!el) return;
  await shareAsImage(el);
}
</script>

<template>
  <div
    class="min-h-screen bg-base-100 flex flex-col items-center justify-start p-4 pb-24 lg:pb-8"
  >
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <span class="loading loading-spinner loading-lg text-primary" />
    </div>

    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center min-h-screen gap-4"
    >
      <p class="text-error text-sm">{{ error }}</p>
      <button
        class="btn btn-primary btn-sm rounded-full"
        @click="navigateTo('/connect')"
      >
        Reconectar
      </button>
    </div>

    <template v-else-if="stats">
      <div ref="wrappedCardRef" class="w-full max-w-sm lg:max-w-3xl lg:mt-8">
        <WrappedCard
          :stats="stats"
          :format-duration="formatDuration"
          :format-short-date="formatShortDate"
          :sport-label="sportLabel"
        />
      </div>

      <div
        class="fixed bottom-4 left-4 right-4 lg:static lg:mt-4 lg:w-full lg:max-w-3xl"
      >
        <button
          class="btn btn-primary btn-lg rounded-full w-full font-bold"
          :disabled="sharing"
          @click="handleShare"
        >
          <span v-if="sharing" class="loading loading-spinner loading-sm" />
          <span v-else>Compartir resumen</span>
        </button>
      </div>
    </template>
  </div>
</template>
