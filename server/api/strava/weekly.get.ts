interface StravaActivity {
  id: number;
  name: string;
  sport_type: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
  calories: number;
  start_date: string;
}

interface ActivityByType {
  sport_type: string;
  count: number;
  distance_km: number;
}

interface WeeklyStats {
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

function getMondayOfCurrentWeek(): Date {
  const now = new Date();
  const day = now.getUTCDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
}

export default defineEventHandler(async (event): Promise<WeeklyStats> => {
  const authHeader = getHeader(event, "authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusMessage: "Missing authorization header",
    });
  }
  const token = authHeader.replace("Bearer ", "");

  const monday = getMondayOfCurrentWeek();
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  sunday.setUTCHours(23, 59, 59, 999);

  const activities = await $fetch<StravaActivity[]>(
    "https://www.strava.com/api/v3/athlete/activities",
    {
      headers: { Authorization: `Bearer ${token}` },
      query: {
        after: Math.floor(monday.getTime() / 1000),
        before: Math.floor(sunday.getTime() / 1000),
        per_page: 100,
      },
    },
  );

  // Aggregate stats
  let totalDistance = 0;
  let totalTime = 0;
  let totalElevation = 0;
  let totalCalories = 0;
  const byTypeMap = new Map<string, { count: number; distance: number }>();
  const activeDaysSet = new Set<number>(); // day-of-week index 0=Mon

  for (const a of activities) {
    totalDistance += a.distance;
    totalTime += a.moving_time;
    totalElevation += a.total_elevation_gain;
    totalCalories += a.calories || 0;

    const existing = byTypeMap.get(a.sport_type) ?? { count: 0, distance: 0 };
    byTypeMap.set(a.sport_type, {
      count: existing.count + 1,
      distance: existing.distance + a.distance,
    });

    const actDate = new Date(a.start_date);
    const dayOfWeek = actDate.getUTCDay();
    const mondayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Mon=0, Sun=6
    activeDaysSet.add(mondayIndex);
  }

  const byType: ActivityByType[] = Array.from(byTypeMap.entries())
    .map(([sport_type, data]) => ({
      sport_type,
      count: data.count,
      distance_km: Math.round((data.distance / 1000) * 10) / 10,
    }))
    .sort((a, b) => b.distance_km - a.distance_km);

  const streakDays = Array.from({ length: 7 }, (_, i) => activeDaysSet.has(i));

  return {
    week_start: monday.toISOString().substring(0, 10),
    week_end: sunday.toISOString().substring(0, 10),
    total_distance_km: Math.round((totalDistance / 1000) * 10) / 10,
    total_moving_time_seconds: totalTime,
    total_activities: activities.length,
    total_elevation_m: Math.round(totalElevation),
    total_calories: Math.round(totalCalories),
    by_type: byType,
    active_days: activeDaysSet.size,
    streak_days: streakDays,
  };
});
