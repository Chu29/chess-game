import { apiFetch } from "./api";

export type Game = {
  id: string;
  mode: "PVP" | "AI";
  status: "WAITING" | "ACTIVE" | "FINISHED";
  whitePlayerId: string | null;
  blackPlayerId: string | null;
  currentTurn: "WHITE" | "BLACK";
  fen: string;
};

type JoinResponse =
  | { status: "waiting"; queueEntry: { id: string; joinedAt: string } }
  | { status: "matched"; game: Game };

type StatusResponse =
  | { status: "waiting"; joinedAt: string }
  | { status: "matched"; game: Game }
  | { status: "idle" };

export const matchmakingApi = {
  join(timeControl?: string) {
    return apiFetch<JoinResponse>("/matchmaking/join", {
      method: "POST",
      body: JSON.stringify({ timeControl }),
    });
  },
  leave() {
    return apiFetch<{ status: "left" }>("/matchmaking/leave", {
      method: "DELETE",
    });
  },
  status() {
    return apiFetch<StatusResponse>("/matchmaking/status", {
      method: "GET",
    });
  },
};

export const gamesApi = {
  getById(gameId: string) {
    return apiFetch<Game>(`/games/${gameId}`, { method: "GET" });
  },
};
