import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { KeycloakService } from './keycloak.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    KeycloakService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService, KeycloakService],
})
export class AuthModule {}
