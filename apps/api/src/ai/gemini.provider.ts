import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Gemini's ONLY job is explaining a move Stockfish already calculated.
 * It is never given the ability to suggest or calculate a different move.
 */
@Injectable()
export class GeminiProvider {
  private readonly logger = new Logger(GeminiProvider.name);
  private readonly client: GoogleGenerativeAI | null;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');
    this.client = apiKey ? new GoogleGenerativeAI(apiKey) : null;
    if (!this.client) {
      this.logger.warn(
        'GEMINI_API_KEY not set — hint explanations will fall back to a generic message.',
      );
    }
  }

  async explainMove(
    fen: string,
    bestMoveSan: string,
    player: 'white' | 'black',
  ): Promise<string> {
    if (!this.client) {
      return 'No explanation available.';
    }

    try {
      const model = this.client.getGenerativeModel({
        model: 'gemini-3.5-flash-lite',
      });

      const prompt = [
        'You are a professional chess coach.',
        '',
        'The move has already been calculated by Stockfish. Do NOT calculate another move.',
        '',
        `Current position (FEN): ${fen}`,
        `Player to move: ${player}`,
        `Best move: ${bestMoveSan}`,
        '',
        'Simply explain in simple beginner-friendly English why this move is strong.',
        'Keep the explanation under three sentences.',
      ].join('\n');

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      return text || 'No explanation available.';
    } catch (err) {
      this.logger.error('Gemini explanation request failed', err as Error);
      return 'No explanation available.';
    }
  }
}
