import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface AthleteInfo {
  id: number;
  firstname: string;
  lastname: string;
  profile: string;
}

export const useAuthStore = defineStore("auth", () => {
  const athlete = ref<AthleteInfo | null>(null);
  const isAuthenticated = computed(() => athlete.value !== null);

  async function fetchMe() {
    try {
      athlete.value = await $fetch<AthleteInfo>("/api/auth/me");
    } catch {
      athlete.value = null;
    }
  }

  async function logout() {
    await $fetch("/api/auth/logout", { method: "POST" });
    athlete.value = null;
  }

  return { athlete, isAuthenticated, fetchMe, logout };
});
