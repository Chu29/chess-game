import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../constants/colors";
import { ComingSoonCard } from "../components/academy";

export function AICoachScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backRow}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.hero}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🧠</Text>
          </View>
          <Text style={styles.title}>AI Coach</Text>
          <Text style={styles.description}>
            Your AI Coach is available exclusively during Player vs Player games
            — a fair, optional edge to help you learn while you play.
          </Text>
        </View>

        <View style={styles.hintCard}>
          <Text style={styles.hintIcon}>💡</Text>
          <View style={styles.hintText}>
            <Text style={styles.hintTitle}>Get a Hint</Text>
            <Text style={styles.hintDescription}>
              Receive one suggested move during a PvP game whenever you're
              stuck.
            </Text>
          </View>
        </View>

        <Text style={styles.futureTitle}>Future Features</Text>

        <ComingSoonCard
          icon="🗣️"
          title="Move Explanations"
          description="Understand the reasoning behind every suggested move."
        />
        <ComingSoonCard
          icon="📊"
          title="Game Analysis"
          description="A full post-game breakdown of key moments and turning points."
        />
        <ComingSoonCard
          icon="🔍"
          title="Mistake Detection"
          description="Automatic flags on inaccuracies, mistakes, and blunders."
        />
        <ComingSoonCard
          icon="♟️"
          title="Strategy Recommendations"
          description="Personalized guidance based on your playing style."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: { minWidth: 44, minHeight: 44, justifyContent: "center" },
  backIcon: { color: colors.textPrimary, fontSize: 22 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 48 },
  hero: { alignItems: "center", marginBottom: 24 },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    backgroundColor: colors.accentMuted,
  },
  icon: { fontSize: 44 },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 21,
    color: colors.textSecondary,
  },
  hintCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  hintIcon: { fontSize: 22, marginRight: 12 },
  hintText: { flex: 1 },
  hintTitle: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 4,
  },
  hintDescription: { fontSize: 12, color: colors.textSecondary },
  futureTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
});
