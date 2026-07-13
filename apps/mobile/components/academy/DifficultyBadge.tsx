import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { difficultyColors } from "../../constants/colors";
import { Difficulty } from "../../types/academy";

interface Props {
  difficulty: Difficulty;
}

const labels: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function DifficultyBadge({ difficulty }: Props) {
  const color = difficultyColors[difficulty];
  return (
    <View
      style={[styles.badge, { backgroundColor: `${color}1F` }]}
      accessibilityRole="text"
      accessibilityLabel={`Difficulty: ${labels[difficulty]}`}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{labels[difficulty]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});
