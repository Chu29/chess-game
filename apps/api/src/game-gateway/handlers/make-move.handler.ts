import { Injectable } from '@nestjs/common';
import { Chess } from 'chess.js';

export interface ActiveGame {
  fen: string;
  white: string;
  black: string;
  whiteUsername: string;
  blackUsername: string;
  turn: 'w' | 'b';
  drawOfferedBy?: string | null;
  hintsUsed?: Record<string, number>;
}

@Injectable()
export class MakeMoveHandler {
  handle(
    game: ActiveGame,
    payload: {
      from: string;
      to: string;
      promotion?: string;
      playerId: string;
    },
  ) {
    // 1. Verify turn security
    const expectedPlayer = game.turn === 'w' ? game.white : game.black;
    if (payload.playerId !== expectedPlayer) {
      return { success: false as const, error: 'Not your turn!' };
    }

    // 2. Validate and execute move via chess.js
    const chess = new Chess(game.fen);
    // Fullmove number before the move — this is the number the move is
    // recorded under (increments only after Black moves).
    const moveNumber = chess.moveNumber();
    const moverColor = chess.turn();
    try {
      const move = chess.move({
        from: payload.from,
        to: payload.to,
        promotion: payload.promotion || 'q',
      });

      if (!move) {
        return { success: false as const, error: 'Invalid move!' };
      }

      // 3. Update game state
      game.fen = chess.fen();
      game.turn = chess.turn();

      // Reset any active draw offer once a move is made
      game.drawOfferedBy = null;

      const isGameOver = chess.isGameOver();
      const isCheckmate = chess.isCheckmate();
      const isDraw = chess.isDraw();
      const isStalemate = chess.isStalemate();
      const isThreefoldRepetition = chess.isThreefoldRepetition();
      const isInsufficientMaterial = chess.isInsufficientMaterial();

      let resultReason: string | undefined;
      if (isCheckmate) resultReason = 'checkmate';
      else if (isStalemate) resultReason = 'stalemate';
      else if (isThreefoldRepetition) resultReason = 'threefold_repetition';
      else if (isInsufficientMaterial) resultReason = 'insufficient_material';
      else if (isDraw) resultReason = 'draw';

      return {
        success: true as const,
        fen: game.fen,
        turn: game.turn,
        lastMove: { from: payload.from, to: payload.to },
        san: move.san,
        color: moverColor,
        moveNumber,
        promotion: move.promotion ?? null,
        isCheck: chess.isCheck(),
        isGameOver,
        resultReason,
      };
    } catch {
      return { success: false as const, error: 'Invalid move!' };
    }
  }
}
