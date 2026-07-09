import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { colors } from "../../constants/theme";
import ChessBoard from "../../components/game/ChessBoard";

export default function GameScreen() {
  const router = useRouter();

  // FEN representing starting board state
  const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace("/(tabs)")}
          style={styles.headerIcon}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Chuvinjab Chess</Text>
        <Pressable style={styles.headerIcon}>
          <Ionicons name="settings" size={22} color={colors.green} />
        </Pressable>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {/* Opponent Box */}
        <View style={styles.playerCard}>
          <View style={styles.playerInfoRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons
                  name="person"
                  size={22}
                  color={colors.textSecondary}
                />
              </View>
              <View style={styles.statusDot} />
            </View>
            <View style={styles.nameColumn}>
              <Text style={styles.playerName}>Magnus_Bot</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingText}>2840</Text>
                <Ionicons
                  name="people-outline"
                  size={14}
                  color={colors.textSecondary}
                  style={{ marginLeft: 6 }}
                />
              </View>
            </View>
          </View>
          <View style={styles.clockContainer}>
            <Text style={styles.clockText}>08:42</Text>
          </View>
        </View>

        {/* Chessboard wrapper */}
        <View style={styles.boardWrapper}>
          <ChessBoard fen={fen} playerColor="WHITE" />
        </View>

        {/* Player Box */}
        <View style={styles.playerCard}>
          <View style={styles.playerInfoRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={22} color={colors.green} />
              </View>
              <View style={styles.statusDot} />
            </View>
            <View style={styles.nameColumn}>
              <Text style={styles.playerName}>You</Text>
              <Text style={styles.playerSubtitle}>(GM_Chuvinjab)</Text>
              <View style={styles.badgeRow}>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingBadgeText}>1200</Text>
                </View>
                <Ionicons
                  name="people-outline"
                  size={14}
                  color={colors.textSecondary}
                  style={{ marginLeft: 6 }}
                />
              </View>
            </View>
          </View>
          <View style={[styles.clockContainer, styles.playerClock]}>
            <Text style={[styles.clockText, { color: colors.green }]}>
              00:00
            </Text>
          </View>
        </View>

        {/* Bottom Actions Row */}
        <View style={styles.actionsRow}>
          <Pressable style={styles.actionBtn}>
            <Ionicons name="swap-vertical" size={20} color={colors.white} />
            <Text style={styles.actionBtnText}>Flip</Text>
          </Pressable>

          <Pressable style={styles.actionBtn}>
            <MaterialCommunityIcons
              name="handshake-outline"
              size={22}
              color={colors.white}
            />
            <Text style={styles.actionBtnText}>Draw</Text>
          </Pressable>

          <Pressable style={styles.actionBtn}>
            <Ionicons name="settings-outline" size={20} color={colors.white} />
            <Text style={styles.actionBtnText}>Menu</Text>
          </Pressable>

          <Pressable style={[styles.actionBtn, styles.resignBtn]}>
            <Ionicons name="flag" size={18} color={colors.white} />
            <Text style={styles.actionBtnText}>Resign</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerIcon: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: colors.green,
    letterSpacing: 0.5,
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
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
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
    backgroundColor: colors.cardBorder,
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
    backgroundColor: colors.green,
    borderWidth: 1.5,
    borderColor: colors.card,
  },
  nameColumn: {
    justifyContent: "center",
  },
  playerName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.white,
  },
  playerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingBadge: {
    backgroundColor: colors.greenDark,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingBadgeText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: "700",
  },
  clockContainer: {
    backgroundColor: "#202521",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  playerClock: {
    borderColor: "rgba(143, 194, 74, 0.2)",
    borderWidth: 1,
  },
  clockText: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.white,
    fontFamily: "monospace",
  },
  boardWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  resignBtn: {
    backgroundColor: colors.loss,
    borderColor: "transparent",
  },
  actionBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});
