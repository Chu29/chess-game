import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ionicons,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { usersApi, UserStats, UserRank, RecentGame } from "../../lib/usersApi";

function formatGameMeta(game: RecentGame) {
  const date = new Date(game.endedAt);
  const dateLabel = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const modeLabel = game.mode === "AI" ? "vs AI" : "Blitz";
  return `${dateLabel} · ${modeLabel}`;
}

function getResultColor(result: "WIN" | "LOSS" | "DRAW", colors: any) {
  if (result === "WIN") return colors.green;
  if (result === "LOSS") return "#D9534F";
  return colors.textSecondary;
}

export default function LobbyScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [stats, setStats] = useState<UserStats | null>(null);
  const [rank, setRank] = useState<UserRank | null>(null);
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadLobbyData = async () => {
      try {
        const [statsResult, rankResult, gamesResult] = await Promise.all([
          usersApi.getStats(),
          usersApi.getRank(),
          usersApi.getRecentGames(3),
        ]);
        if (isMounted) {
          setStats(statsResult);
          setRank(rankResult);
          setRecentGames(gamesResult);
        }
      } catch (err) {
        console.error("Failed to load lobby data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadLobbyData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[0]}
      >
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <View style={styles.headerSpacer} />
          <Text style={[styles.headerTitle, { color: colors.green }]}>
            Chuvinjab Chess
          </Text>
        </View>

        <View style={[styles.statsCardFull, { backgroundColor: colors.card }]}>
          <View>
            <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>
              CURRENT RANKING
            </Text>
            <Text style={[styles.statsValueLarge, { color: colors.green }]}>
              {loading ? "—" : `#${(rank?.rank ?? 0).toLocaleString()}`}
            </Text>
          </View>
          <View
            style={[
              styles.inlineIconCircle,
              { backgroundColor: colors.cardBorder },
            ]}
          >
            <Ionicons name="bar-chart" size={22} color={colors.green} />
          </View>
        </View>

        <View style={styles.rowGrid}>
          <View
            style={[
              styles.statsCardHalf,
              { backgroundColor: colors.card, marginRight: 8 },
            ]}
          >
            <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>
              WIN RATE
            </Text>
            <Text style={[styles.statsValueMedium, { color: colors.green }]}>
              {loading ? "—" : `${stats?.winRate ?? 0}%`}
            </Text>
          </View>
          <View
            style={[
              styles.statsCardHalf,
              { backgroundColor: colors.card, marginLeft: 8 },
            ]}
          >
            <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>
              GAMES
            </Text>
            <Text
              style={[styles.statsValueMedium, { color: colors.textPrimary }]}
            >
              {loading ? "—" : (stats?.gamesPlayed ?? 0)}
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Quick Start
        </Text>

        <Pressable
          style={[styles.mainPlayButton, { backgroundColor: colors.green }]}
          onPress={() => router.push("/play/matchmaking")}
        >
          <View style={styles.playButtonTextContainer}>
            <Ionicons
              name="flash"
              size={28}
              color="#1B3310"
              style={{ marginBottom: 12 }}
            />
            <Text style={styles.playButtonTitle}>Play Online</Text>
            <Text style={styles.playButtonSubtitle}>
              Find a match in seconds
            </Text>
          </View>
          <FontAwesome6
            name="earth-americas"
            size={120}
            color="rgba(0,0,0,0.06)"
            style={styles.bgWatermark}
          />
        </Pressable>

        <View style={styles.rowGrid}>
          <Pressable
            onPress={() => router.push("/play/ai")}
            style={[
              styles.actionCard,
              {
                backgroundColor: colors.card,
                borderColor: "#1A4F80",
                borderWidth: 1,
                marginRight: 8,
              },
            ]}
          >
            <MaterialCommunityIcons name="robot" size={24} color="#5B9BD5" />
            <Text
              style={[styles.actionCardTitle, { color: colors.textPrimary }]}
            >
              Versus AI
            </Text>
            <Text
              style={[
                styles.actionCardSubtitle,
                { color: colors.textSecondary },
              ]}
            >
              Practice skills
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(tabs)/learn")}
            style={[
              styles.actionCard,
              {
                backgroundColor: colors.card,
                borderColor: "#7A5B2B",
                borderWidth: 1,
                marginLeft: 8,
              },
            ]}
          >
            <FontAwesome6 name="graduation-cap" size={22} color="#DDAA55" />
            <Text
              style={[styles.actionCardTitle, { color: colors.textPrimary }]}
            >
              Learn
            </Text>
            <Text
              style={[
                styles.actionCardSubtitle,
                { color: colors.textSecondary },
              ]}
            >
              Daily puzzles
            </Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Recent Games
          </Text>
        </View>

        {!loading && recentGames.length === 0 && (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No games played yet.
          </Text>
        )}

        <View style={styles.gameHistoryList}>
          {recentGames.map((game) => {
            const outcomeColor = getResultColor(game.result, colors);
            return (
              <View
                key={game.id}
                style={[styles.gameRow, { backgroundColor: colors.card }]}
              >
                <View style={styles.gameRowLeft}>
                  <View
                    style={[
                      styles.chessPiecePlaceholder,
                      { backgroundColor: colors.cardBorder },
                    ]}
                  >
                    <FontAwesome6
                      name="chess-knight"
                      size={18}
                      color={colors.textSecondary}
                    />
                  </View>
                  <View style={styles.gameInfoText}>
                    <Text
                      style={[
                        styles.opponentName,
                        { color: colors.textPrimary },
                      ]}
                    >
                      {game.opponent}
                    </Text>
                    <Text
                      style={[
                        styles.gameDetails,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {formatGameMeta(game)}
                    </Text>
                  </View>
                </View>
                <View style={styles.gameRowRight}>
                  <View
                    style={[
                      styles.outcomeBadge,
                      { backgroundColor: `${outcomeColor}20` },
                    ]}
                  >
                    <Text style={[styles.outcomeText, { color: outcomeColor }]}>
                      {game.result}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.eloChangeText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    —
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  header: {
    alignItems: "center",
    paddingVertical: 12,
    position: "relative",
    top: 0,
    zIndex: 15,
  },
  headerSpacer: { width: 26 },
  headerTitle: {
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  statsCardFull: {
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  inlineIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  statsLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
  },
  statsValueLarge: { fontSize: 32, fontWeight: "800", marginTop: 4 },
  rowGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statsCardHalf: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
  },
  statsValueMedium: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  mainPlayButton: {
    borderRadius: 28,
    padding: 24,
    height: 160,
    justifyContent: "flex-end",
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
  },
  playButtonTextContainer: { zIndex: 2 },
  playButtonTitle: { color: "#1B3310", fontSize: 26, fontWeight: "800" },
  playButtonSubtitle: {
    color: "#1B3310",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
    opacity: 0.8,
  },
  bgWatermark: { position: "absolute", right: -10, bottom: -10 },
  actionCard: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    height: 140,
    justifyContent: "flex-end",
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 14,
  },
  actionCardSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  emptyText: { fontSize: 13, marginTop: 4 },
  gameHistoryList: { marginTop: 12 },
  gameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 20,
    marginBottom: 12,
  },
  gameRowLeft: { flexDirection: "row", alignItems: "center" },
  chessPiecePlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  gameInfoText: { marginLeft: 12 },
  opponentName: { fontSize: 15, fontWeight: "600" },
  gameDetails: { fontSize: 12, marginTop: 2 },
  gameRowRight: { alignItems: "flex-end" },
  outcomeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  outcomeText: { fontSize: 11, fontWeight: "800" },
  eloChangeText: { fontSize: 11, marginTop: 4 },
});