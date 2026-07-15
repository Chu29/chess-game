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

  async join(userId: string, timeControl?: string) {
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
        });
        await tx.matchmakingQueue.delete({ where: { id: opponent.id } });
        return created;
      });

      return { status: 'matched' as const, game };
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

  async leave(userId: string) {
    const existing = await this.prisma.matchmakingQueue.findUnique({
      where: { userId },
    });
    if (!existing) {
      throw new NotFoundException('Not currently in matchmaking queue');
    }
    await this.prisma.matchmakingQueue.delete({ where: { userId } });
    return { status: 'left' as const };
  }

  async status(userId: string) {
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
    });

    if (activeGame) {
      return { status: 'matched' as const, game: activeGame };
    }

    return { status: 'idle' as const };
  }
}
