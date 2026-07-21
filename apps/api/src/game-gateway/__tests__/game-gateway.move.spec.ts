import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GameStatus } from '@prisma/client';
import { GameGateway } from '../game.gateway';
import { GameStateService } from '../game-state.service';
import { MakeMoveHandler } from '../handlers/make-move.handler';
import { GameActionHandler } from '../handlers/game-action.handler';
import { ReconnectHandler } from '../handlers/reconnect.handler';
import { PrismaService } from '../../prisma/prisma.service';
import { Socket } from 'socket.io';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

jest.mock('jose', () => ({
  createRemoteJWKSet: jest.fn(),
  jwtVerify: jest.fn(),
}));

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

describe('GameGateway Gameplay & Move Validation', () => {
  let gateway: GameGateway;

  let mockServer: any;
  let emitMock: jest.Mock;

  let mockPrisma: any;

  beforeEach(async () => {
    mockPrisma = {
      user: { findUnique: jest.fn() },
      game: {
        findUnique: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue({}),
      },
      move: { create: jest.fn().mockResolvedValue({}) },
      $transaction: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameGateway,
        GameStateService,
        { provide: ConfigService, useValue: {} },

        { provide: PrismaService, useValue: mockPrisma },
        MakeMoveHandler,
        GameActionHandler,
        ReconnectHandler,
      ],
    }).compile();

    gateway = module.get<GameGateway>(GameGateway);

    emitMock = jest.fn();

    mockServer = {
      to: jest.fn().mockImplementation(() => ({
        emit: emitMock,
      })),
    };
    gateway.server = mockServer;
  });

  it('should accept valid move and broadcast updates', async () => {
    const gameId = 'test-game';
    gateway.activeGames.set(gameId, {
      fen: START_FEN,
      white: 'user-w',
      black: 'user-b',
      turn: 'w',
    });

    const clientMock: any = {
      id: 'socket-w',
      emit: jest.fn(),
    };

    await gateway.handleMakeMove(clientMock, {
      gameId,
      playerId: 'user-w',
      from: 'e2',
      to: 'e4',
    });

    expect(clientMock.emit).not.toHaveBeenCalledWith(
      'moveRejected',
      expect.any(Object),
    );
    expect(mockServer.to).toHaveBeenCalledWith('room_test-game');
    expect(emitMock).toHaveBeenCalledWith(
      'moveMade',
      expect.objectContaining({
        lastMove: { from: 'e2', to: 'e4' },
        nextTurn: 'b',
      }),
    );
  });

  it('should reject invalid move and notify player', async () => {
    const gameId = 'test-game';
    gateway.activeGames.set(gameId, {
      fen: START_FEN,
      white: 'user-w',
      black: 'user-b',
      turn: 'w',
    });

    const clientMock: any = {
      id: 'socket-w',
      emit: jest.fn(),
    };

    await gateway.handleMakeMove(clientMock, {
      gameId,
      playerId: 'user-w',
      from: 'e2',
      to: 'e5',
    });

    expect(clientMock.emit).toHaveBeenCalledWith('moveRejected', {
      message: 'Invalid move!',
    });
    expect(emitMock).not.toHaveBeenCalledWith('moveMade', expect.any(Object));
  });

  it('should reject out-of-turn moves', async () => {
    const gameId = 'test-game';
    gateway.activeGames.set(gameId, {
      fen: START_FEN,
      white: 'user-w',
      black: 'user-b',
      turn: 'w',
    });

    const clientMock: any = {
      id: 'socket-b',
      emit: jest.fn(),
    };

    await gateway.handleMakeMove(clientMock as Socket, {
      gameId,
      playerId: 'user-b',
      from: 'e7',
      to: 'e5',
    });

    expect(clientMock.emit).toHaveBeenCalledWith('moveRejected', {
      message: 'Not your turn!',
    });
    expect(emitMock).not.toHaveBeenCalledWith('moveMade', expect.any(Object));
  });

  it('should handle game action - resignation', async () => {
    const gameId = 'test-game';
    gateway.activeGames.set(gameId, {
      fen: START_FEN,
      white: 'user-w',
      black: 'user-b',
      turn: 'w',
    });

    const clientMock: any = {
      id: 'socket-w',
      emit: jest.fn(),
    };

    await gateway.handleGameAction(clientMock, {
      gameId,
      playerId: 'user-w',
      action: 'resign',
    });

    expect(emitMock).toHaveBeenCalledWith('gameEnded', {
      gameId,
      reason: 'resignation',
      winnerId: 'user-b',
    });
  });

  it('should hydrate a REST-matchmade game from the database and persist the move', async () => {
    const gameId = 'db-game-1';
    mockPrisma.game.findUnique.mockResolvedValue({
      id: gameId,
      status: GameStatus.ACTIVE,
      fen: START_FEN,
      whitePlayerId: 'user-w',
      blackPlayerId: 'user-b',
      drawOfferedBy: null,
    });

    const clientMock: any = {
      id: 'socket-w',
      emit: jest.fn(),
    };

    await gateway.handleMakeMove(clientMock, {
      gameId,
      playerId: 'user-w',
      from: 'e2',
      to: 'e4',
    });

    expect(mockPrisma.game.findUnique).toHaveBeenCalledWith({
      where: { id: gameId },
    });
    expect(emitMock).toHaveBeenCalledWith(
      'moveMade',
      expect.objectContaining({
        nextTurn: 'b',
      }),
    );
    // DB-backed game → move must be persisted
    expect(mockPrisma.$transaction).toHaveBeenCalled();
    expect(gateway.activeGames.get(gameId)?.turn).toBe('b');
  });

  it('should reject a move for an unknown game', async () => {
    const clientMock: any = {
      id: 'socket-x',
      emit: jest.fn(),
    };

    await gateway.handleMakeMove(clientMock as Socket, {
      gameId: 'nope',
      playerId: 'user-w',
      from: 'e2',
      to: 'e4',
    });

    expect(clientMock.emit).toHaveBeenCalledWith('moveRejected', {
      message: 'Game not found',
    });
  });

  it('should handle game action - drawOffer, declineDraw, acceptDraw, and automatic accept', async () => {
    const gameId = 'test-game-draw';
    gateway.activeGames.set(gameId, {
      fen: START_FEN,
      white: 'user-w',
      black: 'user-b',
      turn: 'w',
      drawOfferedBy: null,
    });

    const clientMockW = { id: 'socket-w', emit: jest.fn() };
    const clientMockB = { id: 'socket-b', emit: jest.fn() };

    // 1. White offers a draw
    await gateway.handleGameAction(clientMockW as unknown as Socket, {
      gameId,
      playerId: 'user-w',
      action: 'drawOffer',
    });
    expect(emitMock).toHaveBeenCalledWith('drawOffered', {
      gameId,
      offeredBy: 'user-w',
    });

    // 2. Black declines the draw
    await gateway.handleGameAction(clientMockB as unknown as Socket, {
      gameId,
      playerId: 'user-b',
      action: 'declineDraw',
    });
    expect(emitMock).toHaveBeenCalledWith('drawDeclined', {
      gameId,
      declinedBy: 'user-b',
    });

    // 3. Black offers a draw
    await gateway.handleGameAction(clientMockB as unknown as Socket, {
      gameId,
      playerId: 'user-b',
      action: 'drawOffer',
    });
    expect(emitMock).toHaveBeenCalledWith('drawOffered', {
      gameId,
      offeredBy: 'user-b',
    });

    // 4. White accepts the draw
    await gateway.handleGameAction(clientMockW as unknown as Socket, {
      gameId,
      playerId: 'user-w',
      action: 'acceptDraw',
    });
    expect(emitMock).toHaveBeenCalledWith('gameEnded', {
      gameId,
      reason: 'agreement',
      winnerId: null,
    });
  });

  it('should automatically accept draw if opponent offers it when draw was already offered', async () => {
    const gameId = 'test-game-draw-auto';
    gateway.activeGames.set(gameId, {
      fen: START_FEN,
      white: 'user-w',
      black: 'user-b',
      turn: 'w',
      drawOfferedBy: null,
    });

    const clientMockW = { id: 'socket-w', emit: jest.fn() };
    const clientMockB = { id: 'socket-b', emit: jest.fn() };

    // White offers draw
    await gateway.handleGameAction(clientMockW as unknown as Socket, {
      gameId,
      playerId: 'user-w',
      action: 'drawOffer',
    });

    // Black offers draw (which acts as accept because White already offered)
    await gateway.handleGameAction(clientMockB as unknown as Socket, {
      gameId,
      playerId: 'user-b',
      action: 'drawOffer',
    });

    expect(emitMock).toHaveBeenLastCalledWith('gameEnded', {
      gameId,
      reason: 'agreement',
      winnerId: null,
    });
  });

  it('should handle reconnect successfully', async () => {
    const gameId = 'test-game-reconnect';
    gateway.activeGames.set(gameId, {
      fen: START_FEN,
      white: 'user-w',
      black: 'user-b',
      turn: 'w',
      drawOfferedBy: 'user-w',
    });

    const clientMock: any = {
      id: 'socket-w',
      emit: jest.fn(),
      join: jest.fn(),
    };

    await gateway.handleReconnect(clientMock, {
      gameId,
      playerId: 'user-w',
    });

    expect(clientMock.join).toHaveBeenCalledWith('room_test-game-reconnect');
    expect(clientMock.emit).toHaveBeenCalledWith('gameStateUpdated', {
      gameId,
      fen: START_FEN,
      white: 'user-w',
      black: 'user-b',
      turn: 'w',
      color: 'w',
      drawOfferedBy: 'user-w',
    });
  });

  it('should reject reconnect for unknown game or invalid player', async () => {
    const clientMock: any = {
      id: 'socket-x',
      emit: jest.fn(),
    };

    // Unknown game
    await gateway.handleReconnect(clientMock, {
      gameId: 'nope',
      playerId: 'user-w',
    });
    expect(clientMock.emit).toHaveBeenCalledWith('reconnectRejected', {
      message: 'Game not found',
    });

    // Non-player
    const gameId = 'test-game-reconnect-fail';
    gateway.activeGames.set(gameId, {
      fen: START_FEN,
      white: 'user-w',
      black: 'user-b',
      turn: 'w',
    });

    await gateway.handleReconnect(clientMock, {
      gameId,
      playerId: 'user-intruder',
    });
    expect(clientMock.emit).toHaveBeenCalledWith('reconnectRejected', {
      message: 'Not a player in this game',
    });
  });
});
