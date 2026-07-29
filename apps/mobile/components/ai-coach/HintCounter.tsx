import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../constants/theme";

interface Props {
  remaining: number;
}

export function HintCounter({ remaining }: Props) {
  return (
    <View
      style={styles.badge}
      accessibilityRole="text"
      accessibilityLabel={`${remaining} hints remaining`}
    >
      <Text style={styles.text}>{remaining}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  text: {
    color: colors.background,
    fontSize: 11,
    fontWeight: "800",
  },
});
