<script setup lang="ts">
useSeoMeta({
  title: "Conectando con Strava…",
  robots: "noindex, nofollow",
});

const route = useRoute();
const code = route.query.code as string | undefined;

if (!code) {
  await navigateTo("/connect");
} else {
  await $fetch(`/api/auth/callback?code=${code}`);
  await navigateTo("/");
}
</script>

<template>
  <div class="min-h-screen bg-base-100 flex items-center justify-center">
    <span class="loading loading-spinner loading-lg text-primary" />
  </div>
</template>
