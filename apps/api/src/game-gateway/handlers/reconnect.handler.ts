import { Injectable } from '@nestjs/common';
import { ActiveGame } from './make-move.handler';

@Injectable()
export class ReconnectHandler {
  handle(game: ActiveGame, payload: { gameId: string; playerId: string }) {
    let playerColor: 'w' | 'b' | null = null;
    if (payload.playerId === game.white) {
      playerColor = 'w';
    } else if (payload.playerId === game.black) {
      playerColor = 'b';
    }

    if (!playerColor) {
      return { success: false, error: 'Not a player in this game' };
    }

    return {
      success: true,
      fen: game.fen,
      white: game.white,
      black: game.black,
      whiteUsername: game.whiteUsername,
      blackUsername: game.blackUsername,
      turn: game.turn,
      color: playerColor,
      drawOfferedBy: game.drawOfferedBy || null,
    };
  }
}
