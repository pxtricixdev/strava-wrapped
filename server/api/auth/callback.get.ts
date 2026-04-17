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

  let response: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    athlete: {
      id: number;
      firstname: string;
      lastname: string;
      profile: string;
    };
  };
  try {
    response = await $fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: String(config.public.stravaClientId),
        client_secret: String(config.stravaClientSecret),
        code,
        grant_type: "authorization_code",
      }).toString(),
    });
  } catch {
    throw createError({ statusCode: 502, statusMessage: "Failed to exchange Strava code" });
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  };

  const accessTokenTtl = response.expires_at - Math.floor(Date.now() / 1000);

  setCookie(event, "strava_access_token", response.access_token, {
    ...cookieOptions,
    maxAge: accessTokenTtl,
  });
  setCookie(event, "strava_refresh_token", response.refresh_token, cookieOptions); // 30 days
  setCookie(event, "strava_expires_at", String(response.expires_at), {
    ...cookieOptions,
    maxAge: accessTokenTtl,
  });
  setCookie(event, "strava_athlete", JSON.stringify(response.athlete), {
    ...cookieOptions,
    httpOnly: false, // el cliente necesita leer los datos del atleta para la UI
    // 30 days — athlete data remains valid even after access token expires
  });

  return sendRedirect(event, "/");
});
