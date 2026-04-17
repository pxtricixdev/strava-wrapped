export default defineEventHandler((event) => {
  const accessToken = getCookie(event, "strava_access_token");
  const expiresAt = getCookie(event, "strava_expires_at");
  const athleteRaw = getCookie(event, "strava_athlete");

  if (!accessToken || !expiresAt || !athleteRaw) {
    throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
  }

  const expiresAtNum = Number(expiresAt);
  if (Date.now() / 1000 >= expiresAtNum) {
    throw createError({ statusCode: 401, statusMessage: "Token expired" });
  }

  return JSON.parse(athleteRaw) as {
    id: number;
    firstname: string;
    lastname: string;
    profile: string;
  };
});
