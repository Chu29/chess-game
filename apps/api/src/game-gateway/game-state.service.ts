import { Injectable, Logger } from '@nestjs/common';
import { GameResult, GameStatus, PlayerColor } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ActiveGame } from './handlers/make-move.handler';

export interface PersistMoveInput {
  from: string;
  to: string;
  promotion?: string | null;
  san: string;
  color: 'w' | 'b';
  moveNumber: number;
  fenAfter: string;
  turnAfter: 'w' | 'b';
}

export interface PersistGameEndInput {
  reason: string;
  winnerId: string | null;
}

/**
 * Holds live game state in memory and syncs it with the database.
 *
 * Games created by REST matchmaking exist as Prisma `Game` rows; the gateway
 * hydrates them lazily on first socket event. Games created by the in-memory
 * `findMatch` queue have no DB row, so persistence is skipped for them.
 */
@Injectable()
export class GameStateService {
  private readonly logger = new Logger(GameStateService.name);

  readonly activeGames = new Map<string, ActiveGame>();

  /** gameIds backed by a Prisma Game row (persistence enabled). */
  private readonly dbBacked = new Set<string>();

  constructor(private readonly prisma: PrismaService) {}

  /** Register an in-memory-only game (socket matchmaking queue). */
  register(gameId: string, game: ActiveGame): void {
    this.activeGames.set(gameId, game);
  }

  async getOrLoad(gameId: string): Promise<ActiveGame | null> {
    const cached = this.activeGames.get(gameId);
    if (cached) return cached;

    let row: {
      fen: string;
      whitePlayerId: string | null;
      blackPlayerId: string | null;
      status: GameStatus;
      drawOfferedBy: PlayerColor | null;
    } | null;
    try {
      row = await this.prisma.game.findUnique({
        where: { id: gameId },
      });
    } catch (err) {
      this.logger.error(`Failed to load game ${gameId}`, err as Error);
      return null;
    }
    if (!row || row.status !== GameStatus.ACTIVE) return null;

    const game: ActiveGame = {
      fen: row.fen,
      white: row.whitePlayerId ?? '',
      black: row.blackPlayerId ?? '',
      turn: row.fen.split(' ')[1] === 'b' ? 'b' : 'w',
      drawOfferedBy:
        row.drawOfferedBy === PlayerColor.WHITE
          ? row.whitePlayerId
          : row.drawOfferedBy === PlayerColor.BLACK
            ? row.blackPlayerId
            : null,
    };

    this.activeGames.set(gameId, game);
    this.dbBacked.add(gameId);
    return game;
  }

  async persistMove(gameId: string, move: PersistMoveInput): Promise<void> {
    if (!this.dbBacked.has(gameId)) return;

    try {
      await this.prisma.$transaction([
        this.prisma.game.update({
          where: { id: gameId },
          data: {
            fen: move.fenAfter,
            currentTurn:
              move.turnAfter === 'w' ? PlayerColor.WHITE : PlayerColor.BLACK,
            drawOfferedBy: null,
          },
        }),
        this.prisma.move.create({
          data: {
            gameId,
            moveNumber: move.moveNumber,
            color: move.color === 'w' ? PlayerColor.WHITE : PlayerColor.BLACK,
            from: move.from,
            to: move.to,
            promotion: move.promotion ?? null,
            san: move.san,
            fenAfterMove: move.fenAfter,
          },
        }),
      ]);
    } catch (err) {
      // In-memory state stays authoritative for the live session; the row
      // will be stale but gameplay must not break on a failed write.
      this.logger.error(
        `Failed to persist move for game ${gameId}`,
        err as Error,
      );
    }
  }

  async persistDrawOffer(gameId: string, offeredBy: string): Promise<void> {
    if (!this.dbBacked.has(gameId)) return;
    const game = this.activeGames.get(gameId);
    if (!game) return;

    const color =
      offeredBy === game.white ? PlayerColor.WHITE : PlayerColor.BLACK;
    try {
      await this.prisma.game.update({
        where: { id: gameId },
        data: { drawOfferedBy: color },
      });
    } catch (err) {
      this.logger.error(
        `Failed to persist draw offer for game ${gameId}`,
        err as Error,
      );
    }
  }

  async persistDrawCleared(gameId: string): Promise<void> {
    if (!this.dbBacked.has(gameId)) return;
    try {
      await this.prisma.game.update({
        where: { id: gameId },
        data: { drawOfferedBy: null },
      });
    } catch (err) {
      this.logger.error(
        `Failed to clear draw offer for game ${gameId}`,
        err as Error,
      );
    }
  }

  async persistGameEnd(
    gameId: string,
    end: PersistGameEndInput,
  ): Promise<void> {
    const game = this.activeGames.get(gameId);
    const isDbBacked = this.dbBacked.has(gameId);

    this.activeGames.delete(gameId);
    this.dbBacked.delete(gameId);

    if (!isDbBacked || !game) return;

    try {
      await this.prisma.game.update({
        where: { id: gameId },
        data: {
          status: GameStatus.FINISHED,
          result: this.toGameResult(end.reason),
          winnerId: end.winnerId,
          fen: game.fen,
          drawOfferedBy: null,
          endedAt: new Date(),
        },
      });
    } catch (err) {
      this.logger.error(
        `Failed to persist game end for ${gameId}`,
        err as Error,
      );
    }
  }

  private toGameResult(reason: string): GameResult {
    switch (reason) {
      case 'checkmate':
        return GameResult.CHECKMATE;
      case 'stalemate':
        return GameResult.STALEMATE;
      case 'resignation':
        return GameResult.RESIGNATION;
      case 'timeout':
        return GameResult.TIMEOUT;
      default:
        // threefold_repetition, insufficient_material, agreement, draw
        return GameResult.DRAW;
    }
  }
}
