import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { GameStateService } from '../game-gateway/game-state.service';

const MAX_HINTS_PER_GAME = 5;

/**
 * Tracks hint usage per (gameId, playerId), reusing the existing ActiveGame
 * session object in GameStateService rather than a separate store — hints
 * reset naturally whenever a new ActiveGame is created (new match), exactly
 * per the brief's "reset only when a completely new game starts."
 */
@Injectable()
export class HintService {
  constructor(private readonly gameState: GameStateService) {}

  async getRemaining(gameId: string, playerId: string): Promise<number> {
    const game = await this.gameState.getOrLoad(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    const used = game.hintsUsed?.[playerId] ?? 0;
    return Math.max(0, MAX_HINTS_PER_GAME - used);
  }

  /** Throws if the player has none left; otherwise increments and returns the new remaining count. */
  async consume(gameId: string, playerId: string): Promise<number> {
    const game = await this.gameState.getOrLoad(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    if (!game.hintsUsed) {
      game.hintsUsed = {};
    }

    const used = game.hintsUsed[playerId] ?? 0;
    if (used >= MAX_HINTS_PER_GAME) {
      throw new ForbiddenException('No hints remaining for this game');
    }

    game.hintsUsed[playerId] = used + 1;
    return MAX_HINTS_PER_GAME - (used + 1);
  }
}
