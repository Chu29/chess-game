import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateKeycloakUserInput,
  KeycloakTokenResponse,
} from './types/keycloak.types';

@Injectable()
export class KeycloakService {
  private readonly logger = new Logger(KeycloakService.name);

  private readonly baseUrl: string;
  private readonly realm: string;
  private readonly apiClientId: string;
  private readonly apiClientSecret: string;
  private readonly adminClientId: string;
  private readonly adminClientSecret: string;

  private adminToken: { value: string; expiresAt: number } | null = null;

  constructor(config: ConfigService) {
    this.baseUrl = config.getOrThrow<string>('KEYCLOAK_URL');
    this.realm = config.getOrThrow<string>('KEYCLOAK_REALM');
    this.apiClientId = config.getOrThrow<string>('KEYCLOAK_API_CLIENT_ID');
    this.apiClientSecret = config.getOrThrow<string>(
      'KEYCLOAK_API_CLIENT_SECRET',
    );
    this.adminClientId = config.getOrThrow<string>('KEYCLOAK_ADMIN_CLIENT_ID');
    this.adminClientSecret = config.getOrThrow<string>(
      'KEYCLOAK_ADMIN_CLIENT_SECRET',
    );
  }

  private get tokenEndpoint(): string {
    return `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`;
  }

  private get adminUsersEndpoint(): string {
    return `${this.baseUrl}/admin/realms/${this.realm}/users`;
  }

  async loginWithPassword(
    email: string,
    password: string,
  ): Promise<KeycloakTokenResponse> {
    const response = await fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: this.apiClientId,
        client_secret: this.apiClientSecret,
        username: email,
        password,
        scope: 'openid',
      }),
    });

    if (response.status === 400 || response.status === 401) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!response.ok) {
      this.logger.error(
        `Keycloak token request failed: ${response.status} ${await response.text()}`,
      );
      throw new InternalServerErrorException('Authentication service error');
    }

    return (await response.json()) as KeycloakTokenResponse;
  }

  async refresh(refreshToken: string): Promise<KeycloakTokenResponse> {
    const response = await fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: this.apiClientId,
        client_secret: this.apiClientSecret,
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return (await response.json()) as KeycloakTokenResponse;
  }

  async createUser(input: CreateKeycloakUserInput): Promise<string> {
    const token = await this.getAdminToken();

    const response = await fetch(this.adminUsersEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: input.username,
        email: input.email,
        enabled: true,
        emailVerified: true,
        credentials: [
          { type: 'password', value: input.password, temporary: false },
        ],
      }),
    });

    if (response.status === 409) {
      throw new ConflictException('Username or email already exists');
    }
    if (response.status !== 201) {
      this.logger.error(
        `Keycloak user creation failed: ${response.status} ${await response.text()}`,
      );
      throw new InternalServerErrorException('Failed to create user');
    }

    // Location header: .../admin/realms/chess/users/<id>
    const location = response.headers.get('location');
    const keycloakId = location?.split('/').pop();
    if (!keycloakId) {
      throw new InternalServerErrorException(
        'Keycloak did not return the created user id',
      );
    }
    return keycloakId;
  }

  async deleteUser(keycloakId: string): Promise<void> {
    const token = await this.getAdminToken();
    const response = await fetch(`${this.adminUsersEndpoint}/${keycloakId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok && response.status !== 404) {
      this.logger.error(
        `Failed to delete Keycloak user ${keycloakId}: ${response.status}`,
      );
    }
  }

  private async getAdminToken(): Promise<string> {
    // Reuse cached token until ~30s before expiry.
    if (this.adminToken && this.adminToken.expiresAt > Date.now() + 30_000) {
      return this.adminToken.value;
    }

    const response = await fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.adminClientId,
        client_secret: this.adminClientSecret,
      }),
    });

    if (!response.ok) {
      this.logger.error(
        `Keycloak admin token request failed: ${response.status} ${await response.text()}`,
      );
      throw new InternalServerErrorException('Authentication service error');
    }

    const data = (await response.json()) as KeycloakTokenResponse;
    this.adminToken = {
      value: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
    return data.access_token;
  }
}
