import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import { useTheme } from "../../context/ThemeContext";

interface Props {
  symbol: string;
  size?: number;
  delay?: number;
  /** 'hero' = large monochrome illustration (detail screen), 'card' = compact accented glyph (grid cards) */
  variant?: "hero" | "card";
}

export function PieceIllustration({
  symbol,
  size = 120,
  delay = 0,
  variant = "card",
}: Props) {
  const { colors } = useTheme();
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 12, stiffness: 120 }),
    );
    opacity.value = withDelay(delay, withSpring(1));
  }, [delay, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (variant === "hero") {
    const glowSize = size * 0.85;
    return (
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            alignItems: "center",
            justifyContent: "center",
          },
          animatedStyle,
        ]}
        accessibilityRole="image"
      >
        <View
          style={{
            position: "absolute",
            width: glowSize,
            height: glowSize,
            borderRadius: glowSize / 2,
            backgroundColor: colors.green + "1A",
            opacity: 0.5,
          }}
        />
        <Text style={{ fontSize: size * 0.5, color: colors.textSecondary }}>
          {symbol}
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.green + "1A",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: colors.cardBorder,
        },
        animatedStyle,
      ]}
      accessibilityRole="image"
    >
      <Text style={{ fontSize: size * 0.42, color: colors.green }}>
        {symbol}
      </Text>
    </Animated.View>
  );
}
