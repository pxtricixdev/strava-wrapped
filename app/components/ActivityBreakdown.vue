<script setup lang="ts">
import type { ActivityByType } from "~/composables/useStrava";

const props = defineProps<{
  activities: ActivityByType[];
}>();

const { sportLabel, formatDuration, isDistanceSport } = useStrava();

const SPORT_COLORS: Record<string, string> = {
  Ride: "#4ade80",
  VirtualRide: "#4ade80",
  Run: "#818cf8",
  TrailRun: "#818cf8",
  Walk: "#fbbf24",
  Hike: "#fbbf24",
  Swim: "#38bdf8",
  WeightTraining: "#f87171",
  Crossfit: "#f87171",
  Workout: "#f472b6",
  Yoga: "#a78bfa",
};

const SPORT_EMOJIS: Record<string, string> = {
  Ride: "🚴",
  VirtualRide: "🚴",
  Run: "🏃",
  TrailRun: "🏃",
  Walk: "🚶",
  Hike: "🥾",
  Swim: "🏊",
  WeightTraining: "🏋️",
  Crossfit: "🏋️",
  Workout: "💪",
  Yoga: "🧘",
};

function barColor(sportType: string): string {
  return SPORT_COLORS[sportType] ?? "#fc4c02";
}

function sportEmoji(sportType: string): string {
  return SPORT_EMOJIS[sportType] ?? "🏅";
}

const maxDistance = computed(
  () =>
    Math.max(
      ...props.activities
        .filter((a) => isDistanceSport(a.sport_type))
        .map((a) => a.distance_km),
      0,
    ) || 1,
);

const maxTime = computed(
  () =>
    Math.max(
      ...props.activities
        .filter((a) => !isDistanceSport(a.sport_type))
        .map((a) => a.moving_time_seconds),
      0,
    ) || 1,
);

function barValue(activity: ActivityByType): number {
  const ratio = isDistanceSport(activity.sport_type)
    ? activity.distance_km / maxDistance.value
    : activity.moving_time_seconds / maxTime.value;
  return ratio * 100;
}

function rightLabel(activity: ActivityByType): string {
  return isDistanceSport(activity.sport_type)
    ? `${activity.distance_km} km`
    : formatDuration(activity.moving_time_seconds);
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <span
      class="text-base-content/30 text-xs tracking-widest font-semibold uppercase"
      >Por tipo</span
    >
    <div
      v-for="activity in activities"
      :key="activity.sport_type"
      class="flex items-center gap-3"
    >
      <div>
        <div
          class="w-7 h-7 rounded-md flex items-center justify-center text-sm"
          :style="{ backgroundColor: `${barColor(activity.sport_type)}b3` }"
        >
          {{ sportEmoji(activity.sport_type) }}
        </div>
      </div>
      <div class="flex flex-col flex-1 gap-1">
        <div class="flex justify-between">
          <span class="text-base-content text-sm font-semibold">
            {{ sportLabel(activity.sport_type) }}
            <span class="text-base-content/30 font-normal text-xs ml-1"
              >{{ activity.count }}
              {{ activity.count === 1 ? "entreno" : "entrenos" }}</span
            >
          </span>
          <span class="text-base-content/50 text-xs">{{
            rightLabel(activity)
          }}</span>
        </div>
        <progress
          class="progress w-full h-1"
          :value="barValue(activity)"
          max="100"
          :style="{ color: barColor(activity.sport_type) }"
        />
      </div>
    </div>
  </div>
</template>
