import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { MatchmakingModule } from '../matchmaking/matchmaking.modules';
import { AiModule } from '../ai/ai.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [MatchmakingModule, AiModule, PrismaModule],
  controllers: [GamesController],
})
export class GamesModule {}
