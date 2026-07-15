import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { decodeJwt } from 'jose';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { KeycloakService } from './keycloak.service';
import {
  KeycloakJwtPayload,
  KeycloakTokenResponse,
} from './types/keycloak.types';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  rating: number;
  createdAt: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly keycloak: KeycloakService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const keycloakId = await this.keycloak.createUser(dto);

    let user: User;
    try {
      user = await this.prisma.user.create({
        data: {
          keycloakId,
          username: dto.username,
          email: dto.email,
        },
      });
    } catch (error) {
      // Compensating action: don't leave an orphaned Keycloak account.
      await this.keycloak.deleteUser(keycloakId);
      throw error;
    }

    const tokens = await this.keycloak.loginWithPassword(
      dto.email,
      dto.password,
    );
    return this.toAuthResponse(tokens, user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const tokens = await this.keycloak.loginWithPassword(
      dto.email,
      dto.password,
    );
    const user = await this.findOrProvisionUser(tokens.access_token);
    return this.toAuthResponse(tokens, user);
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const tokens = await this.keycloak.refresh(refreshToken);
    const user = await this.findOrProvisionUser(tokens.access_token);
    return this.toAuthResponse(tokens, user);
  }

  async me(keycloakId: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { keycloakId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toUserResponse(user);
  }

  /**
   * Finds the local user matching the token's subject; provisions one from
   * token claims if it doesn't exist (e.g. user created directly in Keycloak).
   */
  private async findOrProvisionUser(accessToken: string): Promise<User> {
    const payload = decodeJwt(accessToken) as KeycloakJwtPayload;

    const existing = await this.prisma.user.findUnique({
      where: { keycloakId: payload.sub },
    });
    if (existing) {
      return existing;
    }

    this.logger.warn(
      `Provisioning missing local user for Keycloak id ${payload.sub}`,
    );
    return this.prisma.user.create({
      data: {
        keycloakId: payload.sub,
        username: payload.preferred_username ?? payload.sub,
        email: payload.email ?? `${payload.sub}@unknown.local`,
      },
    });
  }

  private toAuthResponse(
    tokens: KeycloakTokenResponse,
    user: User,
  ): AuthResponse {
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
      user: this.toUserResponse(user),
    };
  }

  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      rating: user.rating,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
