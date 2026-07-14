import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Pressable,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import { colors } from "../constants/colors";
import { pieces, getPieceById } from "../data/pieces";
import {
  PieceIllustration,
  PieceSwitcher,
  DifficultyBadge,
  SegmentedTabs,
  TipCard,
  MovementDiagram,
} from "../components/academy";

const TABS = ["Overview", "Movement", "Strategy", "Examples"];

/** Rendered from app/academy/piece/[pieceId].tsx */
export function PieceDetailScreen() {
  const { pieceId } = useLocalSearchParams<{ pieceId: string }>();
  const router = useRouter();
  const [activeId, setActiveId] = useState<string>(pieceId);
  const [tabIndex, setTabIndex] = useState(0);

  const piece = getPieceById(activeId);

  if (!piece) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <Text style={{ color: colors.textSecondary }}>Piece not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.closeRow}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={12}
          style={styles.closeButton}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.hero}>
          <PieceIllustration symbol={piece.symbol} size={180} variant="hero" />
          <Text style={styles.pieceName}>{piece.name}</Text>
          {piece.value !== null && (
            <Text style={styles.pieceValue}>Material Value: {piece.value}</Text>
          )}
        </View>

        <View style={styles.switcherWrap}>
          <PieceSwitcher
            pieces={pieces}
            activeId={piece.id}
            onSelect={(p) => {
              setActiveId(p.id);
              setTabIndex(0);
              router.setParams({ pieceId: p.id });
            }}
          />
        </View>

        <View style={styles.badgeRow}>
          <DifficultyBadge difficulty={piece.difficulty} />
        </View>

        <View style={styles.movementBlock}>
          <Text style={styles.movementTitle}>How to Move the {piece.name}</Text>
          <Text style={styles.movementDescription}>
            {piece.movement.description}
          </Text>
        </View>

        <View style={styles.tabsWrap}>
          <SegmentedTabs
            tabs={TABS}
            activeIndex={tabIndex}
            onChange={setTabIndex}
          />
        </View>

        <Animated.View
          key={`${piece.id}-${tabIndex}`}
          entering={FadeIn.duration(250)}
          style={styles.tabContent}
        >
          {tabIndex === 0 && (
            <>
              <Text style={styles.overviewSummary}>
                {piece.overview.summary}
              </Text>
              <TipCard
                title="Strengths"
                icon="💪"
                items={piece.overview.strengths}
              />
              <TipCard
                title="Weaknesses"
                icon="⚠️"
                items={piece.overview.weaknesses}
              />
              <TipCard
                title="Typical Use"
                icon="🎯"
                items={[piece.overview.typicalUse]}
              />
            </>
          )}

          {tabIndex === 1 && (
            <>
              <TipCard
                title="Movement Rules"
                icon="📐"
                items={piece.movement.rules}
              />
              {piece.examples[0] && (
                <MovementDiagram
                  example={piece.examples[0]}
                  symbol={piece.symbol}
                  size={280}
                />
              )}
            </>
          )}

          {tabIndex === 2 && (
            <>
              <TipCard
                title="Common Mistakes"
                icon="🚫"
                items={piece.strategy.commonMistakes}
              />
              <TipCard
                title="Good Positioning"
                icon="📍"
                items={piece.strategy.goodPositioning}
              />
              <TipCard
                title="Opening Advice"
                icon="🌱"
                items={[piece.strategy.openingAdvice]}
              />
              <TipCard
                title="Endgame Advice"
                icon="🏁"
                items={[piece.strategy.endgameAdvice]}
              />
            </>
          )}

          {tabIndex === 3 &&
            piece.examples.map((example) => (
              <MovementDiagram
                key={example.id}
                example={example}
                symbol={piece.symbol}
                size={280}
              />
            ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: "center", justifyContent: "center" },
  closeRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: { color: colors.textPrimary, fontSize: 20, fontWeight: "600" },
  scrollContent: { paddingBottom: 48 },
  hero: { alignItems: "center", marginBottom: 8 },
  pieceName: {
    color: colors.textPrimary,
    fontWeight: "800",
    fontSize: 32,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 12,
  },
  pieceValue: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
    color: colors.accent,
  },
  switcherWrap: { marginTop: 16 },
  badgeRow: { alignItems: "center", marginBottom: 20 },
  movementBlock: { paddingHorizontal: 16, marginBottom: 20 },
  movementTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  movementDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },
  tabsWrap: { paddingHorizontal: 16, marginBottom: 20 },
  tabContent: { paddingHorizontal: 16 },
  overviewSummary: {
    fontSize: 14,
    marginBottom: 16,
    color: colors.textSecondary,
  },
});
