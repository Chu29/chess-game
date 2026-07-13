import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { PracticeChallenge } from "../../types/academy";
import { colors } from "../../constants/colors";
import { DifficultyBadge } from "./DifficultyBadge";
import { ProgressCard } from "./ProgressCard";

interface Props {
  challenge: PracticeChallenge;
  index?: number;
  onPress: (challenge: PracticeChallenge) => void;
}

export function ChallengeCard({ challenge, index = 0, onPress }: Props) {
  const locked = challenge.state === "locked";

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
      <Pressable
        onPress={() => !locked && onPress(challenge)}
        disabled={locked}
        accessibilityRole="button"
        accessibilityState={{ disabled: locked }}
        accessibilityLabel={`${challenge.title}, ${locked ? "locked" : `${challenge.progress} percent complete`}`}
        style={[styles.card, locked && styles.cardLocked]}
      >
        <View style={styles.topRow}>
          <Text style={styles.title}>{challenge.title}</Text>
          {locked ? (
            <Text style={styles.stateIcon}>🔒</Text>
          ) : challenge.state === "completed" ? (
            <Text style={[styles.stateIcon, { color: colors.success }]}>✓</Text>
          ) : null}
        </View>

        <Text style={styles.description}>{challenge.description}</Text>

        <View style={styles.metaRow}>
          <DifficultyBadge difficulty={challenge.difficulty} />
          <Text style={styles.time}>{challenge.estimatedMinutes} min</Text>
        </View>

        {!locked && <ProgressCard progress={challenge.progress} />}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    minHeight: 44,
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  cardLocked: {
    opacity: 0.55,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    paddingRight: 8,
  },
  stateIcon: {
    fontSize: 16,
  },
  description: {
    fontSize: 12,
    marginBottom: 12,
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  time: {
    fontSize: 12,
    color: colors.textTertiary,
  },
});
