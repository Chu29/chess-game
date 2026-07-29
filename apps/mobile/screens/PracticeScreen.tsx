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
import { useTheme } from "../context/ThemeContext";
import { practiceChallenges } from "../data/practiceChallenges";
import { ChallengeCard } from "../components/academy";
import { PracticeChallenge } from "../types/academy";

export function PracticeScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const handlePress = (challenge: PracticeChallenge) => {
    // Placeholder — wire up to the actual practice/puzzle engine later.
    console.log("Open challenge", challenge.id);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.backRow}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          style={styles.backButton}
        >
          <Text style={[styles.backIcon, { color: colors.textPrimary }]}>
            ‹
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Practice Challenges
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Sharpen your skills with hands-on puzzles.
        </Text>

        {practiceChallenges.map((challenge, i) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            index={i}
            onPress={handlePress}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: { minWidth: 44, minHeight: 44, justifyContent: "center" },
  backIcon: { fontSize: 22 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 48 },
  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: { fontSize: 14, marginBottom: 24 },
});
