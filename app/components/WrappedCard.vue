<script setup lang="ts">
import type { WeeklyStats } from "~/composables/useStrava";

const props = defineProps<{
  stats: WeeklyStats;
  formatDuration: (s: number) => string;
  formatShortDate: (iso: string) => string;
  sportLabel: (sport: string) => string;
}>();
</script>

<template>
  <div
    class="bg-base-100 rounded-2xl p-5 flex flex-col gap-5 w-full lg:border lg:border-base-content/10 lg:p-6"
  >
    <div class="flex justify-between items-center">
      <span
        class="text-base-content/30 text-xs tracking-widest font-semibold uppercase"
        >Esta semana</span
      >
      <div class="badge text-xs font-bold bg-primary">● Strava</div>
    </div>

    <div class="flex flex-col gap-5 lg:grid lg:grid-cols-2 lg:gap-6">
      <div class="flex flex-col gap-5 lg:gap-4">
        <div class="text-center flex flex-col gap-1">
          <span class="text-base-content/30 text-xs">
            {{ formatShortDate(stats.week_start) }} –
            {{ formatShortDate(stats.week_end) }} ·
            {{ new Date(stats.week_start + "T00:00:00Z").getUTCFullYear() }}
          </span>
          <div class="leading-none">
            <span
              class="text-base-content font-extrabold text-7xl tracking-tighter"
              >{{ stats.total_distance_km }}</span
            >
            <span class="text-primary font-bold text-3xl">km</span>
          </div>
          <span class="text-base-content/30 text-xs tracking-widest uppercase"
            >Distancia total</span
          >
        </div>

        <div class="border-t border-base-content/10 lg:hidden" />

        <StatGrid
          :moving-time-formatted="
            formatDuration(stats.total_moving_time_seconds)
          "
          :total-activities="stats.total_activities"
          :elevation-m="stats.total_elevation_m"
          :calories="stats.total_calories"
        />
      </div>

      <div class="flex flex-col gap-5 lg:gap-4 lg:justify-between">
        <ActivityBreakdown
          :activities="stats.by_type"
          :sport-label="sportLabel"
        />

        <StreakBar
          :streak-days="stats.streak_days"
          :active-days="stats.active_days"
        />
      </div>
    </div>
  </div>
</template>
