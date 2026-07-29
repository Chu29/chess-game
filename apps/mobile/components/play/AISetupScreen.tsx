import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "../../context/ThemeContext";
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
  const { colors } = useTheme();
  const [difficulty, setDifficulty] = useState<AIDifficulty>("MEDIUM");
  const [playerColor, setPlayerColor] = useState<PlayerColor>("WHITE");

  const handleStartGame = () => {
    router.push({
      pathname: "/play/ai",
      params: { difficulty, playerColor },
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Play vs AI
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Select Difficulty
        </Text>

        <View style={styles.optionsList}>
          {DIFFICULTY_OPTIONS.map((opt) => {
            const isSelected = difficulty === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => setDifficulty(opt.key)}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: isSelected ? colors.green : colors.cardBorder,
                  },
                  isSelected && {
                    backgroundColor: `${colors.green}15`,
                  },
                ]}
              >
                <View style={styles.optionHeader}>
                  <View style={styles.labelRow}>
                    <Text
                      style={[
                        styles.optionLabel,
                        { color: colors.textPrimary },
                      ]}
                    >
                      {opt.label}
                    </Text>
                    <View
                      style={[
                        styles.eloBadge,
                        { backgroundColor: `${colors.green}20` },
                      ]}
                    >
                      <Text
                        style={[styles.eloBadgeText, { color: colors.green }]}
                      >
                        {opt.elo} ELO
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.radioCircle,
                      { borderColor: colors.textSecondary },
                      isSelected && { borderColor: colors.green },
                    ]}
                  >
                    {isSelected && (
                      <View
                        style={[
                          styles.radioInnerCircle,
                          { backgroundColor: colors.green },
                        ]}
                      />
                    )}
                  </View>
                </View>
                <Text
                  style={[
                    styles.optionDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {opt.description}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textPrimary, marginTop: 28 },
          ]}
        >
          Choose Your Side
        </Text>

        <View style={styles.colorSelectorRow}>
          <Pressable
            onPress={() => setPlayerColor("WHITE")}
            style={[
              styles.colorCard,
              {
                backgroundColor: colors.card,
                borderColor:
                  playerColor === "WHITE" ? colors.green : colors.cardBorder,
              },
              playerColor === "WHITE" && {
                backgroundColor: `${colors.green}15`,
              },
            ]}
          >
            <View style={[styles.pieceIconCircle, styles.whitePieceCircle]}>
              <MaterialCommunityIcons
                name="chess-king"
                size={32}
                color="#1C2418"
              />
            </View>
            <Text
              style={[styles.colorCardTitle, { color: colors.textPrimary }]}
            >
              White
            </Text>
            <Text
              style={[
                styles.colorCardSubtitle,
                { color: colors.textSecondary },
              ]}
            >
              Moves First
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setPlayerColor("BLACK")}
            style={[
              styles.colorCard,
              {
                backgroundColor: colors.card,
                borderColor:
                  playerColor === "BLACK" ? colors.green : colors.cardBorder,
              },
              playerColor === "BLACK" && {
                backgroundColor: `${colors.green}15`,
              },
            ]}
          >
            <View
              style={[
                styles.pieceIconCircle,
                styles.blackPieceCircle,
                { borderColor: colors.cardBorder },
              ]}
            >
              <MaterialCommunityIcons
                name="chess-king"
                size={32}
                color="#F2F4F0"
              />
            </View>
            <Text
              style={[styles.colorCardTitle, { color: colors.textPrimary }]}
            >
              Black
            </Text>
            <Text
              style={[
                styles.colorCardSubtitle,
                { color: colors.textSecondary },
              ]}
            >
              Moves Second
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Start Game Button */}
      <View style={[styles.footer, { borderTopColor: colors.cardBorder }]}>
        <Pressable
          onPress={handleStartGame}
          style={[styles.startButton, { backgroundColor: colors.green }]}
        >
          <Text style={styles.startButtonText}>Start Game</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  optionsList: {
    gap: 10,
  },
  optionCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
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
  },
  eloBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  eloBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionDescription: {
    fontSize: 13,
  },
  colorSelectorRow: {
    flexDirection: "row",
    gap: 12,
  },
  colorCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
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
  },
  colorCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  colorCardSubtitle: {
    fontSize: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  startButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
