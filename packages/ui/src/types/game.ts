export type PlayerColor = "WHITE" | "BLACK";
export type GameMode = "PVP" | "AI";
export type GameStatus = "WAITING" | "ACTIVE" | "FINISHED";
export type GameResult =
  "CHECKMATE" | "STALEMATE" | "DRAW" | "RESIGNATION" | "TIMEOUT";
export type AIDifficulty = "EASY" | "MEDIUM" | "HARD";
export type CoachClassification =
  "BEST" | "GOOD" | "INACCURACY" | "MISTAKE" | "BLUNDER";

export interface User {
  id: string;
  username: string;
  email: string;
  rating: number;
  createdAt: string;
}

export interface Game {
  id: string;
  mode: GameMode;
  status: GameStatus;
  whitePlayer: User;
  blackPlayer: User;
  currentTurn: PlayerColor;
  fen: string;
  winner: string | null;
  result: GameResult | null;
  startedAt: string;
  endedAt: string | null;
}

export interface GameState {
  gameId: string;
  fen: string;
  currentTurn: PlayerColor;
  status: GameStatus;
  lastMove: string | null;
  check: boolean;
  result: GameResult | null;
}

export interface MoveRequest {
  from: string;
  to: string;
  promotion: string | null;
}

export interface Move {
  id: string;
  moveNumber: number;
  from: string;
  to: string;
  san: string;
  fenAfterMove: string;
  playedAt: string;
}

export interface GameActionRequest {
  gameId: string;
  action: "RESIGN" | "OFFER_DRAW" | "ACCEPT_DRAW" | "DECLINE_DRAW";
}

export interface HintResponse {
  bestMove: string;
  score: string;
  explanation: string;
}

export interface EvaluationRequest {
  from: string;
  to: string;
}

export interface EvaluationResponse {
  classification: CoachClassification;
  score: string;
  explanation: string;
}

export interface ExplanationResponse {
  summary: string;
  strengths: string[];
  weaknesses: string[];
}

export interface GameAnalysisResponse {
  accuracy: number;
  blunders: number;
  mistakes: number;
  inaccuracies: number;
  summary: string;
}
