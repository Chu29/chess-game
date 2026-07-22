import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../constants/theme";

interface Props {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  description: string;
  ctaLabel: string;
  accent?: boolean; // true = filled green CTA (primary action), false = outlined (secondary)
  onPress: () => void;
}

export function OptionCard({
  icon,
  title,
  description,
  ctaLabel,
  accent = false,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={28} color={colors.green} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={[styles.cta, accent ? styles.ctaFilled : styles.ctaOutline]}>
        <Text
          style={[
            styles.ctaText,
            accent ? styles.ctaTextFilled : styles.ctaTextOutline,
          ]}
        >
          {ctaLabel}
        </Text>
        <Ionicons
          name="arrow-forward"
          size={16}
          color={accent ? colors.background : colors.green}
          style={{ marginLeft: 6 }}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 20,
    marginBottom: 16,
    minHeight: 44,
  },
  cardPressed: {
    opacity: 0.85,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.greenDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  ctaFilled: {
    backgroundColor: colors.green,
  },
  ctaOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.green,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: "700",
  },
  ctaTextFilled: {
    color: colors.background,
  },
  ctaTextOutline: {
    color: colors.green,
  },
});
