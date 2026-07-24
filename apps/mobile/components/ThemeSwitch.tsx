// components/ThemeSwitch.tsx

import React from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";

export function ThemeSwitch() {
  const { mode, colors, toggleTheme } = useTheme();
  const isDark = mode === "dark";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        { opacity: pressed ? 0.8 : 1 }
      ]}
      onPress={toggleTheme}
    >
      <Ionicons
        name={isDark ? "moon-outline" : "sunny-outline"}
        size={18}
        color={colors.textSecondary}
      />
      
      <Text style={[styles.text, { color: colors.textPrimary }]}>
        Theme ({isDark ? "Dark" : "Light"})
      </Text>

      {/* Visual Switch Pill */}
      <View
        style={[
          styles.switchTrack,
          {
            backgroundColor: isDark ? colors.cardBorder : colors.green,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <View
          style={[
            styles.switchThumb,
            {
              backgroundColor: colors.card,
              transform: [{ translateX: isDark ? 0 : 18 }],
            },
          ]}
        >
          <Ionicons
            name={isDark ? "moon" : "sunny"}
            size={10}
            color={isDark ? colors.textSecondary : colors.green}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 14,
    gap: 10,
  },
  text: {
    flex: 1,
    fontSize: 14,
  },
  switchTrack: {
    width: 42,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: "center",
    borderWidth: 1,
  },
  switchThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
});