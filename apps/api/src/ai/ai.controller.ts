import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { HintRequestDto } from './dto/hint-request.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/keycloak.types';

// No @UseGuards() needed — JwtAuthGuard is applied globally, matching
// MatchmakingController's pattern.
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('hint')
  hint(@CurrentUser() user: AuthenticatedUser, @Body() dto: HintRequestDto) {
    return this.aiService.getHint(user.keycloakId, dto);
  }
}
