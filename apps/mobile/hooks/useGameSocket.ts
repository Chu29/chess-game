import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { API_URL } from "../lib/config";
import { getAccessToken } from "../lib/tokenStore";
import { useAuth } from "../context/AuthContext";

export interface GameState {
  fen: string;
  whitePlayerId: string;
  blackPlayerId: string;
  whiteUsername: string;
  blackUsername: string;
  currentTurn: "WHITE" | "BLACK";
  playerColor: "WHITE" | "BLACK" | null;
  lastMove: { from: string; to: string } | null;
  winnerId: string | null;
  gameStatus: "ACTIVE" | "FINISHED";
  endReason: string | null;
  drawOfferedBy: string | null;
}

export function useGameSocket(
  gameId: string,
  initialState?: {
    fen?: string;
    whitePlayerId?: string;
    blackPlayerId?: string;
    whiteUsername?: string;
    blackUsername?: string;
  },
) {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(
    initialState
      ? {
          fen: initialState.fen || "",
          whitePlayerId: initialState.whitePlayerId || "",
          blackPlayerId: initialState.blackPlayerId || "",
          whiteUsername: initialState.whiteUsername || "Unknown",
          blackUsername: initialState.blackUsername || "Unknown",
          currentTurn: "WHITE",
          playerColor: null,
          lastMove: null,
          winnerId: null,
          gameStatus: "ACTIVE",
          endReason: null,
          drawOfferedBy: null,
        }
      : null,
  );

  // Setup the socket connection and register events
  useEffect(() => {
    if (!user || !gameId) return;

    let isMounted = true;

    const initSocket = async () => {
      try {
        const token = await getAccessToken();
        if (!token || !isMounted) return;

        const baseSocketUrl = API_URL.replace("/api/v1", "");
        const socket = io(`${baseSocketUrl}/game`, {
          auth: { token },
          transports: ["websocket"],
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          if (!isMounted) return;
          setIsConnected(true);
          setError(null);
          // On successful connection, request game reconnection/sync
          socket.emit("reconnect", { gameId, playerId: user.id });
        });

        socket.on("disconnect", () => {
          if (!isMounted) return;
          setIsConnected(false);
        });

        socket.on("connect_error", (err) => {
          if (!isMounted) return;
          setError(err.message || "Connection error");
        });

        socket.on("reconnectRejected", (data: { message: string }) => {
          if (!isMounted) return;
          setError(data.message);
        });

        socket.on(
          "gameStateUpdated",
          (data: {
            gameId: string;
            fen: string;
            white: string;
            black: string;
            whiteUsername?: string;
            blackUsername?: string;
            turn: "w" | "b";
            color: "w" | "b";
            drawOfferedBy: string | null;
          }) => {
            if (!isMounted) return;
            setGameState((prev) => ({
              fen: data.fen,
              whitePlayerId: data.white,
              blackPlayerId: data.black,
              whiteUsername:
                data.whiteUsername || prev?.whiteUsername || "Unknown",
              blackUsername:
                data.blackUsername || prev?.blackUsername || "Unknown",
              currentTurn: data.turn === "w" ? "WHITE" : "BLACK",
              playerColor: data.color === "w" ? "WHITE" : "BLACK",
              lastMove: null,
              winnerId: null,
              gameStatus: "ACTIVE",
              endReason: null,
              drawOfferedBy: data.drawOfferedBy,
            }));
          },
        );

        socket.on(
          "moveMade",
          (data: {
            fen: string;
            lastMove: { from: string; to: string } | null;
            nextTurn: "w" | "b";
            san: string;
            isCheck: boolean;
          }) => {
            if (!isMounted) return;
            setGameState((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                fen: data.fen,
                currentTurn: data.nextTurn === "w" ? "WHITE" : "BLACK",
                lastMove: data.lastMove,
                drawOfferedBy: null, // Move clears any active draw offers
              };
            });
          },
        );

        socket.on("moveRejected", (data: { message: string }) => {
          if (!isMounted) return;
          setError(data.message);
        });

        socket.on(
          "gameEnded",
          (data: {
            gameId: string;
            reason: string;
            winnerId: string | null;
          }) => {
            if (!isMounted) return;
            setGameState((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                gameStatus: "FINISHED",
                winnerId: data.winnerId,
                endReason: data.reason,
              };
            });
          },
        );

        socket.on(
          "drawOffered",
          (data: { gameId: string; offeredBy: string }) => {
            if (!isMounted) return;
            setGameState((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                drawOfferedBy: data.offeredBy,
              };
            });
          },
        );

        socket.on(
          "drawDeclined",
          (data: { gameId: string; declinedBy: string }) => {
            if (!isMounted) return;
            setGameState((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                drawOfferedBy: null,
              };
            });
          },
        );

        socket.on("actionRejected", (data: { message: string }) => {
          if (!isMounted) return;
          setError(data.message);
        });
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to initialize socket");
        }
      }
    };

    initSocket();

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [gameId, user]);

  const makeMove = useCallback(
    (from: string, to: string, promotion?: string) => {
      if (!socketRef.current || !isConnected || !user) return;
      setError(null);
      socketRef.current.emit("makeMove", {
        gameId,
        playerId: user.id,
        playerName: user.username,
        from,
        to,
        promotion,
      });
    },
    [gameId, isConnected, user],
  );

  const offerDraw = useCallback(() => {
    if (!socketRef.current || !isConnected || !user) return;
    setError(null);
    socketRef.current.emit("gameAction", {
      gameId,
      playerId: user.id,
      playerName: user.username,
      action: "drawOffer",
    });
  }, [gameId, isConnected, user]);

  const declineDraw = useCallback(() => {
    if (!socketRef.current || !isConnected || !user) return;
    setError(null);
    socketRef.current.emit("gameAction", {
      gameId,
      playerId: user.id,
      playerName: user.username,
      action: "declineDraw",
    });
  }, [gameId, isConnected, user]);

  const acceptDraw = useCallback(() => {
    if (!socketRef.current || !isConnected || !user) return;
    setError(null);
    socketRef.current.emit("gameAction", {
      gameId,
      playerId: user.id,
      playerName: user.username,
      action: "acceptDraw",
    });
  }, [gameId, isConnected, user]);

  const resign = useCallback(() => {
    if (!socketRef.current || !isConnected || !user) return;
    setError(null);
    socketRef.current.emit("gameAction", {
      gameId,
      playerId: user.id,
      playerName: user.username,
      action: "resign",
    });
  }, [gameId, isConnected, user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isConnected,
    error,
    gameState,
    makeMove,
    offerDraw,
    declineDraw,
    acceptDraw,
    resign,
    clearError,
  };
}
