import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ChessBoard from "../../components/game/ChessBoard";
import { useGameSocket } from "../../hooks/useGameSocket";
import { useHint } from "../../hooks/useHint";
import {
  AIHintButton,
  HintLoading,
  HintModal,
} from "../../components/ai-coach";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Chess } from "chess.js";
import { useChessSounds } from "../../hooks/useChessSounds";
import { getCapturedPieces } from "../../lib/chessUtils";
import { CapturedPieces } from "../../components/game/CapturedPieces";
import { GameEndPopup } from "../../components/game/GameEndPopup";
import { useSound } from "../../context/SoundContext";
import { countPieces, isPositionInCheck } from "../../lib/fen-sound-helpers";

const INITIAL_TIME_SECONDS = 180; // 3 minutes per player

export default function GameScreen() {
  const params = useLocalSearchParams<{
    gameId: string;
    fen?: string;
    whitePlayerId?: string;
    blackPlayerId?: string;
    whiteUsername?: string;
    blackUsername?: string;
  }>();
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();

  const {
    isConnected,
    error,
    gameState,
    makeMove,
    offerDraw,
    declineDraw,
    acceptDraw,
    resign,
    offerRematch,
    declineRematch,
    acceptRematch,
    clearError,
  } = useGameSocket(params.gameId, {
    fen: params.fen,
    whitePlayerId: params.whitePlayerId,
    blackPlayerId: params.blackPlayerId,
    whiteUsername: params.whiteUsername,
    blackUsername: params.blackUsername,
  });

  const {
    remaining: hintsRemaining,
    loading: hintLoading,
    hint,
    error: hintError,
    modalVisible: hintModalVisible,
    requestHint,
    closeModal: closeHintModal,
  } = useHint({ gameId: params.gameId });

  // 3-Minute Timers State
  const [whiteTime, setWhiteTime] = useState<number>(INITIAL_TIME_SECONDS);
  const [blackTime, setBlackTime] = useState<number>(INITIAL_TIME_SECONDS);

  const previousFenRef = React.useRef<string | null>(null);
  const { playMove, playCapture, playCheck } = useChessSounds();
  const [showEndPopup, setShowEndPopup] = React.useState(true);

  // Synchronize clocks if server provides remaining time, or reset on new game
  useEffect(() => {
    if (gameState?.whiteTime !== undefined) setWhiteTime(gameState.whiteTime);
    if (gameState?.blackTime !== undefined) setBlackTime(gameState.blackTime);
  }, [gameState?.whiteTime, gameState?.blackTime]);

  // Timer Tick Logic
  useEffect(() => {
    if (gameState?.gameStatus !== "ACTIVE") return;

    const interval = setInterval(() => {
      if (gameState.currentTurn === "WHITE") {
        setWhiteTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            if (gameState.playerColor === "WHITE") resign();
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            if (gameState.playerColor === "BLACK") resign();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    gameState?.gameStatus,
    gameState?.currentTurn,
    gameState?.playerColor,
    resign,
  ]);

  React.useEffect(() => {
    if (!gameState?.fen) return;
    const oldFen = previousFenRef.current;
    if (oldFen && oldFen !== gameState.fen && gameState.lastMove) {
      if (gameState.currentTurn === gameState.playerColor) {
        try {
          const tempChess = new Chess(oldFen);
          const moves = tempChess.moves({ verbose: true });
          const moveObj = moves.find(
            (m) =>
              m.from === gameState.lastMove!.from &&
              m.to === gameState.lastMove!.to,
          );
          if (
            moveObj &&
            (moveObj.san.endsWith("+") || moveObj.san.endsWith("#"))
          ) {
            playCheck();
          } else if (
            moveObj &&
            (moveObj.captured || moveObj.flags.includes("c"))
          ) {
            playCapture();
          } else {
            playMove();
          }
        } catch {
          // Ignored
        }
      }
    }
    previousFenRef.current = gameState.fen;
  }, [
    gameState?.fen,
    gameState?.lastMove,
    gameState?.currentTurn,
    gameState?.playerColor,
    playCheck,
    playCapture,
    playMove,
  ]);

  React.useEffect(() => {
    if (gameState?.rematchOfferedBy === "DECLINED") {
      setShowEndPopup(false);
      router.replace("/(tabs)");
    } else if (gameState?.rematchAcceptedId) {
      setShowEndPopup(false);
      router.replace({
        pathname: "/game/[gameId]",
        params: { gameId: gameState.rematchAcceptedId },
      });
    }
  }, [gameState?.rematchOfferedBy, gameState?.rematchAcceptedId, router]);

  const { playSfx } = useSound();
  const prevFenRef = useRef<string | null>(null);
  const prevStatusRef = useRef<string | null>(null);

  useEffect(() => {
    if (!gameState?.fen) return;

    const prevFen = prevFenRef.current;
    if (prevFen && prevFen !== gameState.fen) {
      if (isPositionInCheck(gameState.fen)) {
        playSfx("check");
      } else if (countPieces(gameState.fen) < countPieces(prevFen)) {
        playSfx("capture");
      }
    }
    prevFenRef.current = gameState.fen;
  }, [gameState?.fen, playSfx]);

  useEffect(() => {
    if (
      gameState?.gameStatus === "FINISHED" &&
      prevStatusRef.current !== "FINISHED"
    ) {
      playSfx("gameEnd");
    }
    prevStatusRef.current = gameState?.gameStatus ?? null;
  }, [gameState?.gameStatus, playSfx]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (!gameState) {
    return (
      <SafeAreaView
        style={[styles.center, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator color={colors.green} size="large" />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Connecting to game...
        </Text>
      </SafeAreaView>
    );
  }

  const isMyTurn =
    gameState.gameStatus === "ACTIVE" &&
    gameState.currentTurn === gameState.playerColor;

  const isWhite = gameState.playerColor === "WHITE";
  const myId = user?.id;
  const opponentId = isWhite
    ? gameState.blackPlayerId
    : gameState.whitePlayerId;
  const opponentUsername = isWhite
    ? gameState.blackUsername || "Unknown"
    : gameState.whiteUsername || "Unknown";
  const opponentColor = isWhite ? "BLACK" : "WHITE";

  const { whiteCaptured, blackCaptured } = getCapturedPieces(gameState.fen);
  const myCaptured = isWhite ? whiteCaptured : blackCaptured;
  const opponentCaptured = isWhite ? blackCaptured : whiteCaptured;

  const myTime = isWhite ? whiteTime : blackTime;
  const opponentTime = isWhite ? blackTime : whiteTime;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={colors.textPrimary}
          />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {gameState.whiteUsername} vs {gameState.blackUsername}
          </Text>
          <Text style={[styles.gameIdText, { color: colors.textSecondary }]}>
            Game ID: {params.gameId.slice(0, 8)}
          </Text>
        </View>
        <View
          style={[
            styles.connectionBadge,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <View
            style={[
              styles.connectionDot,
              {
                backgroundColor: isConnected ? colors.green : "#D9534F",
              },
            ]}
          />
          <Text style={[styles.connectionText, { color: colors.textPrimary }]}>
            {isConnected ? "Live" : "Reconnecting"}
          </Text>
        </View>
      </View>

      {/* Error Alert */}
      {error && (
        <View style={styles.errorAlert}>
          <Text style={styles.errorAlertText}>{error}</Text>
          <Pressable onPress={clearError} style={styles.errorClose}>
            <MaterialCommunityIcons name="close" size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      )}

      {/* Content wrapper */}
      <View style={styles.content}>
        {/* Opponent Card */}
        <View
          style={[
            styles.playerCard,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
            !isMyTurn &&
              gameState.gameStatus === "ACTIVE" && [
                styles.activePlayerCard,
                { borderColor: colors.green },
              ],
          ]}
        >
          <View style={styles.playerInfo}>
            <MaterialCommunityIcons
              name="account"
              size={24}
              color={colors.textPrimary}
            />
            <View style={styles.playerNameContainer}>
              <Text style={[styles.playerName, { color: colors.textPrimary }]}>
                {opponentUsername}
              </Text>
              <Text
                style={[styles.playerMeta, { color: colors.textSecondary }]}
              >
                ID: {opponentId.slice(0, 8)}
              </Text>
              <CapturedPieces counts={opponentCaptured} color={opponentColor} />
            </View>
          </View>
          <View
            style={[
              styles.timerBadge,
              { backgroundColor: colors.cardBorder },
              opponentTime <= 30 && styles.lowTimeBadge,
            ]}
          >
            <MaterialCommunityIcons
              name="clock-outline"
              size={14}
              color={opponentTime <= 30 ? "#D9534F" : colors.textPrimary}
            />
            <Text
              style={[
                styles.timerText,
                {
                  color: opponentTime <= 30 ? "#D9534F" : colors.textPrimary,
                },
              ]}
            >
              {formatTime(opponentTime)}
            </Text>
          </View>
        </View>

        {/* The Board */}
        <View style={styles.boardWrapper}>
          <ChessBoard
            fen={gameState.fen}
            playerColor={gameState.playerColor || "WHITE"}
            lastMove={gameState.lastMove}
            onMove={(from, to) => makeMove(from, to)}
            interactive={isMyTurn}
          />
        </View>

        {/* You Card */}
        <View
          style={[
            styles.playerCard,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
            isMyTurn &&
              gameState.gameStatus === "ACTIVE" && [
                styles.activePlayerCard,
                { borderColor: colors.green },
              ],
          ]}
        >
          <View style={styles.playerInfo}>
            <MaterialCommunityIcons
              name="account"
              size={24}
              color={colors.textPrimary}
            />
            <View style={styles.playerNameContainer}>
              <Text style={[styles.playerName, { color: colors.textPrimary }]}>
                {user?.username ||
                  `Player ${gameState.playerColor?.toLowerCase()}`}{" "}
                (You)
              </Text>
              <Text
                style={[styles.playerMeta, { color: colors.textSecondary }]}
              >
                ID: {myId?.slice(0, 8)}
              </Text>
              <CapturedPieces
                counts={myCaptured}
                color={gameState.playerColor || "WHITE"}
              />
            </View>
          </View>
          <View
            style={[
              styles.timerBadge,
              { backgroundColor: colors.cardBorder },
              myTime <= 30 && styles.lowTimeBadge,
            ]}
          >
            <MaterialCommunityIcons
              name="clock-outline"
              size={14}
              color={myTime <= 30 ? "#D9534F" : colors.textPrimary}
            />
            <Text
              style={[
                styles.timerText,
                {
                  color: myTime <= 30 ? "#D9534F" : colors.textPrimary,
                },
              ]}
            >
              {formatTime(myTime)}
            </Text>
          </View>
        </View>
      </View>

      {/* Draw Offers & Ends Alert */}
      {gameState.gameStatus === "ACTIVE" && gameState.drawOfferedBy && (
        <View
          style={[
            styles.alertBanner,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          {gameState.drawOfferedBy === myId ? (
            <Text style={[styles.alertText, { color: colors.textPrimary }]}>
              Draw offer sent. Waiting for response...
            </Text>
          ) : (
            <View style={styles.alertActionsRow}>
              <Text style={[styles.alertText, { color: colors.textPrimary }]}>
                Opponent offered a draw.
              </Text>
              <View style={styles.actionButtons}>
                <Pressable
                  onPress={acceptDraw}
                  style={[styles.smallBtn, { backgroundColor: colors.green }]}
                >
                  <Text style={styles.smallBtnText}>Accept</Text>
                </Pressable>
                <Pressable
                  onPress={declineDraw}
                  style={[styles.smallBtn, { backgroundColor: "#D9534F" }]}
                >
                  <Text style={styles.smallBtnText}>Decline</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Footer Controls */}
      <View style={[styles.footer, { borderTopColor: colors.cardBorder }]}>
        {gameState.gameStatus === "ACTIVE" ? (
          <View style={styles.actionRow}>
            <Pressable
              onPress={offerDraw}
              disabled={!!gameState.drawOfferedBy}
              style={[
                styles.actionBtn,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                  borderWidth: 1,
                },
                !!gameState.drawOfferedBy && styles.disabledBtn,
              ]}
            >
              <MaterialCommunityIcons
                name="handshake"
                size={20}
                color={colors.textPrimary}
              />
              <Text
                style={[styles.actionBtnText, { color: colors.textPrimary }]}
              >
                Offer Draw
              </Text>
            </Pressable>

            <Pressable
              onPress={resign}
              style={[
                styles.actionBtn,
                {
                  backgroundColor: "#D9534F20",
                  borderWidth: 1,
                  borderColor: "#D9534F50",
                },
              ]}
            >
              <MaterialCommunityIcons name="flag" size={20} color="#D9534F" />
              <Text style={[styles.actionBtnText, { color: "#D9534F" }]}>
                Resign
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={() => router.replace("/(tabs)")}
            style={[styles.lobbyBtn, { backgroundColor: colors.green }]}
          >
            <Text style={[styles.actionBtnText, { color: "#1B3310" }]}>
              Back to Lobby
            </Text>
          </Pressable>
        )}
      </View>

      {/* AI Coach */}
      {gameState.gameStatus === "ACTIVE" && (
        <AIHintButton
          remaining={hintsRemaining}
          loading={hintLoading}
          onPress={() =>
            requestHint(
              gameState.fen,
              gameState.playerColor === "WHITE" ? "white" : "black",
            )
          }
        />
      )}
      <HintLoading visible={hintLoading} />
      <HintModal
        visible={hintModalVisible}
        hint={hint}
        error={hintError}
        onClose={closeHintModal}
      />

      <GameEndPopup
        visible={gameState.gameStatus === "FINISHED" && showEndPopup}
        result={
          gameState.winnerId
            ? gameState.winnerId === myId
              ? "WIN"
              : "LOSS"
            : "DRAW"
        }
        reason={`Game Ended (${gameState.endReason || ""})`}
        primaryButtonLabel="Rematch"
        onPrimaryAction={offerRematch}
        secondaryButtonLabel="Lobby"
        onSecondaryAction={() => {
          setShowEndPopup(false);
          router.replace("/(tabs)");
        }}
        isRematchOffered={!!gameState.rematchOfferedBy}
        isRematchOfferedByMe={gameState.rematchOfferedBy === myId}
        onAcceptRematch={acceptRematch}
        onDeclineRematch={declineRematch}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  gameIdText: {
    fontSize: 12,
  },
  connectionBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  connectionText: {
    fontSize: 12,
    fontWeight: "500",
  },
  errorAlert: {
    backgroundColor: "#D9534F",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  errorAlertText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  errorClose: {
    padding: 4,
  },
  content: {
    flex: 1,
    justifyContent: "space-around",
    paddingVertical: 12,
  },
  playerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  activePlayerCard: {
    borderWidth: 1.5,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  playerNameContainer: {
    marginLeft: 10,
  },
  playerName: {
    fontSize: 15,
    fontWeight: "600",
  },
  playerMeta: {
    fontSize: 12,
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 4,
  },
  lowTimeBadge: {
    backgroundColor: "#D9534F1A",
  },
  timerText: {
    fontSize: 14,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  boardWrapper: {
    alignSelf: "center",
    marginVertical: 12,
  },
  alertBanner: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 16,
  },
  alertText: {
    fontSize: 14,
    fontWeight: "500",
  },
  alertActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  actionButtons: {
    flexDirection: "row",
  },
  smallBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  smallBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    flex: 0.48,
  },
  lobbyBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
  },
});
