import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { MatchmakingService } from '../matchmaking/matchmaking.services';
import { StockfishService } from '../ai/stockfish.service';
import { PrismaService } from '../prisma/prisma.service';
import { Chess } from 'chess.js';

interface CreateAIGameRequest {
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  playerColor: 'WHITE' | 'BLACK';
}

interface MoveRequest {
  from: string;
  to: string;
  promotion?: string;
}

interface GameActionRequest {
  action: 'RESIGN' | 'OFFER_DRAW' | 'ACCEPT_DRAW' | 'DECLINE_DRAW';
}

@Controller('games')
export class GamesController {
  private aiGames = new Map<
    string,
    {
      chess: Chess;
      difficulty: 'EASY' | 'MEDIUM' | 'HARD';
      playerColor: 'WHITE' | 'BLACK';
      status: 'ACTIVE' | 'FINISHED';
      result?: 'CHECKMATE' | 'STALEMATE' | 'DRAW' | 'RESIGNATION';
      winner?: 'WHITE' | 'BLACK';
    }
  >();

  constructor(
    private matchmakingService: MatchmakingService,
    private stockfishService: StockfishService,
    private prisma: PrismaService,
  ) {}

  @Get(':gameId')
  getGame(@Param('gameId') gameId: string) {
    return this.matchmakingService.getGameById(gameId);
  }

  @Post('ai')
  async createAIGame(@Body() body: CreateAIGameRequest) {
    const chess = new Chess();
    let initialAiMove: { from: string; to: string } | undefined = undefined;

    const createdGame = await this.prisma.game.create({
      data: {
        mode: 'AI',
        status: 'ACTIVE',
        difficulty: body.difficulty,
        currentTurn: 'WHITE',
        fen: chess.fen(),
      },
    });

    const gameId = createdGame.id;

    if (body.playerColor === 'BLACK') {
      try {
        const move = await this.stockfishService.getBestMoveForPosition(
          chess.fen(),
          body.difficulty,
        );
        const aiMove = chess.move({
          from: move.from,
          to: move.to,
          promotion: move.promotion,
        });

        if (aiMove) {
          initialAiMove = { from: move.from, to: move.to };
          await this.prisma.move.create({
            data: {
              gameId,
              moveNumber: 1,
              color: 'WHITE',
              from: move.from,
              to: move.to,
              promotion: move.promotion,
              san: aiMove.san,
              fenAfterMove: chess.fen(),
            },
          });
          await this.prisma.game.update({
            where: { id: gameId },
            data: {
              fen: chess.fen(),
              currentTurn: 'BLACK',
            },
          });
        }
      } catch (error) {
        console.error('Error getting Stockfish move:', error);
      }
    }

    this.aiGames.set(gameId, {
      chess,
      difficulty: body.difficulty,
      playerColor: body.playerColor,
      status: 'ACTIVE',
    });

    return {
      id: gameId,
      mode: 'AI',
      status: 'ACTIVE',
      whitePlayer: {
        id: 'ai',
        username: body.playerColor === 'WHITE' ? 'Player' : 'Stockfish',
        email: 'ai@chess.local',
        rating:
          body.difficulty === 'EASY'
            ? 800
            : body.difficulty === 'MEDIUM'
              ? 1500
              : 2500,
        createdAt: new Date().toISOString(),
      },
      blackPlayer: {
        id: 'ai',
        username: body.playerColor === 'BLACK' ? 'Player' : 'Stockfish',
        email: 'ai@chess.local',
        rating:
          body.difficulty === 'EASY'
            ? 800
            : body.difficulty === 'MEDIUM'
              ? 1500
              : 2500,
        createdAt: new Date().toISOString(),
      },
      currentTurn: chess.turn() === 'w' ? 'WHITE' : 'BLACK',
      initialAiMove,
      fen: chess.fen(),
      winner: null,
      result: null,
      startedAt: createdGame.startedAt.toISOString(),
      endedAt: null,
    };
  }

  @Post(':gameId/moves')
  async makeMove(@Param('gameId') gameId: string, @Body() body: MoveRequest) {
    const game = this.aiGames.get(gameId);
    const dbGame = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: { moves: true },
    });

    if (!game && !dbGame) {
      throw new Error('Game not found');
    }

    const currentDifficulty =
      game?.difficulty || dbGame?.difficulty || 'MEDIUM';
    const currentStatus = game?.status || dbGame?.status;

    if (currentStatus !== 'ACTIVE') {
      throw new Error('Game is not active');
    }

    const chess = game ? game.chess : new Chess(dbGame!.fen);

    const playerMove = chess.move({
      from: body.from,
      to: body.to,
      promotion: body.promotion,
    });

    if (!playerMove) {
      throw new Error('Invalid move');
    }

    const moveCount = chess.history().length;
    const playerColor: 'WHITE' | 'BLACK' =
      playerMove.color === 'w' ? 'WHITE' : 'BLACK';

    if (dbGame) {
      await this.prisma.move.create({
        data: {
          gameId,
          moveNumber: moveCount,
          color: playerColor,
          from: body.from,
          to: body.to,
          promotion: body.promotion,
          san: playerMove.san,
          fenAfterMove: chess.fen(),
        },
      });
      await this.prisma.game.update({
        where: { id: gameId },
        data: {
          fen: chess.fen(),
          currentTurn: chess.turn() === 'w' ? 'WHITE' : 'BLACK',
        },
      });
    }

    if (chess.isGameOver()) {
      let result: 'CHECKMATE' | 'STALEMATE' | 'DRAW' | undefined;
      let winner: 'WHITE' | 'BLACK' | undefined;

      if (chess.isCheckmate()) {
        result = 'CHECKMATE';
        winner = chess.turn() === 'w' ? 'BLACK' : 'WHITE';
      } else if (chess.isStalemate()) {
        result = 'STALEMATE';
      } else if (chess.isDraw()) {
        result = 'DRAW';
      }

      if (game) {
        game.status = 'FINISHED';
        game.result = result;
        game.winner = winner;
      }

      if (dbGame) {
        await this.prisma.game.update({
          where: { id: gameId },
          data: {
            status: 'FINISHED',
            result,
            endedAt: new Date(),
          },
        });
      }

      return {
        id: gameId,
        move: `${body.from}${body.to}${body.promotion || ''}`,
        san: playerMove.san,
        fen: chess.fen(),
        currentTurn: chess.turn() === 'w' ? 'WHITE' : 'BLACK',
        check: chess.isCheck(),
        gameOver: true,
        result,
        winner,
      };
    }

    const aiMove = await this.stockfishService.getBestMoveForPosition(
      chess.fen(),
      currentDifficulty,
    );

    const aiChessMove = chess.move({
      from: aiMove.from,
      to: aiMove.to,
      promotion: aiMove.promotion,
    });

    if (!aiChessMove) {
      throw new Error('AI failed to make a valid move');
    }

    const aiMoveCount = chess.history().length;
    const aiColor: 'WHITE' | 'BLACK' =
      aiChessMove.color === 'w' ? 'WHITE' : 'BLACK';

    if (dbGame) {
      await this.prisma.move.create({
        data: {
          gameId,
          moveNumber: aiMoveCount,
          color: aiColor,
          from: aiMove.from,
          to: aiMove.to,
          promotion: aiMove.promotion,
          san: aiChessMove.san,
          fenAfterMove: chess.fen(),
        },
      });
      await this.prisma.game.update({
        where: { id: gameId },
        data: {
          fen: chess.fen(),
          currentTurn: chess.turn() === 'w' ? 'WHITE' : 'BLACK',
        },
      });
    }

    let gameOver = false;
    let result = game?.result;
    let winner = game?.winner;

    if (chess.isGameOver()) {
      gameOver = true;
      if (chess.isCheckmate()) {
        result = 'CHECKMATE';
        winner = chess.turn() === 'w' ? 'BLACK' : 'WHITE';
      } else if (chess.isStalemate()) {
        result = 'STALEMATE';
      } else if (chess.isDraw()) {
        result = 'DRAW';
      }

      if (game) {
        game.status = 'FINISHED';
        game.result = result;
        game.winner = winner;
      }

      if (dbGame) {
        await this.prisma.game.update({
          where: { id: gameId },
          data: {
            status: 'FINISHED',
            result,
            endedAt: new Date(),
          },
        });
      }
    }

    return {
      id: gameId,
      playerMove: {
        from: body.from,
        to: body.to,
        san: playerMove.san,
      },
      aiMove: {
        from: aiMove.from,
        to: aiMove.to,
        san: aiChessMove.san,
      },
      fen: chess.fen(),
      currentTurn: chess.turn() === 'w' ? 'WHITE' : 'BLACK',
      check: chess.isCheck(),
      gameOver,
      result,
      winner,
    };
  }

  @Get(':gameId/state')
  async getGameState(@Param('gameId') gameId: string) {
    const game = this.aiGames.get(gameId);
    let fen = game?.chess.fen();
    let currentTurn = game
      ? game.chess.turn() === 'w'
        ? 'WHITE'
        : 'BLACK'
      : undefined;
    let status: string | undefined = game?.status;
    let check = game?.chess.isCheck();
    let result: string | undefined = game?.result;

    if (!game) {
      const dbGame = await this.prisma.game.findUnique({
        where: { id: gameId },
      });
      if (!dbGame) {
        throw new Error('Game not found');
      }
      const chess = new Chess(dbGame.fen);
      fen = dbGame.fen;
      currentTurn = dbGame.currentTurn;
      status = dbGame.status;
      check = chess.isCheck();
      result = dbGame.result || undefined;
    }

    return {
      gameId,
      fen,
      currentTurn,
      status,
      lastMove: null,
      check,
      result,
    };
  }

  @Post(':gameId/actions')
  async performGameAction(
    @Param('gameId') gameId: string,
    @Body() body: GameActionRequest,
  ) {
    const game = this.aiGames.get(gameId);
    const dbGame = await this.prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game && !dbGame) {
      throw new Error('Game not found');
    }

    const currentStatus = game?.status || dbGame?.status;
    if (currentStatus !== 'ACTIVE') {
      throw new Error('Game is not active');
    }

    const newStatus = 'FINISHED' as const;
    let result: 'RESIGNATION' | 'DRAW' = 'DRAW';

    if (body.action === 'RESIGN') {
      result = 'RESIGNATION';
    }

    if (game) {
      game.status = newStatus;
      game.result = result;
    }

    if (dbGame) {
      await this.prisma.game.update({
        where: { id: gameId },
        data: {
          status: newStatus,
          result,
          endedAt: new Date(),
        },
      });
    }

    return {
      action: body.action,
      gameStatus: newStatus,
      message: `${body.action} completed`,
    };
  }
}
