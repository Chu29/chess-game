import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { colors } from "../../constants/theme";
import { AIDifficulty, PlayerColor } from "../../lib/api";

interface DifficultyOption {
  key: AIDifficulty;
  label: string;
  elo: number;
  description: string;
  badgeColor?: string;
}

const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  {
    key: "EASY",
    label: "Beginner",
    elo: 800,
    description: "Relaxed game for learning",
  },
  {
    key: "MEDIUM",
    label: "Intermediate",
    elo: 1500,
    description: "A balanced challenge",
  },
  {
    key: "HARD",
    label: "Expert",
    elo: 2500,
    description: "Near-grandmaster level AI",
  },
];

export default function AISetupScreen() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<AIDifficulty>("MEDIUM");
  const [playerColor, setPlayerColor] = useState<PlayerColor>("WHITE");

  const handleStartGame = () => {
    router.push({
      pathname: "/play/ai",
      params: { difficulty, playerColor },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Play vs AI</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Select Difficulty</Text>

        <View style={styles.optionsList}>
          {DIFFICULTY_OPTIONS.map((opt) => {
            const isSelected = difficulty === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => setDifficulty(opt.key)}
                style={[
                  styles.optionCard,
                  isSelected && styles.selectedOptionCard,
                ]}
              >
                <View style={styles.optionHeader}>
                  <View style={styles.labelRow}>
                    <Text style={styles.optionLabel}>{opt.label}</Text>
                    <View style={styles.eloBadge}>
                      <Text style={styles.eloBadgeText}>{opt.elo} ELO</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInnerCircle} />}
                  </View>
                </View>
                <Text style={styles.optionDescription}>{opt.description}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>
          Choose Your Side
        </Text>

        <View style={styles.colorSelectorRow}>
          <Pressable
            onPress={() => setPlayerColor("WHITE")}
            style={[
              styles.colorCard,
              playerColor === "WHITE" && styles.selectedColorCard,
            ]}
          >
            <View style={[styles.pieceIconCircle, styles.whitePieceCircle]}>
              <MaterialCommunityIcons
                name="chess-king"
                size={32}
                color="#1C2418"
              />
            </View>
            <Text style={styles.colorCardTitle}>White</Text>
            <Text style={styles.colorCardSubtitle}>Moves First</Text>
          </Pressable>

          <Pressable
            onPress={() => setPlayerColor("BLACK")}
            style={[
              styles.colorCard,
              playerColor === "BLACK" && styles.selectedColorCard,
            ]}
          >
            <View style={[styles.pieceIconCircle, styles.blackPieceCircle]}>
              <MaterialCommunityIcons
                name="chess-king"
                size={32}
                color="#F2F4F0"
              />
            </View>
            <Text style={styles.colorCardTitle}>Black</Text>
            <Text style={styles.colorCardSubtitle}>Moves Second</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Start Game Button */}
      <View style={styles.footer}>
        <Pressable onPress={handleStartGame} style={styles.startButton}>
          <Text style={styles.startButtonText}>Start Game</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.white,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 12,
  },
  optionsList: {
    gap: 10,
  },
  optionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  selectedOptionCard: {
    borderColor: colors.green,
    backgroundColor: colors.greenDark,
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
  },
  eloBadge: {
    backgroundColor: colors.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  eloBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.green,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    borderColor: colors.green,
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.green,
  },
  optionDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  colorSelectorRow: {
    flexDirection: "row",
    gap: 12,
  },
  colorCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  selectedColorCard: {
    borderColor: colors.green,
    backgroundColor: colors.greenDark,
  },
  pieceIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  whitePieceCircle: {
    backgroundColor: "#F2F4F0",
  },
  blackPieceCircle: {
    backgroundColor: "#161B17",
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  colorCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 2,
  },
  colorCardSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  startButton: {
    backgroundColor: colors.green,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
