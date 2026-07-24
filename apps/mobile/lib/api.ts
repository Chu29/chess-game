import { API_URL } from "./config";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "./tokenStore";

export type User = {
  id: string;
  username: string;
  email: string;
  rating: number;
  createdAt: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
};

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

export class AuthExpiredError extends Error {
  constructor() {
    super("Session expired");
    this.name = "AuthExpiredError";
  }
}

// Single-flight lock: concurrent 401s trigger only one refresh request.
let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) return false;

      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) return false;

      const data = (await response.json()) as AuthResponse;
      await saveTokens(data);
      return true;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function parseError(response: Response): Promise<ApiError> {
  try {
    const body = (await response.json()) as { message?: string | string[] };
    const message = Array.isArray(body.message)
      ? body.message.join(", ")
      : (body.message ?? response.statusText);
    return new ApiError(response.status, message);
  } catch {
    return new ApiError(response.status, response.statusText);
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const request = async (): Promise<Response> => {
    const accessToken = await getAccessToken();
    return fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      },
    });
  };

  let response = await request();

  if (response.status === 401) {
    const refreshed = await refreshTokens();
    if (!refreshed) {
      await clearTokens();
      throw new AuthExpiredError();
    }
    response = await request();
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

// Auth endpoints are unauthenticated — call fetch directly so a 401
// (wrong password) isn't misinterpreted as an expired session.
async function authRequest(path: string, body: object): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw await parseError(response);
  }
  const data = (await response.json()) as AuthResponse;
  await saveTokens(data);
  return data;
}

export const authApi = {
  register(username: string, email: string, password: string) {
    return authRequest("/auth/register", { username, email, password });
  },

  login(email: string, password: string) {
    return authRequest("/auth/login", { email, password });
  },

  me() {
    return apiFetch<User>("/auth/me");
  },

  async logout() {
    await clearTokens();
  },
};

export type AIDifficulty = "EASY" | "MEDIUM" | "HARD";
export type PlayerColor = "WHITE" | "BLACK";

export interface CreateAIGameRequest {
  difficulty: AIDifficulty;
  playerColor: PlayerColor;
}

export interface MoveRequest {
  from: string;
  to: string;
  promotion?: string;
}

export interface GameActionRequest {
  action: "RESIGN" | "OFFER_DRAW" | "ACCEPT_DRAW" | "DECLINE_DRAW";
}

export interface Game {
  id: string;
  mode: "PVP" | "AI";
  status: "WAITING" | "ACTIVE" | "FINISHED";
  whitePlayer: User;
  blackPlayer: User;
  currentTurn: PlayerColor;
  fen: string;
  initialAiMove?: { from: string; to: string };
  winner: string | null;
  result: string | null;
  startedAt: string;
  endedAt: string | null;
}

export interface MoveResponse {
  id: string;
  playerMove?: {
    from: string;
    to: string;
    san: string;
  };
  aiMove?: {
    from: string;
    to: string;
    san: string;
  };
  fen: string;
  currentTurn: PlayerColor;
  check: boolean;
  gameOver: boolean;
  result?: string;
  winner?: PlayerColor;
}

export interface GameState {
  gameId: string;
  fen: string;
  currentTurn: PlayerColor;
  status: "WAITING" | "ACTIVE" | "FINISHED";
  lastMove: string | null;
  check: boolean;
  result: string | null;
}

export const gamesApi = {
  createAIGame(request: CreateAIGameRequest) {
    return apiFetch<Game>("/games/ai", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  makeMove(gameId: string, request: MoveRequest) {
    return apiFetch<MoveResponse>(`/games/${gameId}/moves`, {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  getGameState(gameId: string) {
    return apiFetch<GameState>(`/games/${gameId}/state`);
  },

  performGameAction(gameId: string, request: GameActionRequest) {
    return apiFetch<{ action: string; gameStatus: string; message: string }>(
      `/games/${gameId}/actions`,
      {
        method: "POST",
        body: JSON.stringify(request),
      },
    );
  },
};
