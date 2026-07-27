import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { OptionCard } from "../components/play/OptionCard";

export function PlayScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.green }]}>
          Chuvinjab Chess
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.heading, { color: colors.textPrimary }]}>
          Ready to play?
        </Text>
        <Text style={[styles.subheading, { color: colors.textSecondary }]}>
          Choose how you'd like to start your next game.
        </Text>

        <OptionCard
          icon="hardware-chip-outline"
          title="Play vs AI"
          description="Practice anytime against a computer opponent. No waiting, no pressure."
          ctaLabel="Start Game"
          accent
          onPress={() => router.push("/play/ai-setup")}
        />

        <OptionCard
          icon="people-outline"
          title="Play Online"
          description="Get matched with another player in real time and test your rating."
          ctaLabel="Find Match"
          onPress={() => router.push("/play/matchmaking")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    marginBottom: 24,
  },
});