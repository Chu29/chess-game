import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { ThemeSwitch } from "../../components/ThemeSwitch";
import { usersApi, UserStats, RecentGame } from "../../lib/usersApi";

function formatGameMeta(game: RecentGame) {
  const date = new Date(game.endedAt);
  const dateLabel = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const modeLabel = game.mode === "AI" ? "vs AI" : "Blitz";
  return `${dateLabel} · ${modeLabel}`;
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { colors } = useTheme();

  function resultColor(result: "WIN" | "LOSS" | "DRAW") {
    if (result === "WIN") return colors.win;
    if (result === "LOSS") return colors.loss;
    return colors.draw;
  }

  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProfileData = async () => {
      try {
        const [statsResult, gamesResult] = await Promise.all([
          usersApi.getStats(),
          usersApi.getRecentGames(5),
        ]);
        if (isMounted) {
          setStats(statsResult);
          setRecentGames(gamesResult);
        }
      } catch (err) {
        console.error("Failed to load profile data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadProfileData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[styles.avatarCircle, { backgroundColor: colors.greenDark }]}
        >
          <Ionicons name="person" size={40} color={colors.green} />
        </View>

        <Text style={[styles.name, { color: colors.textPrimary }]}>
          {user?.username ?? "Player"}
        </Text>

        <View
          style={[
            styles.ratingPill,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <Ionicons name="trophy" size={13} color={colors.green} />
          <Text
            style={[styles.ratingPillText, { color: colors.textSecondary }]}
          >
            {user?.rating ?? 0} ELO
          </Text>
        </View>

        <View
          style={[
            styles.totalCard,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
            TOTAL GAMES
          </Text>
          <Text style={[styles.totalValue, { color: colors.textPrimary }]}>
            {loading ? "—" : (stats?.gamesPlayed ?? 0).toLocaleString()}
          </Text>
        </View>

        <View style={styles.statGrid}>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <Text style={[styles.statValue, { color: colors.win }]}>
              {loading ? "—" : (stats?.wins ?? 0)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              WINS
            </Text>
          </View>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <Text style={[styles.statValue, { color: colors.loss }]}>
              {loading ? "—" : (stats?.losses ?? 0)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              LOSSES
            </Text>
          </View>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {loading ? "—" : (stats?.draws ?? 0)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              DRAWS
            </Text>
          </View>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <Text style={[styles.statValue, { color: colors.green }]}>
              {loading ? "—" : `${stats?.winRate ?? 0}%`}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              WIN RATE
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Recent Matches
          </Text>
          <Text style={[styles.viewAll, { color: colors.green }]}>
            View All
          </Text>
        </View>

        {!loading && recentGames.length === 0 && (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No games played yet.
          </Text>
        )}

        {recentGames.map((game) => (
          <View
            key={game.id}
            style={[
              styles.matchRow,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <View>
              <Text
                style={[styles.matchOpponent, { color: colors.textPrimary }]}
              >
                {game.opponent}
              </Text>
              <Text style={[styles.matchMeta, { color: colors.textSecondary }]}>
                {formatGameMeta(game)}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={[
                  styles.matchResult,
                  { color: resultColor(game.result) },
                ]}
              >
                {game.result}
              </Text>
              <Text style={[styles.matchElo, { color: colors.textSecondary }]}>
                —
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.settingsContainer}>
          <View
            style={[
              styles.settingsRow,
              { borderBottomColor: colors.cardBorder },
            ]}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={colors.textSecondary}
            />
            <Text style={[styles.settingsText, { color: colors.textPrimary }]}>
              Edit Profile
            </Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textSecondary}
            />
          </View>

          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colors.cardBorder,
            }}
          >
            <ThemeSwitch />
          </View>

          <Pressable style={styles.settingsRow} onPress={() => void logout()}>
            <Ionicons name="log-out-outline" size={18} color={colors.loss} />
            <Text style={[styles.settingsText, { color: colors.loss }]}>
              Logout
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40, alignItems: "center" },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  name: { fontSize: 20, fontWeight: "700" },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
    marginBottom: 20,
    gap: 5,
  },
  ratingPillText: { fontSize: 12, fontWeight: "600" },
  totalCard: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: { fontSize: 11, letterSpacing: 1, marginBottom: 4 },
  totalValue: { fontSize: 26, fontWeight: "700" },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flexBasis: "47%",
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },
  statValue: { fontSize: 20, fontWeight: "700" },
  statLabel: { fontSize: 10, letterSpacing: 1, marginTop: 4 },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 13, fontWeight: "600" },
  viewAll: { fontSize: 12, fontWeight: "600" },
  emptyText: { fontSize: 13, marginBottom: 10 },
  matchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  matchOpponent: { fontSize: 14, fontWeight: "600" },
  matchMeta: { fontSize: 12, marginTop: 2 },
  matchResult: { fontSize: 13, fontWeight: "700" },
  matchElo: { fontSize: 11, marginTop: 2 },
  settingsContainer: { width: "100%", marginTop: 14 },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 10,
  },
  settingsText: { flex: 1, fontSize: 14 },
});
