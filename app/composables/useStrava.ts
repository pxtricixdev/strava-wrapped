import { useAuthStore } from "~/stores/auth";

interface ActivityByType {
  sport_type: string;
  count: number;
  distance_km: number;
}

export interface WeeklyStats {
  week_start: string;
  week_end: string;
  total_distance_km: number;
  total_moving_time_seconds: number;
  total_activities: number;
  total_elevation_m: number;
  total_calories: number;
  by_type: ActivityByType[];
  active_days: number;
  streak_days: boolean[];
}

export function useStrava() {
  const auth = useAuthStore();

  const stats = ref<WeeklyStats | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchWeeklyStats() {
    if (!auth.isAuthenticated) {
      error.value = "Not authenticated";
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      stats.value = await $fetch<WeeklyStats>("/api/strava/weekly");
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : "Error fetching data";
    } finally {
      loading.value = false;
    }
  }

  // Format seconds to "4h 32m" or "45m"
  function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  }

  // Format ISO Date "2025-04-07" to "7 abr"
  function formatShortDate(iso: string): string {
    const d = new Date(iso + "T00:00:00Z");
    return d.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    });
  }

  // Map Strava sport types to labels in Spanish
  function sportLabel(sportType: string): string {
    const labels: Record<string, string> = {
      Ride: "Ciclismo",
      VirtualRide: "Ciclismo virtual",
      Run: "Running",
      TrailRun: "Trail",
      Walk: "Caminar",
      Hike: "Senderismo",
      Swim: "Natación",
      WeightTraining: "Entrenamiento de fuerza",
      Workout: "Entrenamiento funcional",
      Yoga: "Yoga",
      Crossfit: "Crossfit",
    };
    return labels[sportType] ?? sportType;
  }

  return {
    stats,
    loading,
    error,
    fetchWeeklyStats,
    formatDuration,
    formatShortDate,
    sportLabel,
  };
}
