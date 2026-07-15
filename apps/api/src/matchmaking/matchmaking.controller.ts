import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { MatchmakingService } from './matchmaking.services';
import { JoinQueueDto } from './dto/join-queue.dto';
import { JwtAuthGuard, CurrentUser } from './dev-auth.stub'; // swap once teammate's auth lands

@UseGuards(JwtAuthGuard)
@Controller('matchmaking')
export class MatchmakingController {
  constructor(private matchmakingService: MatchmakingService) {}

  @Post('join')
  join(@CurrentUser() user: any, @Body() dto: JoinQueueDto) {
    return this.matchmakingService.join(user.id, dto.timeControl);
  }

  @Delete('leave')
  leave(@CurrentUser() user: any) {
    return this.matchmakingService.leave(user.id);
  }

  @Get('status')
  status(@CurrentUser() user: any) {
    return this.matchmakingService.status(user.id);
  }
}
