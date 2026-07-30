import { Chess } from "chess.js";

export function countPieces(fen: string): number {
  const placement = fen.split(" ")[0] ?? "";
  return placement.replace(/[^a-zA-Z]/g, "").length;
}

export function isPositionInCheck(fen: string): boolean {
  try {
    return new Chess(fen).inCheck();
  } catch {
    return false;
  }
}
