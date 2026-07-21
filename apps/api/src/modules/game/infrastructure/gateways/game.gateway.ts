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

  // Tracks active in-memory board states temporarily while your team builds the database schema
  private activeGames = new Map<
    string,
    { fen: string; white: string; black: string; turn: 'w' | 'b' }
  >();

  handleConnection(client: Socket) {
    console.log(`🔌 Client connected to game gateway: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`🔌 Client disconnected: ${client.id}`);
    this.matchmakingQueue = this.matchmakingQueue.filter(
      (player) => player.socketId !== client.id,
    );
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

    client.emit('queueStatus', {
      status: 'waiting',
      message: 'Searching...',
    });

    this.tryToMatchPlayers();
  }

  private tryToMatchPlayers() {
    while (this.matchmakingQueue.length >= 2) {
      const player1 = this.matchmakingQueue.shift()!;
      const player2 = this.matchmakingQueue.shift()!;
      const mockGameId = `game_${Date.now()}`;

      this.activeGames.set(mockGameId, {
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        white: player1.userId,
        black: player2.userId,
        turn: 'w',
      });

      console.log(`⚔️ Match found: ${player1.userId} vs ${player2.userId}`);

      this.server.to(player1.socketId).emit('matchFound', {
        gameId: mockGameId,
        color: 'w',
        opponentId: player2.userId,
      });

      this.server.to(player2.socketId).emit('matchFound', {
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
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { gameId: string },
  ) {
    const roomName = `room_${payload.gameId}`;

    await client.join(roomName);

    console.log(`🚪 Client ${client.id} joined room: ${roomName}`);

    return {
      status: 'joined',
    };
  }

  @SubscribeMessage('makeMove')
  handleMakeMove(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      gameId: string;
      playerId: string;
      from: string;
      to: string;
      nextFen: string;
    },
  ) {
    const roomName = `room_${payload.gameId}`;
    const game = this.activeGames.get(payload.gameId);

    if (!game) {
      client.emit('moveRejected', { message: 'Game not found' });
      return;
    }

    const expectedPlayer = game.turn === 'w' ? game.white : game.black;

    if (payload.playerId !== expectedPlayer) {
      client.emit('moveRejected', { message: 'Not your turn!' });
      return;
    }

    game.fen = payload.nextFen;
    game.turn = game.turn === 'w' ? 'b' : 'w';

    this.activeGames.set(payload.gameId, game);

    this.server.to(roomName).emit('moveMade', {
      fen: game.fen,
      lastMove: {
        from: payload.from,
        to: payload.to,
      },
      nextTurn: game.turn,
    });
  }
}
