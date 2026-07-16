const API_BASE_URL = "http://192.168.1.152:3000"; // your LAN IP — re-check with `hostname -I` if it stops connecting

// TEMPORARY — matches apps/api's dev-auth.stub.ts.
// Swap for a real Authorization: Bearer token once Keycloak lands on mobile.
const DEV_USER_ID = "test-user-1";

async function apiRequest(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-dev-user-id": DEV_USER_ID,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${response.status}`);
  }

  return response.json();
}

export const matchmakingApi = {
  join: (timeControl?: string) =>
    apiRequest("/matchmaking/join", {
      method: "POST",
      body: JSON.stringify({ timeControl }),
    }),

  leave: () => apiRequest("/matchmaking/leave", { method: "DELETE" }),

  status: () => apiRequest("/matchmaking/status", { method: "GET" }),
};
