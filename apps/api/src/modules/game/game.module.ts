import { Module } from '@nestjs/common';
import { GameGateway } from '../../game-gateway/game.gateway';
import { GameStateService } from '../../game-gateway/game-state.service';
import { MakeMoveHandler } from '../../game-gateway/handlers/make-move.handler';
import { GameActionHandler } from '../../game-gateway/handlers/game-action.handler';
import { ReconnectHandler } from '../../game-gateway/handlers/reconnect.handler';

@Module({
  providers: [
    GameGateway,
    GameStateService,
    MakeMoveHandler,
    GameActionHandler,
    ReconnectHandler,
  ],
})
export class GameModule {}
