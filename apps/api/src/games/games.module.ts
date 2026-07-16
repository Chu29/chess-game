import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { MatchmakingModule } from '../matchmaking/matchmaking.modules';

@Module({
  imports: [MatchmakingModule],
  controllers: [GamesController],
})
export class GamesModule {}
