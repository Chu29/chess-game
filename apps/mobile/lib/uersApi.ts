import { apiFetch } from "./api";

export type UserStats = {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
};

export type RecentGame = {
  id: string;
  opponent: string;
  mode: "PVP" | "AI";
  result: "WIN" | "LOSS" | "DRAW";
  endedAt: string;
};

export type UserRank = {
  rank: number;
  totalPlayers: number;
  rating: number;
};

export type LeaderboardEntry = {
  rank: number;
  id: string;
  username: string;
  rating: number;
};

export const usersApi = {
  getStats() {
    return apiFetch<UserStats>("/users/me/stats", { method: "GET" });
  },
  getRecentGames(limit?: number) {
    const query = limit ? `?limit=${limit}` : "";
    return apiFetch<RecentGame[]>(`/users/me/games${query}`, { method: "GET" });
  },
  getRank() {
    return apiFetch<UserRank>("/users/me/rank", { method: "GET" });
  },
  getLeaderboard(limit?: number) {
    const query = limit ? `?limit=${limit}` : "";
    return apiFetch<LeaderboardEntry[]>(`/users/leaderboard${query}`, {
      method: "GET",
    });
  },
};
