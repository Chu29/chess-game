// app/(tabs)/profile.tsx

import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { ThemeSwitch } from "../../components/ThemeSwitch";

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
  {
    id: "1",
    opponent: "Magnus_2O",
    meta: "Oct 12 · Blitz",
    result: "WIN" as const,
    eloChange: "+12",
  },
  {
    id: "2",
    opponent: "ChessMaster99",
    meta: "Oct 11 · Rapid",
    result: "LOSS" as const,
    eloChange: "-8",
  },
  {
    id: "3",
    opponent: "DeepThinking",
    meta: "Oct 10 · Rapid",
    result: "DRAW" as const,
    eloChange: "0",
  },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { colors } = useTheme();

  function resultColor(result: "WIN" | "LOSS" | "DRAW") {
    if (result === "WIN") return colors.win;
    if (result === "LOSS") return colors.loss;
    return colors.draw;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar + identity */}
        <View style={[styles.avatarCircle, { backgroundColor: colors.greenDark }]}>
          <Ionicons name="person" size={40} color={colors.green} />
        </View>
        <Text style={[styles.name, { color: colors.textPrimary }]}>
          {user?.username ?? mockProfile.name}
        </Text>
        
        <View
          style={[
            styles.ratingPill,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <Ionicons name="trophy" size={13} color={colors.green} />
          <Text style={[styles.ratingPillText, { color: colors.textSecondary }]}>
            {user?.rating ?? mockProfile.rating} ELO
          </Text>
        </View>

        {/* Total games */}
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
            {mockProfile.totalGames.toLocaleString()}
          </Text>
        </View>

        {/* Stat grid */}
        <View style={styles.statGrid}>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <Text style={[styles.statValue, { color: colors.win }]}>
              {mockProfile.wins}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>WINS</Text>
          </View>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <Text style={[styles.statValue, { color: colors.loss }]}>
              {mockProfile.losses}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>LOSSES</Text>
          </View>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {mockProfile.draws}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>DRAWS</Text>
          </View>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <Text style={[styles.statValue, { color: colors.green }]}>
              {mockProfile.winRate}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>WIN RATE</Text>
          </View>
        </View>

        {/* Recent matches */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Recent Matches
          </Text>
          <Text style={[styles.viewAll, { color: colors.green }]}>View All</Text>
        </View>
        
        {mockRecentMatches.map((match) => (
          <View
            key={match.id}
            style={[
              styles.matchRow,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <View>
              <Text style={[styles.matchOpponent, { color: colors.textPrimary }]}>
                {match.opponent}
              </Text>
              <Text style={[styles.matchMeta, { color: colors.textSecondary }]}>
                {match.meta}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={[
                  styles.matchResult,
                  { color: resultColor(match.result) },
                ]}
              >
                {match.result}
              </Text>
              <Text style={[styles.matchElo, { color: colors.textSecondary }]}>
                {match.eloChange} ELO
              </Text>
            </View>
          </View>
        ))}

        {/* Settings section */}
        <View style={styles.settingsContainer}>
          <View style={[styles.settingsRow, { borderBottomColor: colors.cardBorder }]}>
            <Ionicons name="create-outline" size={18} color={colors.textSecondary} />
            <Text style={[styles.settingsText, { color: colors.textPrimary }]}>
              Edit Profile
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </View>

          {/* Dynamic Theme Switch Row */}
          <View style={{ borderBottomWidth: 1, borderBottomColor: colors.cardBorder }}>
            <ThemeSwitch />
          </View>

          <Pressable
            style={styles.settingsRow}
            onPress={() => void logout()}
          >
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