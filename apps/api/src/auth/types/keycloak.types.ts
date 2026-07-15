export interface KeycloakTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
}

export interface KeycloakJwtPayload {
  sub: string;
  preferred_username?: string;
  email?: string;
  exp?: number;
  iat?: number;
  iss?: string;
}

export interface AuthenticatedUser {
  keycloakId: string;
  username?: string;
  email?: string;
}

export interface CreateKeycloakUserInput {
  username: string;
  email: string;
  password: string;
}
