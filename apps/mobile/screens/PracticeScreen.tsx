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
import { practiceChallenges } from "../data/practiceChallenges";
import { ChallengeCard } from "../components/academy";
import { PracticeChallenge } from "../types/academy";

export function PracticeScreen() {
  const router = useRouter();

  const handlePress = (challenge: PracticeChallenge) => {
    // Placeholder — wire up to the actual practice/puzzle engine later.
    console.log("Open challenge", challenge.id);
  };

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
        <Text style={styles.title}>Practice Challenges</Text>
        <Text style={styles.subtitle}>
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
  title: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: { fontSize: 14, marginBottom: 24, color: colors.textSecondary },
});
