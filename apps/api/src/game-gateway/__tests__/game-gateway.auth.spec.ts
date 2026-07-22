import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GameGateway } from '../game.gateway';
import { GameStateService } from '../game-state.service';
import { MakeMoveHandler } from '../handlers/make-move.handler';
import { GameActionHandler } from '../handlers/game-action.handler';
import { ReconnectHandler } from '../handlers/reconnect.handler';
import { PrismaService } from '../../prisma/prisma.service';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

// Mock jose library
jest.mock('jose', () => ({
  createRemoteJWKSet: jest.fn(),
  jwtVerify: jest.fn().mockImplementation((token) => {
    if (token === 'valid-token') {
      return {
        payload: {
          sub: 'user-123',
          preferred_username: 'testuser',
          email: 'test@example.com',
        },
      };
    }
    throw new Error('Invalid token');
  }),
}));

describe('GameGateway Authentication', () => {
  let gateway: GameGateway;

  const mockConfigService = {
    getOrThrow: jest.fn().mockImplementation((key: string) => {
      if (key === 'KEYCLOAK_URL') return 'http://localhost:8080';
      if (key === 'KEYCLOAK_REALM') return 'chess';
      if (key === 'KEYCLOAK_ISSUER')
        return 'http://localhost:8080/realms/chess';
      return '';
    }),
  };

  const mockPrisma = {
    user: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'db-user-123',
        keycloakId: 'user-123',
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameGateway,
        GameStateService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PrismaService, useValue: mockPrisma },
        { provide: MakeMoveHandler, useValue: {} },
        { provide: GameActionHandler, useValue: {} },
        { provide: ReconnectHandler, useValue: {} },
      ],
    }).compile();

    gateway = module.get<GameGateway>(GameGateway);
  });

  it('should disconnect client if no authorization token is provided', async () => {
    const clientMock = {
      id: 'socket-1',
      handshake: {
        headers: {},
        auth: {},
        query: {},
      },
      disconnect: jest.fn(),
      data: {} as any,
    };

    await gateway.handleConnection(clientMock as any);

    expect(clientMock.disconnect).toHaveBeenCalledWith(true);
    expect(clientMock.data.user).toBeUndefined();
  });

  it('should authenticate client and store user data if a valid token is provided', async () => {
    const clientMock = {
      id: 'socket-2',
      handshake: {
        headers: {
          authorization: 'Bearer valid-token',
        },
        auth: {},
        query: {},
      },
      disconnect: jest.fn(),
      data: {} as any,
    };

    await gateway.handleConnection(clientMock as any);

    expect(clientMock.disconnect).not.toHaveBeenCalled();
    expect(clientMock.data.user).toBeDefined();
    expect(clientMock.data.user.keycloakId).toBe('user-123');
    expect(clientMock.data.user.username).toBe('testuser');
  });

  it('should resolve the internal db user id on connect', async () => {
    const clientMock = {
      id: 'socket-2b',
      handshake: {
        headers: {
          authorization: 'Bearer valid-token',
        },
        auth: {},
        query: {},
      },
      disconnect: jest.fn(),
      data: {} as any,
    };

    await gateway.handleConnection(clientMock as any);

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { keycloakId: 'user-123' },
    });
    expect(clientMock.data.user.id).toBe('db-user-123');
  });

  it('should disconnect client if token is invalid', async () => {
    const clientMock = {
      id: 'socket-3',
      handshake: {
        headers: {
          authorization: 'Bearer invalid-token',
        },
        auth: {},
        query: {},
      },
      disconnect: jest.fn(),
      data: {} as any,
    };

    await gateway.handleConnection(clientMock as any);

    expect(clientMock.disconnect).toHaveBeenCalledWith(true);
    expect(clientMock.data.user).toBeUndefined();
  });
});
