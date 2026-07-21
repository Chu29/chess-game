import { Controller, Get, Param } from '@nestjs/common';
import { MatchmakingService } from '../matchmaking/matchmaking.services';

@Controller('games')
export class GamesController {
  constructor(private matchmakingService: MatchmakingService) {}

  @Get(':gameId')
  getGame(@Param('gameId') gameId: string) {
    return this.matchmakingService.getGameById(gameId);
  }
}
