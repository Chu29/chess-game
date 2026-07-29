import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Chess } from 'chess.js';
import { PrismaService } from '../prisma/prisma.service';
import { StockfishService } from './stockfish.service';
import { GeminiProvider } from './gemini.provider';
import { HintService } from './hint.service';
import { HintRequestDto } from './dto/hint-request.dto';

// Matches packages/ui/src/types/game.ts's HintResponse. Import that shared
// type directly once you confirm the workspace alias (e.g. `@repo/ui`).
export interface HintResponse {
  bestMove: string;
  score: string;
  explanation: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stockfish: StockfishService,
    private readonly gemini: GeminiProvider,
    private readonly hints: HintService,
  ) {}

  private async resolveUserId(keycloakId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { keycloakId } });
    if (!user) {
      throw new NotFoundException('User not found — call GET /auth/me first');
    }
    return user.id;
  }

  async getHint(
    keycloakId: string,
    dto: HintRequestDto,
  ): Promise<HintResponse> {
    const playerId = await this.resolveUserId(keycloakId);

    const remaining = await this.hints.getRemaining(dto.gameId, playerId);
    if (remaining <= 0) {
      throw new ForbiddenException('No hints remaining for this game');
    }

    // 1. Stockfish calculates the move. getBestMoveForPosition() sets the
    //    position AND requests the move inside a single queued engine task,
    //    so it's safe to call concurrently from multiple players/games —
    //    unlike calling setPosition() + getBestMove() separately, which
    //    could race if two hint requests land at the same time.
    let bestMoveSan: string;
    const scoreLabel = 'N/A'; // getBestMoveForPosition doesn't return an eval — see note below.

    try {
      const bestMove = await this.stockfish.getBestMoveForPosition(
        dto.fen,
        'MEDIUM',
      );

      const chess = new Chess(dto.fen);
      const move = chess.move({
        from: bestMove.from,
        to: bestMove.to,
        promotion: bestMove.promotion,
      });

      bestMoveSan = move?.san ?? `${bestMove.from}${bestMove.to}`;
    } catch (err) {
      this.logger.error('Stockfish failed to produce a hint', err as Error);
      return {
        bestMove: '',
        score: 'N/A',
        explanation: 'No hint available.',
      };
    }

    // 2. Gemini explains the move Stockfish already picked. If it fails,
    //    still return the move — just without an explanation.
    const explanation = await this.gemini.explainMove(
      dto.fen,
      bestMoveSan,
      dto.player,
    );

    // 3. Only consume a hint once we've successfully produced one.
    await this.hints.consume(dto.gameId, playerId);

    return { bestMove: bestMoveSan, score: scoreLabel, explanation };
  }
}
