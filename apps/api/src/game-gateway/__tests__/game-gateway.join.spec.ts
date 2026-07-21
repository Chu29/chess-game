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
/* eslint-disable @typescript-eslint/no-unsafe-call */

jest.mock('jose', () => ({
  createRemoteJWKSet: jest.fn(),
  jwtVerify: jest.fn(),
}));

describe('GameGateway Join/Matchmaking', () => {
  let gateway: GameGateway;
  let mockServer: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameGateway,
        GameStateService,
        { provide: ConfigService, useValue: {} },
        {
          provide: PrismaService,
          useValue: {
            user: { findUnique: jest.fn() },
            game: { findUnique: jest.fn() },
          },
        },
        { provide: MakeMoveHandler, useValue: {} },
        { provide: GameActionHandler, useValue: {} },
        { provide: ReconnectHandler, useValue: {} },
      ],
    }).compile();

    gateway = module.get<GameGateway>(GameGateway);

    // Mock socket.io server
    mockServer = {
      to: jest.fn().mockImplementation(() => ({
        emit: jest.fn(),
      })),
    };
    gateway.server = mockServer;
  });

  it('should allow player to join queue', () => {
    const clientMock = {
      id: 'socket-p1',
      emit: jest.fn(),
    };

    gateway.handleFindMatch(clientMock as any, { userId: 'user-1' });

    expect(clientMock.emit).toHaveBeenCalledWith('queueStatus', {
      status: 'waiting',
      message: 'Searching...',
    });
  });

  it('should reject player if already in queue', () => {
    const clientMock = {
      id: 'socket-p1',
      emit: jest.fn(),
    };

    gateway.handleFindMatch(clientMock as any, { userId: 'user-1' });
    gateway.handleFindMatch(clientMock as any, { userId: 'user-1' });

    expect(clientMock.emit).toHaveBeenLastCalledWith('queueStatus', {
      message: 'Already in queue',
    });
  });

  it('should match two players when they both join the queue', () => {
    const clientMock1 = {
      id: 'socket-p1',
      emit: jest.fn(),
    };
    const clientMock2 = {
      id: 'socket-p2',
      emit: jest.fn(),
    };

    const emit1 = jest.fn();
    const emit2 = jest.fn();

    mockServer.to.mockImplementation((id: string) => {
      if (id === 'socket-p1') return { emit: emit1 };
      if (id === 'socket-p2') return { emit: emit2 };
      return { emit: jest.fn() };
    });

    gateway.handleFindMatch(clientMock1 as any, { userId: 'user-1' });
    gateway.handleFindMatch(clientMock2 as any, { userId: 'user-2' });

    expect(emit1).toHaveBeenCalledWith('matchFound', expect.any(Object));
    expect(emit2).toHaveBeenCalledWith('matchFound', expect.any(Object));

    const gameId = emit1.mock.calls[0][1].gameId;
    expect(emit1.mock.calls[0][1].color).toBe('w');
    expect(emit2.mock.calls[0][1].color).toBe('b');

    const activeGame = gateway.activeGames.get(gameId);
    expect(activeGame).toBeDefined();
    expect(activeGame?.white).toBe('user-1');
    expect(activeGame?.black).toBe('user-2');
  });

  it('should handle joining room', () => {
    const clientMock = {
      id: 'socket-p1',
      join: jest.fn(),
    };

    const result = gateway.handleJoinRoom(clientMock as any, {
      gameId: 'game-123',
    });

    expect(clientMock.join).toHaveBeenCalledWith('room_game-123');
    expect(result).toEqual({ status: 'joined' });
  });
});
