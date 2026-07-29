import { ForbiddenException, Injectable } from '@nestjs/common';
import { GameStateService } from '../game-gateway/game-state.service';

const MAX_HINTS_PER_GAME = 5;

/**
 * Tracks hint usage per (gameId, playerId).
 *
 * Two modes, same public API:
 *  - Real games (PvP today, PvAI once the teammate's session backend lands):
 *    counts live on the existing ActiveGame.hintsUsed, via GameStateService.
 *    Resets naturally whenever a new ActiveGame is created.
 *  - Practice / local-only sessions (e.g. the current PlayvsAi.tsx screen,
 *    which has no server-tracked game session yet): falls back to an
 *    in-memory Map keyed by the client-generated gameId. The client mints a
 *    fresh id each time it starts a new practice session, so this resets
 *    the same way — "new game" just means "new id" here instead of a new
 *    ActiveGame row.
 *
 * Once PvAI gets a real backend session, its gameId will resolve via
 * GameStateService and it'll transparently use the first path — no client
 * changes needed.
 */
@Injectable()
export class HintService {
  private readonly practiceHintsUsed = new Map<string, number>();

  constructor(private readonly gameState: GameStateService) {}

  async getRemaining(gameId: string, playerId: string): Promise<number> {
    const game = await this.gameState.getOrLoad(gameId);
    if (game) {
      const used = game.hintsUsed?.[playerId] ?? 0;
      return Math.max(0, MAX_HINTS_PER_GAME - used);
    }

    const used =
      this.practiceHintsUsed.get(this.practiceKey(gameId, playerId)) ?? 0;
    return Math.max(0, MAX_HINTS_PER_GAME - used);
  }

  /** Throws if the player has none left; otherwise increments and returns the new remaining count. */
  async consume(gameId: string, playerId: string): Promise<number> {
    const game = await this.gameState.getOrLoad(gameId);

    if (game) {
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

    const key = this.practiceKey(gameId, playerId);
    const used = this.practiceHintsUsed.get(key) ?? 0;
    if (used >= MAX_HINTS_PER_GAME) {
      throw new ForbiddenException('No hints remaining for this game');
    }
    this.practiceHintsUsed.set(key, used + 1);
    return MAX_HINTS_PER_GAME - (used + 1);
  }

  private practiceKey(gameId: string, playerId: string): string {
    return `${gameId}:${playerId}`;
  }
}
