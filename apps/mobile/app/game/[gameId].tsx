import React from "react";
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
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../constants/theme";

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
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color={colors.green} size="large" />
        <Text style={styles.loadingText}>Connecting to game...</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={colors.white}
          />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>
            {gameState.whiteUsername} vs {gameState.blackUsername}
          </Text>
          <Text style={styles.gameIdText}>
            Game ID: {params.gameId.slice(0, 8)}
          </Text>
        </View>
        <View style={styles.connectionBadge}>
          <View
            style={[
              styles.connectionDot,
              { backgroundColor: isConnected ? colors.green : colors.loss },
            ]}
          />
          <Text style={styles.connectionText}>
            {isConnected ? "Live" : "Reconnecting"}
          </Text>
        </View>
      </View>

      {/* Error Alert */}
      {error && (
        <View style={styles.errorAlert}>
          <Text style={styles.errorAlertText}>{error}</Text>
          <Pressable onPress={clearError} style={styles.errorClose}>
            <MaterialCommunityIcons
              name="close"
              size={16}
              color={colors.white}
            />
          </Pressable>
        </View>
      )}

      {/* Content wrapper */}
      <View style={styles.content}>
        {/* Opponent Card */}
        <View
          style={[
            styles.playerCard,
            !isMyTurn &&
              gameState.gameStatus === "ACTIVE" &&
              styles.activePlayerCard,
          ]}
        >
          <View style={styles.playerInfo}>
            <MaterialCommunityIcons
              name="account"
              size={24}
              color={
                opponentColor === "WHITE" ? colors.white : colors.textSecondary
              }
            />
            <View style={styles.playerNameContainer}>
              <Text style={styles.playerName}>{opponentUsername}</Text>
              <Text style={styles.playerMeta}>
                ID: {opponentId.slice(0, 8)}
              </Text>
            </View>
          </View>
          <View style={styles.turnBadge}>
            {!isMyTurn && gameState.gameStatus === "ACTIVE" ? (
              <Text style={styles.turnTextActive}>Thinking...</Text>
            ) : (
              <Text style={styles.turnTextInactive}>{opponentColor}</Text>
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
            isMyTurn &&
              gameState.gameStatus === "ACTIVE" &&
              styles.activePlayerCard,
          ]}
        >
          <View style={styles.playerInfo}>
            <MaterialCommunityIcons
              name="account"
              size={24}
              color={isWhite ? colors.white : colors.textSecondary}
            />
            <View style={styles.playerNameContainer}>
              <Text style={styles.playerName}>
                {user?.username ||
                  `Player ${gameState.playerColor?.toLowerCase()}`}{" "}
                (You)
              </Text>
              <Text style={styles.playerMeta}>ID: {myId?.slice(0, 8)}</Text>
            </View>
          </View>
          <View style={styles.turnBadge}>
            {isMyTurn && gameState.gameStatus === "ACTIVE" ? (
              <Text style={styles.turnTextActive}>Your Turn</Text>
            ) : (
              <Text style={styles.turnTextInactive}>
                {gameState.playerColor}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Draw Offers & Ends Alert */}
      {gameState.gameStatus === "ACTIVE" && gameState.drawOfferedBy && (
        <View style={styles.alertBanner}>
          {gameState.drawOfferedBy === myId ? (
            <Text style={styles.alertText}>
              Draw offer sent. Waiting for response...
            </Text>
          ) : (
            <View style={styles.alertActionsRow}>
              <Text style={styles.alertText}>Opponent offered a draw.</Text>
              <View style={styles.actionButtons}>
                <Pressable
                  onPress={acceptDraw}
                  style={[styles.smallBtn, { backgroundColor: colors.green }]}
                >
                  <Text style={styles.smallBtnText}>Accept</Text>
                </Pressable>
                <Pressable
                  onPress={declineDraw}
                  style={[styles.smallBtn, { backgroundColor: colors.loss }]}
                >
                  <Text style={styles.smallBtnText}>Decline</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      )}

      {gameState.gameStatus === "FINISHED" && (
        <View style={styles.alertBanner}>
          <Text style={styles.endTitle}>
            Game Ended ({gameState.endReason})
          </Text>
          <Text style={styles.endSubtitle}>
            {gameState.winnerId
              ? gameState.winnerId === myId
                ? "🏆 Victory is yours!"
                : "💔 You were defeated."
              : "🤝 It's a Draw."}
          </Text>
        </View>
      )}

      {/* Footer Controls */}
      <View style={styles.footer}>
        {gameState.gameStatus === "ACTIVE" ? (
          <View style={styles.actionRow}>
            <Pressable
              onPress={offerDraw}
              disabled={!!gameState.drawOfferedBy}
              style={[
                styles.actionBtn,
                styles.drawBtn,
                !!gameState.drawOfferedBy && styles.disabledBtn,
              ]}
            >
              <MaterialCommunityIcons
                name="handshake"
                size={20}
                color={colors.white}
              />
              <Text style={styles.actionBtnText}>Offer Draw</Text>
            </Pressable>

            <Pressable
              onPress={resign}
              style={[styles.actionBtn, styles.resignBtn]}
            >
              <MaterialCommunityIcons
                name="flag"
                size={20}
                color={colors.white}
              />
              <Text style={styles.actionBtnText}>Resign</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={() => router.replace("/(tabs)")}
            style={styles.lobbyBtn}
          >
            <Text style={styles.actionBtnText}>Back to Lobby</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: colors.textSecondary,
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
    borderBottomColor: colors.cardBorder,
  },
  backButton: {
    padding: 4,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  gameIdText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  connectionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  connectionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "500",
  },
  errorAlert: {
    backgroundColor: colors.loss,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  errorAlertText: {
    color: colors.white,
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
    backgroundColor: colors.card,
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  activePlayerCard: {
    borderColor: colors.green,
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  playerNameContainer: {
    marginLeft: 10,
  },
  playerName: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  playerMeta: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  turnBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: colors.background,
  },
  turnTextActive: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "600",
  },
  turnTextInactive: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  boardWrapper: {
    alignSelf: "center",
    marginVertical: 12,
  },
  alertBanner: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: "center",
    marginBottom: 16,
  },
  alertText: {
    color: colors.white,
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
    borderRadius: 4,
    marginLeft: 8,
  },
  smallBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "bold",
  },
  endTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  endSubtitle: {
    color: colors.green,
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
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
    borderRadius: 8,
    flex: 0.48,
  },
  drawBtn: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  resignBtn: {
    backgroundColor: colors.loss + "CC", // slight transparency
  },
  primaryBtn: {
    backgroundColor: colors.green,
    flex: 1,
  },
  lobbyBtn: {
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  actionBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
