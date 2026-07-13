import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ChessRule } from "../../types/academy";
import { colors } from "../../constants/colors";

interface Props {
  rule: ChessRule;
  index?: number;
  onPress: (rule: ChessRule) => void;
}

export function RuleCard({ rule, index = 0, onPress }: Props) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
      <Pressable
        onPress={() => onPress(rule)}
        accessibilityRole="button"
        accessibilityLabel={`${rule.title}. ${rule.shortDescription}`}
        style={styles.card}
      >
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>{rule.icon}</Text>
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.title}>{rule.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {rule.shortDescription}
          </Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    minHeight: 44,
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: colors.accentMuted,
  },
  icon: {
    fontSize: 22,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  description: {
    fontSize: 12,
    marginTop: 2,
    color: colors.textSecondary,
  },
  chevron: {
    color: colors.textTertiary,
    fontSize: 20,
  },
});
