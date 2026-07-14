import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Pressable,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors } from "../constants/colors";
import { getRuleById } from "../data/rules";
import {
  DifficultyBadge,
  TipCard,
  MovementDiagram,
} from "../components/academy";

/** Rendered from app/academy/rule/[ruleId].tsx */
export function RuleDetailScreen() {
  const { ruleId } = useLocalSearchParams<{ ruleId: string }>();
  const router = useRouter();
  const rule = getRuleById(ruleId);

  if (!rule) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <Text style={{ color: colors.textSecondary }}>Rule not found.</Text>
      </SafeAreaView>
    );
  }

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
        <View style={styles.hero}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>{rule.icon}</Text>
          </View>
          <Text style={styles.title}>{rule.title}</Text>
          <View style={styles.badgeRow}>
            <DifficultyBadge difficulty={rule.difficulty} />
          </View>
        </View>

        {rule.content.map((paragraph, i) => (
          <Text key={i} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}

        <View style={styles.tipsWrap}>
          <TipCard title="Key Tips" icon="💡" items={rule.tips} />
        </View>

        {rule.examples.map((example) => (
          <MovementDiagram
            key={example.id}
            example={example}
            symbol="●"
            size={280}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: "center", justifyContent: "center" },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: { minWidth: 44, minHeight: 44, justifyContent: "center" },
  backIcon: { color: colors.textPrimary, fontSize: 22 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 48 },
  hero: { alignItems: "center", marginBottom: 20 },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    backgroundColor: colors.accentMuted,
  },
  icon: { fontSize: 36 },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: "800" },
  badgeRow: { marginTop: 12 },
  paragraph: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 12,
    color: colors.textSecondary,
  },
  tipsWrap: { marginTop: 8 },
});
