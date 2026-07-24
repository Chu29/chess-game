import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { GameModule } from './modules/game/game.module';
import { MatchmakingModule } from './matchmaking/matchmaking.modules';
import { GamesModule } from './games/games.module'; 
import { UsersModule } from './users/users.modules'; 
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    GameModule,
    MatchmakingModule,
    GamesModule,
     UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
