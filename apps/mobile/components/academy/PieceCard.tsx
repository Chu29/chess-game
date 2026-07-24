import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ChessPiece } from "../../types/academy";
import { useTheme } from "../../context/ThemeContext";
import { PieceIllustration } from "./PieceIllustration";

interface Props {
  piece: ChessPiece;
  index?: number;
  onPress: (piece: ChessPiece) => void;
}

export function PieceCard({ piece, index = 0, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(400)}
      style={styles.wrap}
    >
      <Pressable
        onPress={() => onPress(piece)}
        accessibilityRole="button"
        accessibilityLabel={`${piece.name}, ${piece.tagline}`}
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <View style={styles.illustrationWrap}>
          <PieceIllustration
            symbol={piece.symbol}
            size={72}
            delay={index * 60}
          />
        </View>
        <Text style={[styles.name, { color: colors.textPrimary }]}>
          {piece.name}
        </Text>
        {piece.value !== null && (
          <Text style={[styles.value, { color: colors.green }]}>
            Value: {piece.value}
          </Text>
        )}
        <Text
          style={[styles.tagline, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {piece.tagline}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "50%",
    padding: 8,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    minHeight: 44,
  },
  illustrationWrap: {
    alignItems: "center",
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  value: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  tagline: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 8,
  },
});