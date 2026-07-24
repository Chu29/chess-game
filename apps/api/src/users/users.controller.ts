import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './user.services';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/keycloak.types';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('leaderboard')
  getLeaderboard(@Query('limit') limit?: string) {
    return this.usersService.getLeaderboard(
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Get('me/stats')
  getMyStats(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getStats(user.keycloakId);
  }

  @Get('me/games')
  getMyGames(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limit?: string,
  ) {
    return this.usersService.getRecentGames(
      user.keycloakId,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Get('me/rank')
  getMyRank(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getRanking(user.keycloakId);
  }
}
