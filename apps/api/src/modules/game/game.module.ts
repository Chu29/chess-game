import { Module } from '@nestjs/common';
import { GameGateway } from './infrastructure/gateways/game.gateway';

@Module({
  providers: [GameGateway],
})
export class GameModule {}