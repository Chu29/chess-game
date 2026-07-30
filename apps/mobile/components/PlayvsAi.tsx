import React, { useState, useEffect, useCallback, useRef } from "react";
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
import ConfettiCannon from "react-native-confetti-cannon";
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

export default function GameScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const params = useLocalSearchParams<{
    difficulty?: AIDifficulty;
    playerColor?: PlayerColor;
  }>();

  const confettiRef = useRef<ConfettiCannon | null>(null);

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [makingMove, setMakingMove] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [winner, setWinner] = useState<PlayerColor | null>(null);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null,
  );

  const difficulty = (params.difficulty as AIDifficulty) || "MEDIUM";
  const playerColor = (params.playerColor as PlayerColor) || "WHITE";

  // Trigger confetti whenever the player wins (checkmate, resignation, etc.)
  useEffect(() => {
    if (gameOver && winner === playerColor) {
      confettiRef.current?.start();
    }
  }, [gameOver, winner, playerColor]);

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
      // Player clicked resign -> Opponent wins
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

      {/* Game Over Alert */}
      {gameOver && (
        <View style={styles.gameOverBanner}>
          <Text style={styles.gameOverTitle}>Game Over ({gameResult})</Text>
          <Text style={styles.gameOverSubtitle}>
            {winner === playerColor
              ? "🏆 You Won!"
              : winner === opponentColor
                ? "💔 You Lost"
                : "🤝 It's a Draw"}
          </Text>
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
            onMove={handleMove}
            interactive={isMyTurn && !gameOver && !makingMove}
            lastMove={lastMove}
          />
          {makingMove && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color={colors.green} size="large" />
              <Text style={styles.loadingOverlayText}>AI thinking...</Text>
            </View>
          )}
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
              Casual
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

      {/* Confetti Animation Component */}
      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{ x: -10, y: 0 }}
        autoStart={false}
        fadeOut
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
  gameOverBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  gameOverTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  gameOverSubtitle: {
    fontSize: 14,
    fontWeight: "600",
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