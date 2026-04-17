import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface AthleteInfo {
  id: number;
  firstname: string;
  lastname: string;
  profile: string;
}

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const expiresAt = ref<number | null>(null);
  const athlete = ref<AthleteInfo | null>(null);

  const isAuthenticated = computed(() => {
    if (!accessToken.value || !expiresAt.value) return false;
    return Date.now() / 1000 < expiresAt.value;
  });

  function setTokens(
    _accessToken: string,
    _refreshToken: string,
    _expiresAt: number,
    _athlete: AthleteInfo,
  ) {
    accessToken.value = _accessToken;
    refreshToken.value = _refreshToken;
    expiresAt.value = _expiresAt;
    athlete.value = _athlete;
    persist();
  }

  function logout() {
    accessToken.value = null;
    refreshToken.value = null;
    expiresAt.value = null;
    athlete.value = null;
    if (import.meta.client) {
      localStorage.removeItem("strava-auth");
    }
  }

  function persist() {
    if (import.meta.client) {
      localStorage.setItem(
        "strava-auth",
        JSON.stringify({
          accessToken: accessToken.value,
          refreshToken: refreshToken.value,
          expiresAt: expiresAt.value,
          athlete: athlete.value,
        }),
      );
    }
  }

  function hydrate() {
    if (!import.meta.client) return;
    const raw = localStorage.getItem("strava-auth");
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      accessToken.value = data.accessToken;
      refreshToken.value = data.refreshToken;
      expiresAt.value = data.expiresAt;
      athlete.value = data.athlete;
    } catch {
      localStorage.removeItem("strava-auth");
    }
  }

  return {
    accessToken,
    refreshToken,
    expiresAt,
    athlete,
    isAuthenticated,
    setTokens,
    logout,
    persist,
    hydrate,
  };
});
