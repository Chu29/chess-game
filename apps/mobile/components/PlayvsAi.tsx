import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ChessBoard from "./game/ChessBoard";
import { useTheme } from "../context/ThemeContext";

export default function GameScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  // FEN representing starting board state
  const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

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
        <Text style={[styles.headerTitle, { color: colors.green }]}>
          Chuvinjab Chess
        </Text>
      </View>

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
                  color={colors.textSecondary}
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
                Magnus_Bot
              </Text>
              <View style={styles.ratingRow}>
                <Text
                  style={[styles.ratingText, { color: colors.textSecondary }]}
                >
                  2840
                </Text>
                <Ionicons
                  name="people-outline"
                  size={14}
                  color={colors.textSecondary}
                  style={{ marginLeft: 6 }}
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
              08:42
            </Text>
          </View>
        </View>

        {/* Chessboard wrapper */}
        <View style={styles.boardWrapper}>
          <ChessBoard fen={fen} playerColor="WHITE" />
        </View>

        {/* Player Box */}
        <View
          style={[
            styles.playerCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
            },
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
                <Ionicons name="person" size={22} color={colors.green} />
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
                style={[
                  styles.playerSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                (GM_Chuvinjab)
              </Text>
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.ratingBadge,
                    { backgroundColor: colors.green + "1A" },
                  ]}
                >
                  <Text style={[styles.ratingBadgeText, { color: colors.green }]}>
                    1200
                  </Text>
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
          <View
            style={[
              styles.clockContainer,
              styles.playerClock,
              {
                backgroundColor: colors.cardBorder,
                borderColor: colors.green + "40",
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
          <Pressable
            style={[
              styles.actionBtn,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <Ionicons name="swap-vertical" size={20} color={colors.textPrimary} />
            <Text
              style={[styles.actionBtnText, { color: colors.textPrimary }]}
            >
              Flip
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.actionBtn,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
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
            style={[
              styles.actionBtn,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <Ionicons
              name="settings-outline"
              size={20}
              color={colors.textPrimary}
            />
            <Text
              style={[styles.actionBtnText, { color: colors.textPrimary }]}
            >
              Menu
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.actionBtn,
              styles.resignBtn,
              { backgroundColor: colors.loss },
            ]}
          >
            <Ionicons name="flag" size={18} color="#FFFFFF" />
            <Text style={[styles.actionBtnText, { color: "#FFFFFF" }]}>
              Resign
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 100,
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
  actionBtnText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});