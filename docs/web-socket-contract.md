# WebSocket Contract

## Chess AI Game Platform

**Version:** 1.0.0
**Framework:** NestJS WebSockets (Socket.IO Adapter)

---

# Overview

This document defines the real-time communication contract between the React Native client and the NestJS backend.

The WebSocket layer is responsible for:

- Player authentication
- Matchmaking notifications
- Real-time multiplayer gameplay
- Game synchronization
- Draw offers
- Resignations
- Player disconnections and reconnections
- Optional asynchronous AI move notifications

The REST API remains responsible for:

- Authentication
- Matchmaking queue management
- AI game creation
- AI coaching features
- Game history retrieval

---

# Gateway Configuration

## Namespace

```text
/game
```

## Example NestJS Gateway

```typescript
@WebSocketGateway({
  namespace: "/game",
  cors: {
    origin: "*",
  },
})
export class GameGateway {}
```

---

# Architecture

```text
React Native App
       │
 Socket.IO Client
       │
─────────────────────
 NestJS Gateway
    GameGateway
─────────────────────
       │
 Application Layer
─────────────────────
 JoinMatchmakingHandler
 JoinGameHandler
 MakeMoveHandler
 GameActionHandler
 AIAnalysisHandler
─────────────────────
       │
 Domain Layer
─────────────────────
 Game Aggregate
 Move Entity
 ChessBoard
 Chess Rules Engine
─────────────────────
       │
 Infrastructure Layer
─────────────────────
 PostgreSQL
 Redis (Optional)
```

---

# Design Principles

- The server is the authoritative source of game state.
- Clients must never update the board permanently without server confirmation.
- Every move is validated on the server.
- Business logic must not reside inside the gateway.
- Gateways should delegate to application services/use cases.
- Each chess game corresponds to a Socket.IO room.
- Reconnection must always result in state synchronization.

---

# Connection Lifecycle

```text
Client
   │
   ▼
Socket.IO Connection
   │
   ▼
handleConnection()
   │
   ▼
authenticate
   │
   ▼
authenticated
   │
   ▼
joinGame
   │
   ▼
gameJoined
   │
   ▼
Gameplay
```

---

# Authentication

Clients must authenticate immediately after establishing a WebSocket connection.

## Client → Server

### Event

```text
authenticate
```

### Payload

```json
{
  "accessToken": "jwt-token"
}
```

---

## Server → Client

### Event

```text
authenticated
```

### Payload

```json
{
  "userId": "usr_001",
  "username": "player_one"
}
```

---

# Authentication Failed

### Event

```text
error
```

### Payload

```json
{
  "code": "UNAUTHORIZED",
  "message": "Invalid or expired access token."
}
```

---

# Game Rooms

Each game is represented by a dedicated Socket.IO room.

## Room Format

```text
game:{gameId}
```

Example:

```text
game:12345
```

---

## Joining a Room

```typescript
client.join(`game:${gameId}`);
```

---

## Broadcasting to a Room

```typescript
this.server.to(`game:${gameId}`).emit("moveMade", payload);
```

---

# Matchmaking Flow

Players enter matchmaking through the REST API.

```http
POST /matchmaking/join
```

When an opponent is found, the server emits:

---

## Server → Client

### Event

```text
gameStarted
```

### Payload

```json
{
  "gameId": "game_123",
  "whitePlayer": {
    "id": "usr_001",
    "username": "Alice"
  },
  "blackPlayer": {
    "id": "usr_002",
    "username": "Bob"
  },
  "fen": "startpos",
  "currentTurn": "WHITE"
}
```

---

# Join Game

## Client → Server

### Event

```text
joinGame
```

### Payload

```json
{
  "gameId": "game_123"
}
```

---

## Server → Client

### Event

```text
gameJoined
```

### Payload

```json
{
  "gameId": "game_123"
}
```

---

# Make Move

## Client → Server

### Event

```text
makeMove
```

### Payload

```json
{
  "gameId": "game_123",
  "from": "e2",
  "to": "e4",
  "promotion": null
}
```

---

# Server Validation

The server validates:

- Player turn
- Legal move
- Check
- Checkmate
- Stalemate
- Draw conditions
- Game status

---

# Move Accepted

## Server → Client

### Event

```text
moveMade
```

### Payload

```json
{
  "gameId": "game_123",
  "move": "e2e4",
  "san": "e4",
  "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
  "currentTurn": "BLACK",
  "check": false
}
```

Broadcast to all clients in the game room.

---

# Move Rejected

## Server → Client

### Event

```text
moveRejected
```

### Payload

```json
{
  "reason": "Illegal move"
}
```

---

# Recommended Acknowledgement Pattern

NestJS Socket.IO supports acknowledgements.

## Client

```typescript
socket.emit("makeMove", payload, (response) => {
  console.log(response);
});
```

## Success Response

```json
{
  "success": true
}
```

## Failure Response

```json
{
  "success": false,
  "error": "NOT_YOUR_TURN"
}
```

Acknowledgements should be preferred for request-specific validation failures.

---

# Game State Synchronization

Used after reconnection.

## Server → Client

### Event

```text
gameStateUpdated
```

### Payload

```json
{
  "gameId": "game_123",
  "fen": "...",
  "currentTurn": "WHITE",
  "status": "ACTIVE"
}
```

---

# Game Actions

A single event is used for all game actions.

## Client → Server

### Event

```text
gameAction
```

### Payload

```json
{
  "gameId": "game_123",
  "action": "RESIGN"
}
```

Supported values:

```text
RESIGN
OFFER_DRAW
ACCEPT_DRAW
DECLINE_DRAW
```

---

# Draw Offered

## Server → Client

### Event

```text
drawOffered
```

### Payload

```json
{
  "playerId": "usr_001"
}
```

---

# Draw Declined

## Server → Client

### Event

```text
drawDeclined
```

### Payload

```json
{
  "playerId": "usr_002"
}
```

---

# Draw Accepted

## Server → Client

### Event

```text
gameOver
```

### Payload

```json
{
  "result": "DRAW"
}
```

---

# Resignation

## Server → Client

### Event

```text
gameOver
```

### Payload

```json
{
  "winner": "usr_002",
  "reason": "RESIGNATION"
}
```

---

# Player Disconnected

## Server → Client

### Event

```text
playerDisconnected
```

### Payload

```json
{
  "playerId": "usr_001"
}
```

---

# Player Reconnected

## Server → Client

### Event

```text
playerReconnected
```

### Payload

```json
{
  "playerId": "usr_001"
}
```

The server should immediately send a `gameStateUpdated` event afterward.

---

# Game Over

## Server → Client

### Event

```text
gameOver
```

### Payload

```json
{
  "winner": "usr_001",
  "result": "CHECKMATE",
  "finalFen": "...",
  "moves": 47
}
```

---

## Result Values

```text
CHECKMATE
STALEMATE
DRAW
RESIGNATION
TIMEOUT
```

---

# AI Games

AI games primarily use REST endpoints:

```http
POST /games/ai
POST /games/{gameId}/moves
```

If AI computation is asynchronous, the server may emit:

---

## Server → Client

### Event

```text
aiMove
```

### Payload

```json
{
  "gameId": "game_ai_001",
  "move": "e7e5",
  "san": "e5",
  "fen": "...",
  "currentTurn": "WHITE"
}
```

---

# Error Handling

NestJS WebSocket exception filters should be used for centralized error handling.

Example:

```typescript
@UseFilters(WsExceptionFilter)
@WebSocketGateway()
export class GameGateway {}
```

---

# Error Event

## Server → Client

### Event

```text
error
```

### Payload

```json
{
  "code": "GAME_NOT_FOUND",
  "message": "The requested game could not be found."
}
```

---

## Common Error Codes

| Code               | Description                |
| ------------------ | -------------------------- |
| UNAUTHORIZED       | Authentication failed      |
| GAME_NOT_FOUND     | Game does not exist        |
| GAME_FINISHED      | Game already ended         |
| INVALID_MOVE       | Illegal chess move         |
| NOT_YOUR_TURN      | Attempted move out of turn |
| PLAYER_NOT_IN_GAME | User not part of game      |
| INTERNAL_ERROR     | Unexpected server error    |

---

# Event Summary

## Client → Server Events

| Event        | Description                    |
| ------------ | ------------------------------ |
| authenticate | Authenticate socket connection |
| joinGame     | Join game room                 |
| makeMove     | Submit a move                  |
| gameAction   | Draw/resign actions            |

---

## Server → Client Events

| Event              | Description                |
| ------------------ | -------------------------- |
| authenticated      | Authentication successful  |
| gameStarted        | Matchmaking found opponent |
| gameJoined         | Joined game room           |
| moveMade           | Move accepted              |
| moveRejected       | Move invalid               |
| gameStateUpdated   | Synchronize board state    |
| drawOffered        | Opponent offered draw      |
| drawDeclined       | Opponent declined draw     |
| playerDisconnected | Opponent disconnected      |
| playerReconnected  | Opponent reconnected       |
| aiMove             | AI move generated          |
| gameOver           | Game completed             |
| error              | Error notification         |

---

# Example Gameplay Sequence

```text
Client
  │
  ├── authenticate ─────────────────────►
  │◄── authenticated ────────────────────
  │
  ├── POST /matchmaking/join ───────────► REST API
  │
  │◄── gameStarted ──────────────────────
  │
  ├── joinGame ─────────────────────────►
  │◄── gameJoined ───────────────────────
  │
  ├── makeMove ─────────────────────────►
  │◄── moveMade ─────────────────────────
  │
  ├── gameAction (OFFER_DRAW) ──────────►
  │◄── drawOffered ──────────────────────
  │
  ├── gameAction (ACCEPT_DRAW) ─────────►
  │◄── gameOver (DRAW) ──────────────────
```
