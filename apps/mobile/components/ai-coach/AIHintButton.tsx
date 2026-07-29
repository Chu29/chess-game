import React from "react";
import { Pressable, StyleSheet, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../constants/theme";
import { HintCounter } from "./HintCounter";

interface Props {
  remaining: number;
  loading: boolean;
  onPress: () => void;
}

const SIZE = 56;

export function AIHintButton({ remaining, loading, onPress }: Props) {
  const disabled = remaining <= 0 || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`AI Coach hint, ${remaining} remaining`}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.green} size="small" />
      ) : (
        <Ionicons
          name="bulb"
          size={26}
          color={disabled ? colors.textSecondary : colors.green}
        />
      )}
      <HintCounter remaining={remaining} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    borderColor: colors.cardBorder,
    opacity: 0.5,
  },
});
