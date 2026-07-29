import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ChessRule } from "../../types/academy";
import { useTheme } from "../../context/ThemeContext";

interface Props {
  rule: ChessRule;
  index?: number;
  onPress: (rule: ChessRule) => void;
}

export function RuleCard({ rule, index = 0, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
      <Pressable
        onPress={() => onPress(rule)}
        accessibilityRole="button"
        accessibilityLabel={`${rule.title}. ${rule.shortDescription}`}
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <View
          style={[styles.iconWrap, { backgroundColor: colors.green + "1A" }]}
        >
          <Text style={styles.icon}>{rule.icon}</Text>
        </View>
        <View style={styles.textWrap}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {rule.title}
          </Text>
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {rule.shortDescription}
          </Text>
        </View>
        <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
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
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 22,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  chevron: {
    fontSize: 20,
  },
});
