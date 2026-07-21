import { Injectable } from '@nestjs/common';
import { ActiveGame } from './make-move.handler';

@Injectable()
export class GameActionHandler {
  handleResign(
    game: ActiveGame,
    payload: { gameId: string; playerId: string },
  ) {
    let winnerColor: 'w' | 'b';
    let loserColor: 'w' | 'b';

    if (payload.playerId === game.white) {
      winnerColor = 'b';
      loserColor = 'w';
    } else if (payload.playerId === game.black) {
      winnerColor = 'w';
      loserColor = 'b';
    } else {
      return { success: false as const, error: 'Not a player in this game' };
    }

    return {
      success: true as const,
      action: 'resign' as const,
      winnerColor,
      loserColor,
      winnerId: winnerColor === 'w' ? game.white : game.black,
      reason: 'resignation',
    };
  }

  handleDrawOffer(
    game: ActiveGame,
    payload: { gameId: string; playerId: string },
  ) {
    if (payload.playerId !== game.white && payload.playerId !== game.black) {
      return { success: false as const, error: 'Not a player in this game' };
    }

    if (game.drawOfferedBy) {
      if (game.drawOfferedBy === payload.playerId) {
        return {
          success: false as const,
          error: 'Draw already offered by you',
        };
      } else {
        // Opponent had already offered draw, so this accepts it!
        return this.handleAcceptDraw(game, payload);
      }
    }

    game.drawOfferedBy = payload.playerId;

    return {
      success: true as const,
      action: 'drawOffer' as const,
      offeredBy: payload.playerId,
    };
  }

  handleDeclineDraw(
    game: ActiveGame,
    payload: { gameId: string; playerId: string },
  ) {
    if (payload.playerId !== game.white && payload.playerId !== game.black) {
      return { success: false as const, error: 'Not a player in this game' };
    }

    if (!game.drawOfferedBy) {
      return {
        success: false as const,
        error: 'No active draw offer to decline',
      };
    }

    if (game.drawOfferedBy === payload.playerId) {
      return {
        success: false as const,
        error: 'Cannot decline your own draw offer',
      };
    }

    game.drawOfferedBy = null;

    return {
      success: true as const,
      action: 'drawDecline' as const,
      declinedBy: payload.playerId,
    };
  }

  handleAcceptDraw(
    game: ActiveGame,
    payload: { gameId: string; playerId: string },
  ) {
    if (payload.playerId !== game.white && payload.playerId !== game.black) {
      return { success: false as const, error: 'Not a player in this game' };
    }

    if (!game.drawOfferedBy) {
      return {
        success: false as const,
        error: 'No active draw offer to accept',
      };
    }

    if (game.drawOfferedBy === payload.playerId) {
      return {
        success: false as const,
        error: 'Cannot accept your own draw offer',
      };
    }

    game.drawOfferedBy = null;

    return {
      success: true as const,
      action: 'drawAccept' as const,
      reason: 'agreement',
    };
  }
}
