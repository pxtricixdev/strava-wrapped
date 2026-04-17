export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query.code as string;

  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing code parameter",
    });
  }

  const config = useRuntimeConfig();

  const response = await $fetch<{
    access_token: string;
    refresh_token: string;
    expires_at: number;
    athlete: {
      id: number;
      firstname: string;
      lastname: string;
      profile: string;
    };
  }>("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: String(config.public.stravaClientId),
      client_secret: String(config.stravaClientSecret),
      code,
      grant_type: "authorization_code",
    }).toString(),
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  };

  setCookie(event, "strava_access_token", response.access_token, cookieOptions);
  setCookie(event, "strava_refresh_token", response.refresh_token, cookieOptions);
  setCookie(event, "strava_expires_at", String(response.expires_at), cookieOptions);
  setCookie(event, "strava_athlete", JSON.stringify(response.athlete), {
    ...cookieOptions,
    httpOnly: false, // el cliente necesita leer los datos del atleta para la UI
  });

  return sendRedirect(event, "/");
});
