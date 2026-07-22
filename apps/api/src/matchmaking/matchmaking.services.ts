import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GameMode, GameStatus, PlayerColor } from '@prisma/client';

const RATING_RANGE = 200;

@Injectable()
export class MatchmakingService {
  constructor(private prisma: PrismaService) {}

  private async resolveUserId(keycloakId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { keycloakId } });
    if (!user) {
      throw new NotFoundException('User not found — call GET /auth/me first');
    }
    return user.id;
  }

  async join(keycloakId: string, timeControl?: string) {
    const userId = await this.resolveUserId(keycloakId);

    const existing = await this.prisma.matchmakingQueue.findUnique({
      where: { userId },
    });
    if (existing) {
      throw new ConflictException('Already in matchmaking queue');
    }

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    const opponent = await this.prisma.matchmakingQueue.findFirst({
      where: {
        timeControl: timeControl ?? null,
        ratingAtQueue: {
          gte: user.rating - RATING_RANGE,
          lte: user.rating + RATING_RANGE,
        },
      },
      orderBy: { joinedAt: 'asc' },
    });

    if (opponent) {
      const game = await this.prisma.$transaction(async (tx) => {
        const created = await tx.game.create({
          data: {
            mode: GameMode.PVP,
            status: GameStatus.ACTIVE,
            whitePlayerId: opponent.userId,
            blackPlayerId: userId,
            timeControl: timeControl ?? null,
            currentTurn: PlayerColor.WHITE,
          },
          include: {
            whitePlayer: { select: { username: true } },
            blackPlayer: { select: { username: true } },
          },
        });
        await tx.matchmakingQueue.delete({ where: { id: opponent.id } });
        return created;
      });

      console.log('Game created with players:', {
        whitePlayer: game.whitePlayer,
        blackPlayer: game.blackPlayer,
      });

      // Flatten the game object to include usernames at the top level
      const flattenedGame = {
        ...game,
        whiteUsername: game.whitePlayer?.username || 'Unknown',
        blackUsername: game.blackPlayer?.username || 'Unknown',
      };

      console.log('Flattened game:', {
        whiteUsername: flattenedGame.whiteUsername,
        blackUsername: flattenedGame.blackUsername,
      });

      return { status: 'matched' as const, game: flattenedGame };
    }

    const queueEntry = await this.prisma.matchmakingQueue.create({
      data: {
        userId,
        ratingAtQueue: user.rating,
        timeControl: timeControl ?? null,
      },
    });

    return { status: 'waiting' as const, queueEntry };
  }

  async leave(keycloakId: string) {
    const userId = await this.resolveUserId(keycloakId);

    const existing = await this.prisma.matchmakingQueue.findUnique({
      where: { userId },
    });
    if (!existing) {
      throw new NotFoundException('Not currently in matchmaking queue');
    }
    await this.prisma.matchmakingQueue.delete({ where: { userId } });
    return { status: 'left' as const };
  }

  async status(keycloakId: string) {
    const userId = await this.resolveUserId(keycloakId);

    const queueEntry = await this.prisma.matchmakingQueue.findUnique({
      where: { userId },
    });
    if (queueEntry) {
      return { status: 'waiting' as const, joinedAt: queueEntry.joinedAt };
    }

    const activeGame = await this.prisma.game.findFirst({
      where: {
        status: GameStatus.ACTIVE,
        OR: [{ whitePlayerId: userId }, { blackPlayerId: userId }],
      },
      orderBy: { startedAt: 'desc' },
      include: {
        whitePlayer: { select: { username: true } },
        blackPlayer: { select: { username: true } },
      },
    });

    if (activeGame) {
      // Flatten the game object to include usernames at the top level
      const flattenedGame = {
        ...activeGame,
        whiteUsername: activeGame.whitePlayer?.username || 'Unknown',
        blackUsername: activeGame.blackPlayer?.username || 'Unknown',
      };
      return { status: 'matched' as const, game: flattenedGame };
    }

    return { status: 'idle' as const };
  }

  // Used by the game screen to fetch full game state by id
  async getGameById(gameId: string) {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: {
        whitePlayer: { select: { username: true } },
        blackPlayer: { select: { username: true } },
      },
    });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return {
      ...game,
      whiteUsername: game.whitePlayer?.username || 'Unknown',
      blackUsername: game.blackPlayer?.username || 'Unknown',
    };
  }
}
