import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../constants/theme";

const mockProfile = {
  name: "Grandmaster-K",
  rating: 1848,
  totalGames: 1402,
  wins: 842,
  losses: 410,
  draws: 150,
  winRate: 60.1,
};

const mockRecentMatches = [
  { id: "1", opponent: "Magnus_2O", meta: "Oct 12 · Blitz", result: "WIN" as const, eloChange: "+12" },
  { id: "2", opponent: "ChessMaster99", meta: "Oct 11 · Rapid", result: "LOSS" as const, eloChange: "-8" },
  { id: "3", opponent: "DeepThinking", meta: "Oct 10 · Rapid", result: "DRAW" as const, eloChange: "0" },
];

function resultColor(result: "WIN" | "LOSS" | "DRAW") {
  if (result === "WIN") return colors.win;
  if (result === "LOSS") return colors.loss;
  return colors.draw;
}

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar + identity */}
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={40} color={colors.green} />
        </View>
        <Text style={styles.name}>{mockProfile.name}</Text>
        <View style={styles.ratingPill}>
          <Ionicons name="trophy" size={13} color={colors.green} />
          <Text style={styles.ratingPillText}>{mockProfile.rating} ELO</Text>
        </View>

        {/* Total games */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>TOTAL GAMES</Text>
          <Text style={styles.totalValue}>{mockProfile.totalGames.toLocaleString()}</Text>
        </View>

        {/* Stat grid */}
        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.win }]}>{mockProfile.wins}</Text>
            <Text style={styles.statLabel}>WINS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.loss }]}>{mockProfile.losses}</Text>
            <Text style={styles.statLabel}>LOSSES</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{mockProfile.draws}</Text>
            <Text style={styles.statLabel}>DRAWS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.green }]}>{mockProfile.winRate}%</Text>
            <Text style={styles.statLabel}>WIN RATE</Text>
          </View>
        </View>

        {/* Rating history — placeholder chart area, real chart comes later */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Rating History</Text>
          <Text style={styles.sectionMeta}>Last 30 Days</Text>
        </View>
        <View style={styles.chartPlaceholder}>
          <Ionicons name="trending-up" size={28} color={colors.green} />
          <Text style={styles.chartPlaceholderText}>Chart coming soon</Text>
        </View>

        {/* Recent matches */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Matches</Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>
        {mockRecentMatches.map((match) => (
          <View key={match.id} style={styles.matchRow}>
            <View>
              <Text style={styles.matchOpponent}>{match.opponent}</Text>
              <Text style={styles.matchMeta}>{match.meta}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={[styles.matchResult, { color: resultColor(match.result) }]}>
                {match.result}
              </Text>
              <Text style={styles.matchElo}>{match.eloChange} ELO</Text>
            </View>
          </View>
        ))}

        {/* Settings row */}
        <View style={{ marginTop: 24 }}>
          <View style={styles.settingsRow}>
            <Ionicons name="create-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.settingsText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </View>
          <View style={styles.settingsRow}>
            <Ionicons name="color-palette-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.settingsText}>Theme</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </View>
          <View style={[styles.settingsRow, { borderBottomWidth: 0 }]}>
            <Ionicons name="log-out-outline" size={18} color={colors.loss} />
            <Text style={[styles.settingsText, { color: colors.loss }]}>Logout</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40, alignItems: "center" },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.greenDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  name: { color: colors.white, fontSize: 20, fontWeight: "700" },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
    marginBottom: 20,
    gap: 5,
  },
  ratingPillText: { color: colors.textSecondary, fontSize: 12, fontWeight: "600" },
  totalCard: {
    width: "100%",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: { color: colors.textSecondary, fontSize: 11, letterSpacing: 1, marginBottom: 4 },
  totalValue: { color: colors.white, fontSize: 26, fontWeight: "700" },
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
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },
  statValue: { color: colors.white, fontSize: 20, fontWeight: "700" },
  statLabel: { color: colors.textSecondary, fontSize: 10, letterSpacing: 1, marginTop: 4 },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  sectionTitle: { color: colors.textSecondary, fontSize: 13, fontWeight: "600" },
  sectionMeta: { color: colors.textSecondary, fontSize: 11 },
  viewAll: { color: colors.green, fontSize: 12, fontWeight: "600" },
  chartPlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 6,
  },
  chartPlaceholderText: { color: colors.textSecondary, fontSize: 12 },
  matchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  matchOpponent: { color: colors.white, fontSize: 14, fontWeight: "600" },
  matchMeta: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  matchResult: { fontSize: 13, fontWeight: "700" },
  matchElo: { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    gap: 10,
  },
  settingsText: { flex: 1, color: colors.white, fontSize: 14 },
});