import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { HintService } from './hint.service';
import { StockfishService } from './stockfish.service';
import { GeminiProvider } from './gemini.provider';
import { PrismaModule } from '../prisma/prisma.module';
import { GameModule } from '../modules/game/game.module';

@Module({
  imports: [PrismaModule, GameModule],
  controllers: [AiController],
  providers: [AiService, HintService, StockfishService, GeminiProvider],
  exports: [StockfishService], // shared engine instance for PvAI move generation elsewhere
})
export class AiModule {}
