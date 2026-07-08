import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../constants/theme";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary";
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
};

export default function AuthButton({
  label,
  onPress,
  variant = "primary",
  icon,
  style,
}: Props) {
  const isPrimary = variant === "primary";
  return (
    <Pressable
      style={[
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        style,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.label,
          isPrimary ? styles.primaryLabel : styles.secondaryLabel,
        ]}
      >
        {label}
      </Text>
      {icon && (
        <Ionicons
          name={icon}
          size={16}
          color={isPrimary ? colors.background : colors.white}
          style={{ marginLeft: 6 }}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 14,
  },
  primary: { backgroundColor: colors.green },
  secondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  label: { fontSize: 15, fontWeight: "700" },
  primaryLabel: { color: colors.background },
  secondaryLabel: { color: colors.white },
});
