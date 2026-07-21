import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import * as jose from 'jose';
import { MakeMoveHandler, ActiveGame } from './handlers/make-move.handler';
import { GameActionHandler } from './handlers/game-action.handler';
import { ReconnectHandler } from './handlers/reconnect.handler';
import { GameStateService } from './game-state.service';
import { PrismaService } from '../prisma/prisma.service';

interface MatchmakingPlayer {
  socketId: string;
  userId: string;
}

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  // In-memory queue to handle matching without database dependencies
  private matchmakingQueue: MatchmakingPlayer[] = [];

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly gameState: GameStateService,
    private readonly makeMoveHandler: MakeMoveHandler,
    private readonly gameActionHandler: GameActionHandler,
    private readonly reconnectHandler: ReconnectHandler,
  ) {}

  // Kept public for the existing specs, backed by the shared service.
  get activeGames(): Map<string, ActiveGame> {
    return this.gameState.activeGames;
  }

  async handleConnection(client: Socket) {
    console.log(`🔌 Client trying to connect to game gateway: ${client.id}`);
    const authHeader: string | string[] | undefined =
      client.handshake.headers.authorization ||
      client.handshake.auth?.token ||
      client.handshake.query?.token;

    if (!authHeader) {
      console.log(`🔌 Client rejected: missing token`);
      client.disconnect(true);
      return;
    }

    const token =
      typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : String(authHeader);

    try {
      const keycloakUrl = this.configService.getOrThrow<string>('KEYCLOAK_URL');
      const realm = this.configService.getOrThrow<string>('KEYCLOAK_REALM');
      const issuer = this.configService.getOrThrow<string>('KEYCLOAK_ISSUER');
      const jwksUri = new URL(
        `${keycloakUrl}/realms/${realm}/protocol/openid-connect/certs`,
      );

      const jwks = jose.createRemoteJWKSet(jwksUri);
      const { payload } = await jose.jwtVerify(token, jwks as any, { issuer });
      if (!payload) {
        throw new Error('Invalid token payload');
      }

      // Resolve the internal user id — game rows reference it, not the
      // Keycloak subject. Users are created via REST (/auth/me) before
      // they can ever be matched into a game.
      const dbUser = await this.prisma.user.findUnique({
        where: { keycloakId: payload.sub as string },
      });

      client.data.user = {
        id: dbUser?.id ?? null,
        keycloakId: String(payload.sub),
        username:
          typeof payload.preferred_username === 'string'
            ? payload.preferred_username
            : '',
        email: typeof payload.email === 'string' ? payload.email : '',
      };

      console.log(
        `🔌 Client authenticated: ${client.id} (${String(payload.preferred_username)})`,
      );
    } catch (err) {
      console.log(
        `🔌 Client rejected: invalid token: ${(err as Error).message}`,
      );
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`🔌 Client disconnected: ${client.id}`);
    this.matchmakingQueue = this.matchmakingQueue.filter(
      (player) => player.socketId !== client.id,
    );
  }

  /**
   * The socket-authenticated user id when available; otherwise the id the
   * client claims. Sockets authenticated against real Keycloak tokens always
   * carry the DB id, so claimed ids only matter in tests/dev.
   */
  private resolvePlayerId(client: Socket, claimedId: string): string {
    return (client.data?.user?.id as string | undefined) ?? claimedId;
  }

  // ==========================================
  // MATCHMAKING CONTROL
  // ==========================================

  @SubscribeMessage('findMatch')
  handleFindMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: string },
  ) {
    const isAlreadyQueued = this.matchmakingQueue.some(
      (p) => p.userId === payload.userId,
    );

    if (isAlreadyQueued) {
      client.emit('queueStatus', { message: 'Already in queue' });
      return;
    }

    this.matchmakingQueue.push({
      socketId: client.id,
      userId: payload.userId,
    });

    console.log(
      `👤 Player ${payload.userId} joined queue. Size: ${this.matchmakingQueue.length}`,
    );
    client.emit('queueStatus', { status: 'waiting', message: 'Searching...' });

    this.tryToMatchPlayers();
  }

  private tryToMatchPlayers() {
    while (this.matchmakingQueue.length >= 2) {
      const player1 = this.matchmakingQueue.shift()!;
      const player2 = this.matchmakingQueue.shift()!;
      const mockGameId = `game_${Date.now()}`;

      // Store basic initial game state in memory
      this.gameState.register(mockGameId, {
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', // starting chess FEN
        white: player1.userId,
        black: player2.userId,
        turn: 'w',
        drawOfferedBy: null,
      });

      console.log(`⚔️ Match found: ${player1.userId} vs ${player2.userId}`);

      // Tell player 1 to join room and play White
      void this.server.to(player1.socketId).emit('matchFound', {
        gameId: mockGameId,
        color: 'w',
        opponentId: player2.userId,
      });

      // Tell player 2 to join room and play Black
      void this.server.to(player2.socketId).emit('matchFound', {
        gameId: mockGameId,
        color: 'b',
        opponentId: player1.userId,
      });
    }
  }

  // ==========================================
  // LIVE GAMEPLAY & ROOMS
  // ==========================================

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { gameId: string },
  ) {
    const roomName = `room_${payload.gameId}`;
    void client.join(roomName);
    console.log(`🚪 Client ${client.id} joined room: ${roomName}`);
    return { status: 'joined' };
  }

  @SubscribeMessage('makeMove')
  async handleMakeMove(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      gameId: string;
      playerId: string;
      from: string;
      to: string;
      promotion?: string;
    },
  ) {
    const game = await this.gameState.getOrLoad(payload.gameId);

    if (!game) {
      client.emit('moveRejected', { message: 'Game not found' });
      return;
    }

    const playerId = this.resolvePlayerId(client, payload.playerId);
    const result = this.makeMoveHandler.handle(game, {
      ...payload,
      playerId,
    });
    if (!result.success) {
      client.emit('moveRejected', { message: result.error });
      return;
    }

    const roomName = `room_${payload.gameId}`;

    // Broadcast update to players inside this specific match room
    void this.server.to(roomName).emit('moveMade', {
      fen: result.fen,
      lastMove: result.lastMove,
      nextTurn: result.turn,
      san: result.san,
      isCheck: result.isCheck,
    });

    await this.gameState.persistMove(payload.gameId, {
      from: payload.from,
      to: payload.to,
      promotion: result.promotion,
      san: result.san,
      color: result.color,
      moveNumber: result.moveNumber,
      fenAfter: result.fen,
      turnAfter: result.turn,
    });

    // If game ended, broadcast that too
    if (result.isGameOver) {
      const winnerId =
        result.resultReason === 'checkmate'
          ? result.turn === 'w'
            ? game.black
            : game.white
          : null;

      this.server.to(roomName).emit('gameEnded', {
        gameId: payload.gameId,
        reason: result.resultReason,
        winnerId,
      });

      await this.gameState.persistGameEnd(payload.gameId, {
        reason: result.resultReason ?? 'draw',
        winnerId,
      });
    }
  }

  @SubscribeMessage('gameAction')
  async handleGameAction(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      gameId: string;
      playerId: string;
      action: 'resign' | 'drawOffer' | 'declineDraw' | 'acceptDraw';
    },
  ) {
    const game = await this.gameState.getOrLoad(payload.gameId);

    if (!game) {
      client.emit('actionRejected', { message: 'Game not found' });
      return;
    }

    const roomName = `room_${payload.gameId}`;
    const actionPayload = {
      gameId: payload.gameId,
      playerId: this.resolvePlayerId(client, payload.playerId),
    };

    switch (payload.action) {
      case 'resign': {
        const result = this.gameActionHandler.handleResign(game, actionPayload);
        if (!result.success) {
          client.emit('actionRejected', { message: result.error });
          return;
        }
        this.server.to(roomName).emit('gameEnded', {
          gameId: payload.gameId,
          reason: result.reason,
          winnerId: result.winnerId,
        });
        await this.gameState.persistGameEnd(payload.gameId, {
          reason: result.reason,
          winnerId: result.winnerId,
        });
        break;
      }
      case 'drawOffer': {
        const result = this.gameActionHandler.handleDrawOffer(
          game,
          actionPayload,
        );
        if (!result.success) {
          client.emit('actionRejected', { message: result.error });
          return;
        }
        if (result.action === 'drawAccept') {
          this.server.to(roomName).emit('gameEnded', {
            gameId: payload.gameId,
            reason: result.reason,
            winnerId: null,
          });
          await this.gameState.persistGameEnd(payload.gameId, {
            reason: result.reason,
            winnerId: null,
          });
        } else {
          this.server.to(roomName).emit('drawOffered', {
            gameId: payload.gameId,
            offeredBy: result.offeredBy,
          });
          await this.gameState.persistDrawOffer(
            payload.gameId,
            result.offeredBy,
          );
        }
        break;
      }
      case 'declineDraw': {
        const result = this.gameActionHandler.handleDeclineDraw(
          game,
          actionPayload,
        );
        if (!result.success) {
          client.emit('actionRejected', { message: result.error });
          return;
        }
        this.server.to(roomName).emit('drawDeclined', {
          gameId: payload.gameId,
          declinedBy: result.declinedBy,
        });
        await this.gameState.persistDrawCleared(payload.gameId);
        break;
      }
      case 'acceptDraw': {
        const result = this.gameActionHandler.handleAcceptDraw(
          game,
          actionPayload,
        );
        if (!result.success) {
          client.emit('actionRejected', { message: result.error });
          return;
        }
        this.server.to(roomName).emit('gameEnded', {
          gameId: payload.gameId,
          reason: result.reason,
          winnerId: null,
        });
        await this.gameState.persistGameEnd(payload.gameId, {
          reason: result.reason,
          winnerId: null,
        });
        break;
      }
      default:
        client.emit('actionRejected', { message: 'Invalid action' });
    }
  }

  @SubscribeMessage('reconnect')
  async handleReconnect(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { gameId: string; playerId: string },
  ) {
    const game = await this.gameState.getOrLoad(payload.gameId);

    if (!game) {
      client.emit('reconnectRejected', { message: 'Game not found' });
      return;
    }

    const result = this.reconnectHandler.handle(game, {
      gameId: payload.gameId,
      playerId: this.resolvePlayerId(client, payload.playerId),
    });
    if (!result.success) {
      client.emit('reconnectRejected', { message: result.error });
      return;
    }

    const roomName = `room_${payload.gameId}`;
    void client.join(roomName);

    client.emit('gameStateUpdated', {
      gameId: payload.gameId,
      fen: result.fen,
      white: result.white,
      black: result.black,
      turn: result.turn,
      color: result.color,
      drawOfferedBy: result.drawOfferedBy,
    });
  }
}
