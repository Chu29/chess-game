import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../context/ThemeContext";

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
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
        pressed && styles.cardPressed,
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: colors.green + "1A" }, // 10% opacity accent background for icon badge
        ]}
      >
        <Ionicons name={icon} size={28} color={colors.green} />
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {title}
      </Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {description}
      </Text>

      <View
        style={[
          styles.cta,
          accent
            ? { backgroundColor: colors.green }
            : [styles.ctaOutline, { borderColor: colors.green }],
        ]}
      >
        <Text
          style={[
            styles.ctaText,
            { color: accent ? colors.background : colors.green },
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
    borderRadius: 16,
    borderWidth: 1,
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
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  description: {
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
  ctaOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: "700",
  },
});