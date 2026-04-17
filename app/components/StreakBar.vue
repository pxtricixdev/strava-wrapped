<script setup lang="ts">
const props = defineProps<{
  streakDays: boolean[];
  activeDays: number;
}>();
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-between items-end">
      <span class="text-primary text-3xl font-extrabold"
        >{{ activeDays }} días</span
      >
    </div>
    <div class="flex gap-1">
      <div
        v-for="(active, i) in streakDays"
        :key="i"
        class="flex-1 h-1.5 rounded-full"
        :class="active ? 'bg-primary' : 'bg-base-content/10'"
      />
    </div>
  </div>
</template>
