import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { usersApi, UserStats, UserRank, RecentGame } from "../../lib/uersApi"; 

const colors = {
  background: "#121210",
  surface: "#1E1E1C",
  surfaceLight: "#2A2A28",
  green: "#7BC657",
  greenDark: "#24381D",
  textPrimary: "#FFFFFF",
  textSecondary: "#8A8A85",
};

const RESULT_COLOR: Record<"WIN" | "LOSS" | "DRAW", string> = {
  WIN: colors.green,
  LOSS: "#D9534F",
  DRAW: colors.textSecondary,
};

function formatGameMeta(game: RecentGame) {
  const date = new Date(game.endedAt);
  const dateLabel = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const modeLabel = game.mode === "AI" ? "vs AI" : "Blitz";
  return `${dateLabel} · ${modeLabel}`;
}

export default function LobbyScreen() {
  const router = useRouter();

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
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[0]}
      >
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Chuvinjab Chess</Text>
        </View>

        <View style={styles.statsCardFull}>
          <View>
            <Text style={styles.statsLabel}>CURRENT RANKING</Text>
            <Text style={[styles.statsValueLarge, { color: colors.green }]}>
              {loading ? "—" : `#${(rank?.rank ?? 0).toLocaleString()}`}
            </Text>
          </View>
          <View style={[styles.inlineIconCircle, { backgroundColor: "#252B22" }]}>
            <Ionicons name="bar-chart" size={22} color={colors.green} />
          </View>
        </View>

        <View style={styles.rowGrid}>
          <View style={[styles.statsCardHalf, { marginRight: 8 }]}>
            <Text style={styles.statsLabel}>WIN RATE</Text>
            <Text style={[styles.statsValueMedium, { color: colors.green }]}>
              {loading ? "—" : `${stats?.winRate ?? 0}%`}
            </Text>
          </View>
          <View style={[styles.statsCardHalf, { marginLeft: 8 }]}>
            <Text style={styles.statsLabel}>GAMES</Text>
            <Text style={styles.statsValueMedium}>
              {loading ? "—" : (stats?.gamesPlayed ?? 0)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Start</Text>

        <Pressable
          style={styles.mainPlayButton}
          onPress={() => router.push("/play/matchmaking")}
        >
          <View style={styles.playButtonTextContainer}>
            <Ionicons name="flash" size={28} color={colors.greenDark} style={{ marginBottom: 12 }} />
            <Text style={styles.playButtonTitle}>Play Online</Text>
            <Text style={styles.playButtonSubtitle}>Find a match in seconds</Text>
          </View>
          <FontAwesome6
            name="earth-americas"
            size={120}
            color="rgba(0,0,0,0.04)"
            style={styles.bgWatermark}
          />
        </Pressable>

        <View style={styles.rowGrid}>
          <Pressable
            onPress={() => router.push("/play/ai-setup")}
            style={[
              styles.actionCard,
              { borderColor: "#1A4F80", borderWidth: 1, marginRight: 8 },
            ]}
          >
            <MaterialCommunityIcons name="robot" size={24} color="#5B9BD5" />
            <Text style={styles.actionCardTitle}>Versus AI</Text>
            <Text style={styles.actionCardSubtitle}>Practice skills</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(tabs)/learn")}
            style={[styles.actionCard, { borderColor: "#7A5B2B", borderWidth: 1, marginLeft: 8 }]}
          >
            <FontAwesome6 name="graduation-cap" size={22} color="#DDAA55" />
            <Text style={styles.actionCardTitle}>Learn</Text>
            <Text style={styles.actionCardSubtitle}>Daily puzzles</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Games</Text>
        </View>

        {!loading && recentGames.length === 0 && (
          <Text style={styles.emptyText}>No games played yet.</Text>
        )}

        <View style={styles.gameHistoryList}>
          {recentGames.map((game) => (
            <View key={game.id} style={styles.gameRow}>
              <View style={styles.gameRowLeft}>
                <View style={styles.chessPiecePlaceholder}>
                  <FontAwesome6 name="chess-knight" size={18} color={colors.textSecondary} />
                </View>
                <View style={styles.gameInfoText}>
                  <Text style={styles.opponentName}>{game.opponent}</Text>
                  <Text style={styles.gameDetails}>{formatGameMeta(game)}</Text>
                </View>
              </View>
              <View style={styles.gameRowRight}>
                <View
                  style={[
                    styles.outcomeBadge,
                    { backgroundColor: `${RESULT_COLOR[game.result]}20` },
                  ]}
                >
                  <Text style={[styles.outcomeText, { color: RESULT_COLOR[game.result] }]}>
                    {game.result}
                  </Text>
                </View>
                <Text style={styles.eloChangeText}>—</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  header: {
    alignItems: "center",
    paddingVertical: 12,
    position: "relative",
    top: 0,
    zIndex: 15,
    backgroundColor: colors.background,
  },
  headerSpacer: { width: 26 },
  headerIcon: { padding: 4 },
  headerTitle: { fontSize: 19, fontWeight: "800", color: colors.green, letterSpacing: 0.5 },
  statsCardFull: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  inlineIconCircle: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  statsLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: "600", letterSpacing: 1 },
  statsValueLarge: { fontSize: 32, fontWeight: "800", marginTop: 4 },
  rowGrid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  statsCardHalf: { flex: 1, backgroundColor: colors.surface, borderRadius: 24, padding: 20 },
  statsValueMedium: { color: colors.textPrimary, fontSize: 28, fontWeight: "700", marginTop: 4 },
  sectionTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: "700", marginBottom: 16 },
  mainPlayButton: {
    backgroundColor: colors.green,
    borderRadius: 28,
    padding: 24,
    height: 160,
    justifyContent: "flex-end",
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
  },
  playButtonTextContainer: { zIndex: 2 },
  playButtonTitle: { color: colors.greenDark, fontSize: 26, fontWeight: "800" },
  playButtonSubtitle: { color: colors.greenDark, fontSize: 13, fontWeight: "500", marginTop: 2, opacity: 0.8 },
  bgWatermark: { position: "absolute", right: -10, bottom: -10, opacity: 0.15 },
  actionCard: { flex: 1, backgroundColor: colors.surface, borderRadius: 24, padding: 20, height: 140, justifyContent: "flex-end" },
  actionCardTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: "700", marginTop: 14 },
  actionCardSubtitle: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  emptyText: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  gameHistoryList: { marginTop: 12 },
  gameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 20,
    marginBottom: 12,
  },
  gameRowLeft: { flexDirection: "row", alignItems: "center" },
  chessPiecePlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  gameInfoText: { marginLeft: 12 },
  opponentName: { color: colors.textPrimary, fontSize: 15, fontWeight: "600" },
  gameDetails: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  gameRowRight: { alignItems: "flex-end" },
  outcomeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  outcomeText: { fontSize: 11, fontWeight: "800" },
  eloChangeText: { color: colors.textSecondary, fontSize: 11, marginTop: 4 },
});