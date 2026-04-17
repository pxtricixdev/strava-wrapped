export default defineEventHandler((event) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };

  deleteCookie(event, "strava_access_token", cookieOptions);
  deleteCookie(event, "strava_refresh_token", cookieOptions);
  deleteCookie(event, "strava_expires_at", cookieOptions);
  deleteCookie(event, "strava_athlete", { ...cookieOptions, httpOnly: false });

  return { ok: true };
});
