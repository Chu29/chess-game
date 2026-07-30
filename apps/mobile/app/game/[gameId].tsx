import React, { useEffect, useRef } from "react";
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
import ConfettiCannon from "react-native-confetti-cannon";
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

  const confettiRef = useRef<ConfettiCannon | null>(null);

  const {
    isConnected,
    error,
    gameState,
    makeMove,
    offerDraw,
    declineDraw,
    acceptDraw,
    resign,
    clearError,
  } = useGameSocket(params.gameId, {
    fen: params.fen,
    whitePlayerId: params.whitePlayerId,
    blackPlayerId: params.blackPlayerId,
    whiteUsername: params.whiteUsername,
    blackUsername: params.blackUsername,
  });

  // AI Coach — real game session, so hints are tracked server-side against
  // this gameId via GameStateService.
  const {
    remaining: hintsRemaining,
    loading: hintLoading,
    hint,
    error: hintError,
    modalVisible: hintModalVisible,
    requestHint,
    closeModal: closeHintModal,
  } = useHint({ gameId: params.gameId });

  const myId = user?.id;

  // Trigger confetti when the current player wins the PvP match
  useEffect(() => {
    if (
      gameState &&
      gameState.gameStatus === "FINISHED" &&
      gameState.winnerId &&
      gameState.winnerId === myId
    ) {
      confettiRef.current?.start();
    }
  }, [gameState?.gameStatus, gameState?.winnerId, myId]);

  // Debug: log initial params
  console.log("Game params:", {
    gameId: params.gameId,
    whiteUsername: params.whiteUsername,
    blackUsername: params.blackUsername,
  });

  // Debug: log game state when it changes
  console.log("Current game state:", gameState);

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
  const opponentId = isWhite
    ? gameState.blackPlayerId
    : gameState.whitePlayerId;
  const opponentUsername = isWhite
    ? gameState.blackUsername || "Unknown"
    : gameState.whiteUsername || "Unknown";
  const opponentColor = isWhite ? "BLACK" : "WHITE";

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
            </View>
          </View>
          <View
            style={[styles.turnBadge, { backgroundColor: colors.cardBorder }]}
          >
            {!isMyTurn && gameState.gameStatus === "ACTIVE" ? (
              <Text style={[styles.turnTextActive, { color: colors.green }]}>
                Thinking...
              </Text>
            ) : (
              <Text
                style={[
                  styles.turnTextInactive,
                  { color: colors.textSecondary },
                ]}
              >
                {opponentColor}
              </Text>
            )}
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
            </View>
          </View>
          <View
            style={[styles.turnBadge, { backgroundColor: colors.cardBorder }]}
          >
            {isMyTurn && gameState.gameStatus === "ACTIVE" ? (
              <Text style={[styles.turnTextActive, { color: colors.green }]}>
                Your Turn
              </Text>
            ) : (
              <Text
                style={[
                  styles.turnTextInactive,
                  { color: colors.textSecondary },
                ]}
              >
                {gameState.playerColor}
              </Text>
            )}
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

      {gameState.gameStatus === "FINISHED" && (
        <View
          style={[
            styles.alertBanner,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <Text style={[styles.endTitle, { color: colors.textPrimary }]}>
            Game Ended ({gameState.endReason})
          </Text>
          <Text style={[styles.endSubtitle, { color: colors.green }]}>
            {gameState.winnerId
              ? gameState.winnerId === myId
                ? "🏆 Victory is yours!"
                : "💔 You were defeated."
              : "🤝 It's a Draw."}
          </Text>
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

      {/* Confetti Explosion Component */}
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
  turnBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  turnTextActive: {
    fontSize: 12,
    fontWeight: "600",
  },
  turnTextInactive: {
    fontSize: 12,
    fontWeight: "500",
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
  endTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  endSubtitle: {
    fontSize: 14,
    fontWeight: "600",
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
