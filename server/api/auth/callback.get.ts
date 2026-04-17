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
      client_id: String(config.stravaClientId),
      client_secret: String(config.stravaClientSecret),
      code,
      grant_type: "authorization_code",
    }).toString(),
  });

  // Redirect to frontend with tokens as query params (client picks them up)
  const params = new URLSearchParams({
    access_token: response.access_token,
    refresh_token: response.refresh_token,
    expires_at: String(response.expires_at),
    athlete: JSON.stringify(response.athlete),
  });

  return sendRedirect(event, `/?${params.toString()}`);
});
