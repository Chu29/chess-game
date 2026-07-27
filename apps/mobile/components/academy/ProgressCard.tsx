import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../../context/ThemeContext";

interface Props {
  progress: number; // 0-100
}

export function ProgressCard({ progress }: Props) {
  const { colors } = useTheme();
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(progress, { duration: 600 });
  }, [progress, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View
      style={[styles.track, { backgroundColor: colors.cardBorder }]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: progress }}
    >
      <Animated.View
        style={[styles.fill, animatedStyle, { backgroundColor: colors.green }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
});
