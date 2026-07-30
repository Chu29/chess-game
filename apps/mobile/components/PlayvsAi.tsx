import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ChessBoard from "./game/ChessBoard";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import {
  gamesApi,
  AIDifficulty,
  PlayerColor,
  Game,
  MoveResponse,
} from "../lib/api";
import { useHint } from "../hooks/useHint";
import { AIHintButton, HintLoading, HintModal } from "./ai-coach";
import { Chess } from "chess.js";
import { useChessSounds } from "../hooks/useChessSounds";
import { getCapturedPieces } from "../lib/chessUtils";
import { CapturedPieces } from "./game/CapturedPieces";
import { GameEndPopup } from "./game/GameEndPopup";

export default function GameScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const params = useLocalSearchParams<{
    difficulty?: AIDifficulty;
    playerColor?: PlayerColor;
  }>();

  const difficulty: AIDifficulty = params.difficulty ?? "MEDIUM";
  const playerColor: PlayerColor = params.playerColor ?? "WHITE";

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [winner, setWinner] = useState<PlayerColor | null>(null);
  const [makingMove, setMakingMove] = useState(false);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null,
  );
  const { playMove, playCapture, playCheck } = useChessSounds();

  const createGame = useCallback(async () => {
    try {
      setLoading(true);
      const newGame = await gamesApi.createAIGame({
        difficulty,
        playerColor,
      });
      setGame(newGame);
      if (newGame.initialAiMove) {
        setLastMove(newGame.initialAiMove);
      }
      setLoading(false);
    } catch {
      setError("Failed to create game");
      setLoading(false);
    }
  }, [difficulty, playerColor]);

  useEffect(() => {
    createGame();
  }, [createGame]);

  const handleMove = async (from: string, to: string, promotion?: string) => {
    if (!game || makingMove || gameOver) return;

    try {
      setMakingMove(true);
      setError(null);

      const response: MoveResponse = await gamesApi.makeMove(game.id, {
        from,
        to,
        promotion,
      });

      // Update game state
      setGame((prev) =>
        prev
          ? { ...prev, fen: response.fen, currentTurn: response.currentTurn }
          : null,
      );

      // Track the last move for board highlighting
      if (response.aiMove) {
        setLastMove({ from: response.aiMove.from, to: response.aiMove.to });
        if (game.fen) {
          try {
            const tempChess = new Chess(game.fen);
            const moves = tempChess.moves({ verbose: true });
            const moveObj = moves.find(
              (m) =>
                m.from === response.aiMove!.from &&
                m.to === response.aiMove!.to,
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
          } catch (e) {}
        }
      } else if (response.playerMove) {
        setLastMove({
          from: response.playerMove.from,
          to: response.playerMove.to,
        });
      }

      if (response.gameOver) {
        setGameOver(true);
        setGameResult(response.result || null);
        setWinner(response.winner || null);
      }

      setMakingMove(false);
    } catch {
      setError("Failed to make move");
      setMakingMove(false);
    }
  };

  const handleResign = async () => {
    if (!game) return;

    try {
      await gamesApi.performGameAction(game.id, { action: "RESIGN" });
      setGameOver(true);
      setGameResult("RESIGNATION");
      setWinner(playerColor === "WHITE" ? "BLACK" : "WHITE");
    } catch {
      setError("Failed to resign");
    }
  };

  const handleOfferDraw = async () => {
    if (!game) return;

    try {
      await gamesApi.performGameAction(game.id, { action: "ACCEPT_DRAW" });
      setGameOver(true);
      setGameResult("DRAW");
      setWinner(null);
    } catch {
      setError("Failed to offer draw");
    }
  };

  const {
    remaining: hintsRemaining,
    loading: hintLoading,
    hint,
    error: hintError,
    modalVisible: hintModalVisible,
    requestHint,
    closeModal: closeHintModal,
  } = useHint({ gameId: game?.id ?? "" });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.green} size="large" />
          <Text style={styles.loadingText}>Creating AI game...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !game) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error || "Game not found"}</Text>
          <Pressable onPress={createGame} style={styles.retryBtn}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isMyTurn = game.currentTurn === playerColor;
  const opponentColor = playerColor === "WHITE" ? "BLACK" : "WHITE";
  const opponentName =
    difficulty === "EASY"
      ? "Stockfish (800)"
      : difficulty === "MEDIUM"
        ? "Stockfish (1500)"
        : "Stockfish (2500)";

  const { whiteCaptured, blackCaptured } = getCapturedPieces(game.fen);
  const myCaptured = playerColor === "WHITE" ? whiteCaptured : blackCaptured;
  const opponentCaptured =
    playerColor === "WHITE" ? blackCaptured : whiteCaptured;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace("/(tabs)")}
          style={styles.headerIcon}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          vs AI ({difficulty})
        </Text>
      </View>

      {/* Error Alert */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
          <Pressable onPress={() => setError(null)} style={styles.errorClose}>
            <Ionicons name="close" size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      )}

      {/* Main Content Area */}
      <View style={styles.content}>
        {/* Opponent Box */}
        <View
          style={[
            styles.playerCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
            },
            !isMyTurn && !gameOver ? styles.activePlayerCard : undefined,
          ]}
        >
          <View style={styles.playerInfoRow}>
            <View style={styles.avatarContainer}>
              <View
                style={[
                  styles.avatarPlaceholder,
                  { backgroundColor: colors.cardBorder },
                ]}
              >
                <Ionicons
                  name="person"
                  size={22}
                  color={
                    opponentColor === "WHITE" ? "#FFFFFF" : colors.textSecondary
                  }
                />
              </View>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: colors.green,
                    borderColor: colors.card,
                  },
                ]}
              />
            </View>
            <View style={styles.nameColumn}>
              <Text style={[styles.playerName, { color: colors.textPrimary }]}>
                {opponentName}
              </Text>
              <View style={styles.ratingRow}>
                <Text
                  style={[styles.ratingText, { color: colors.textSecondary }]}
                >
                  {difficulty === "EASY"
                    ? "800"
                    : difficulty === "MEDIUM"
                      ? "1500"
                      : "2500"}
                </Text>
                <Ionicons
                  name="people-outline"
                  size={14}
                  color={colors.textSecondary}
                  style={styles.iconMargin}
                />
              </View>
              <CapturedPieces counts={opponentCaptured} color={opponentColor} />
            </View>
          </View>
          <View
            style={[
              styles.clockContainer,
              { backgroundColor: colors.cardBorder },
            ]}
          >
            <Text style={[styles.clockText, { color: colors.textPrimary }]}>
              Casual
            </Text>
          </View>
        </View>

        {/* Chessboard wrapper */}
        <View style={styles.boardWrapper}>
          <ChessBoard
            fen={game.fen}
            playerColor={playerColor}
            lastMove={lastMove}
            onMove={handleMove}
            interactive={isMyTurn && !makingMove && !gameOver}
          />
        </View>

        {/* Player Box */}
        <View
          style={[
            styles.playerCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
            },
            isMyTurn && !gameOver ? styles.activePlayerCard : undefined,
          ]}
        >
          <View style={styles.playerInfoRow}>
            <View style={styles.avatarContainer}>
              <View
                style={[
                  styles.avatarPlaceholder,
                  { backgroundColor: colors.cardBorder },
                ]}
              >
                <Ionicons
                  name="person"
                  size={22}
                  color={playerColor === "WHITE" ? "#FFFFFF" : colors.green}
                />
              </View>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: colors.green,
                    borderColor: colors.card,
                  },
                ]}
              />
            </View>
            <View style={styles.nameColumn}>
              <Text style={[styles.playerName, { color: colors.textPrimary }]}>
                You
              </Text>
              <Text
                style={[styles.playerSubtitle, { color: colors.textSecondary }]}
              >
                ({user?.username || "Player"})
              </Text>
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.ratingBadge,
                    { backgroundColor: `${colors.green}1A` },
                  ]}
                >
                  <Text
                    style={[styles.ratingBadgeText, { color: colors.green }]}
                  >
                    {user?.rating || "1200"}
                  </Text>
                </View>
                <Ionicons
                  name="people-outline"
                  size={14}
                  color={colors.textSecondary}
                  style={styles.iconMargin}
                />
              </View>
              <CapturedPieces counts={myCaptured} color={playerColor} />
            </View>
          </View>
          <View
            style={[
              styles.clockContainer,
              styles.playerClock,
              {
                backgroundColor: colors.cardBorder,
                borderColor: `${colors.green}40`,
              },
            ]}
          >
            <Text style={[styles.clockText, { color: colors.green }]}>
              00:00
            </Text>
          </View>
        </View>

        {/* Bottom Actions Row */}
        <View style={styles.actionsRow}>
          {!gameOver ? (
            <>
              <Pressable
                onPress={handleOfferDraw}
                disabled={makingMove}
                style={[
                  styles.actionBtn,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                  },
                  makingMove ? styles.disabledBtn : undefined,
                ]}
              >
                <MaterialCommunityIcons
                  name="handshake-outline"
                  size={22}
                  color={colors.textPrimary}
                />
                <Text
                  style={[styles.actionBtnText, { color: colors.textPrimary }]}
                >
                  Draw
                </Text>
              </Pressable>

              <Pressable
                onPress={handleResign}
                disabled={makingMove}
                style={[
                  styles.actionBtn,
                  styles.resignBtn,
                  { backgroundColor: colors.loss },
                  makingMove ? styles.disabledBtn : undefined,
                ]}
              >
                <Ionicons name="flag" size={18} color="#FFFFFF" />
                <Text style={[styles.actionBtnText, { color: "#FFFFFF" }]}>
                  Resign
                </Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              onPress={() => router.replace("/(tabs)")}
              style={[styles.newGameBtn, { backgroundColor: colors.green }]}
            >
              <Text style={[styles.actionBtnText, { color: "#FFFFFF" }]}>
                New Game
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* AI Coach */}
      {!gameOver && (
        <AIHintButton
          remaining={hintsRemaining}
          loading={hintLoading}
          onPress={() =>
            requestHint(game.fen, playerColor === "WHITE" ? "white" : "black")
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
        visible={gameOver}
        result={
          winner === playerColor
            ? "WIN"
            : winner === opponentColor
              ? "LOSS"
              : "DRAW"
        }
        reason={`Game Over (${gameResult || ""})`}
        primaryButtonLabel="Replay"
        onPrimaryAction={() => {
          setGameOver(false);
          createGame();
        }}
        secondaryButtonLabel="View Board"
        onSecondaryAction={() => setGameOver(false)}
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
  errorText: {
    fontSize: 16,
    marginBottom: 16,
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryBtnText: {
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerIcon: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  errorBannerText: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  errorClose: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "space-evenly",
    paddingBottom: 16,
  },
  playerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  activePlayerCard: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  playerInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  statusDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  nameColumn: {
    justifyContent: "center",
  },
  playerName: {
    fontSize: 15,
    fontWeight: "700",
  },
  playerSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  iconMargin: {
    marginLeft: 6,
  },
  clockContainer: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  playerClock: {
    borderWidth: 1,
  },
  clockText: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  boardWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    position: "relative",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  loadingOverlayText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  resignBtn: {
    borderColor: "transparent",
  },
  newGameBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledBtn: {
    opacity: 0.5,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});
