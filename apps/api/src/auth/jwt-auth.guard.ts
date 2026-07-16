import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';
import { AuthenticatedUser, KeycloakJwtPayload } from './types/keycloak.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwksUri: URL;
  private jwks: unknown;
  private readonly issuer: string;

  constructor(
    private readonly reflector: Reflector,
    config: ConfigService,
  ) {
    const keycloakUrl = config.getOrThrow<string>('KEYCLOAK_URL');
    const realm = config.getOrThrow<string>('KEYCLOAK_REALM');
    this.issuer = config.getOrThrow<string>('KEYCLOAK_ISSUER');
    this.jwksUri = new URL(
      `${keycloakUrl}/realms/${realm}/protocol/openid-connect/certs`,
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();
    const token = this.extractBearerToken(request);
    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }

    try {
      const jose = await import('jose');
      if (!this.jwks) {
        this.jwks = jose.createRemoteJWKSet(this.jwksUri);
      }
      const { payload } = await jose.jwtVerify(
        token,
        this.jwks as Parameters<typeof jose.jwtVerify>[1],
        {
          issuer: this.issuer,
        },
      );
      const claims = payload as KeycloakJwtPayload;
      request.user = {
        keycloakId: claims.sub,
        username: claims.preferred_username,
        email: claims.email,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  private extractBearerToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
