import React from "react";
import { View, Text, ScrollView, SafeAreaView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../constants/colors";
import { pieces } from "../data/pieces";
import { rules } from "../data/rules";
import { AcademySection, PieceCard, RuleCard } from "../components/academy";
import { ChessPiece, ChessRule } from "../types/academy";

export function ChessAcademyScreen() {
  const router = useRouter();

  const goToPiece = (piece: ChessPiece) =>
    router.push(`/academy/piece/${piece.id}`);
  const goToRule = (rule: ChessRule) => router.push(`/academy/rule/${rule.id}`);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingTop: 8, paddingBottom: 40 },
  headerBlock: { paddingHorizontal: 16, marginBottom: 24 },
  headerTitle: { fontSize: 30, fontWeight: "800", color: colors.textPrimary },
  headerSubtitle: { fontSize: 14, marginTop: 4, color: colors.textSecondary },
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 8 },
  listPadding: { paddingHorizontal: 16 },
});
