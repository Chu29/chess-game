import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { useSound } from "../context/SoundContext";
import { colors } from "../constants/theme";

export function SoundToggle() {
  const { muted, setMuted } = useSound();

  return (
    <View style={styles.row}>
      <Text style={styles.label}>Sound</Text>
      <Switch
        value={!muted}
        onValueChange={(enabled) => setMuted(!enabled)}
        trackColor={{ false: colors.cardBorder, true: colors.green }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  label: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
});
