// screens/ChessAcademyScreen.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { pieces } from "../data/pieces";
import { rules } from "../data/rules";
import { AcademySection, PieceCard, RuleCard } from "../components/academy";
import { ChessPiece, ChessRule } from "../types/academy";

export function ChessAcademyScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const goToPiece = (piece: ChessPiece) =>
    router.push(`/academy/piece/${piece.id}`);
  const goToRule = (rule: ChessRule) => router.push(`/academy/rule/${rule.id}`);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AcademySection
        title="Learn the Pieces"
        subtitle="Master how each piece moves and thinks"
      >
        <View style={styles.grid}>
          {pieces.map((piece, i) => (
            <PieceCard
              key={piece.id}
              piece={piece}
              index={i}
              onPress={goToPiece}
            />
          ))}
        </View>
      </AcademySection>

      <AcademySection
        title="Learn the Rules"
        subtitle="The situations every player must recognize"
      >
        <View style={styles.listPadding}>
          {rules.map((rule, i) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              index={i}
              onPress={goToRule}
            />
          ))}
        </View>
      </AcademySection>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 8 },
  listPadding: { paddingHorizontal: 16 },
});