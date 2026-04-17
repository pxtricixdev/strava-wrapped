<script setup lang="ts">
defineProps<{
  movingTimeFormatted: string;
  totalActivities: number;
  elevationM: number;
  calories: number;
}>();
</script>

<template>
  <div class="grid grid-cols-2 gap-2">
    <div class="bg-base-200 rounded-xl p-3">
      <p class="text-base-content font-bold text-lg">
        {{ movingTimeFormatted }}
      </p>
      <p class="text-base-content/30 text-xs mt-0.5">tiempo activo</p>
    </div>
    <div class="bg-base-200 rounded-xl p-3">
      <p class="text-primary font-bold text-lg">{{ totalActivities }}</p>
      <p class="text-base-content/30 text-xs mt-0.5">actividades</p>
    </div>
    <div class="bg-base-200 rounded-xl p-3">
      <p class="text-base-content font-bold text-lg">
        {{ elevationM.toLocaleString("es-ES") }}m
      </p>
      <p class="text-base-content/30 text-xs mt-0.5">desnivel</p>
    </div>
    <div class="bg-base-200 rounded-xl p-3">
      <p class="text-base-content font-bold text-lg">
        {{ calories.toLocaleString("es-ES") }}
      </p>
      <p class="text-base-content/30 text-xs mt-0.5">calorías</p>
    </div>
  </div>
</template>
