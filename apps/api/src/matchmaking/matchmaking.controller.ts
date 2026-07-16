import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { MatchmakingService } from './matchmaking.services';
import { JoinQueueDto } from './dto/join-queue.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/keycloak.types';

// No @UseGuards() needed — JwtAuthGuard is applied globally.
@Controller('matchmaking')
export class MatchmakingController {
  constructor(private matchmakingService: MatchmakingService) {}

  @Post('join')
  join(@CurrentUser() user: AuthenticatedUser, @Body() dto: JoinQueueDto) {
    return this.matchmakingService.join(user.keycloakId, dto.timeControl);
  }

  @Delete('leave')
  leave(@CurrentUser() user: AuthenticatedUser) {
    return this.matchmakingService.leave(user.keycloakId);
  }

  @Get('status')
  status(@CurrentUser() user: AuthenticatedUser) {
    return this.matchmakingService.status(user.keycloakId);
  }
}
