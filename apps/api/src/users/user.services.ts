import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GameStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private async resolveUserId(keycloakId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { keycloakId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.id;
  }

  async getStats(keycloakId: string) {
    const userId = await this.resolveUserId(keycloakId);

    const games = await this.prisma.game.findMany({
      where: {
        status: GameStatus.FINISHED,
        OR: [{ whitePlayerId: userId }, { blackPlayerId: userId }],
      },
      select: { winnerId: true, result: true },
    });

    const gamesPlayed = games.length;
    let wins = 0;
    let losses = 0;
    let draws = 0;

    for (const game of games) {
      if (game.result === 'DRAW' || game.result === 'STALEMATE') {
        draws++;
      } else if (game.winnerId === userId) {
        wins++;
      } else {
        losses++;
      }
    }

    const winRate =
      gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 1000) / 10 : 0;

    return { gamesPlayed, wins, losses, draws, winRate };
  }

  async getRecentGames(keycloakId: string, limit = 5) {
    const userId = await this.resolveUserId(keycloakId);

    const games = await this.prisma.game.findMany({
      where: {
        status: GameStatus.FINISHED,
        OR: [{ whitePlayerId: userId }, { blackPlayerId: userId }],
      },
      orderBy: { endedAt: 'desc' },
      take: limit,
      include: {
        whitePlayer: { select: { username: true } },
        blackPlayer: { select: { username: true } },
      },
    });

    return games.map((game) => {
      const isWhite = game.whitePlayerId === userId;
      const opponent = isWhite ? game.blackPlayer : game.whitePlayer;

      const outcome: 'WIN' | 'LOSS' | 'DRAW' =
        game.result === 'DRAW' || game.result === 'STALEMATE'
          ? 'DRAW'
          : game.winnerId === userId
            ? 'WIN'
            : 'LOSS';

      return {
        id: game.id,
        opponent:
          opponent?.username ?? (game.mode === 'AI' ? 'Chess Engine' : 'Unknown'),
        mode: game.mode,
        result: outcome,
        endedAt: game.endedAt,
      };
    });
  }

  async getRanking(keycloakId: string) {
    const userId = await this.resolveUserId(keycloakId);
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    const higherRatedCount = await this.prisma.user.count({
      where: { rating: { gt: user.rating } },
    });

    const totalPlayers = await this.prisma.user.count();

    return {
      rank: higherRatedCount + 1,
      totalPlayers,
      rating: user.rating,
    };
  }

  async getLeaderboard(limit = 20) {
    const topUsers = await this.prisma.user.findMany({
      orderBy: { rating: 'desc' },
      take: limit,
      select: {
        id: true,
        username: true,
        rating: true,
      },
    });

    return topUsers.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      username: user.username,
      rating: user.rating,
    }));
  }
}