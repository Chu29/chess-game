import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { ChessPiece } from "../../types/academy";

interface Props {
  pieces: ChessPiece[];
  activeId: string;
  onSelect: (piece: ChessPiece) => void;
}

export function PieceSwitcher({ pieces, activeId, onSelect }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {pieces.map((piece) => {
          const active = piece.id === activeId;
          return (
            <Pressable
              key={piece.id}
              onPress={() => onSelect(piece)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Switch to ${piece.name}`}
              style={[
                styles.pill,
                active && {
                  borderWidth: 2,
                  borderColor: colors.green,
                },
              ]}
            >
              <Text
                style={[
                  styles.glyph,
                  { color: active ? colors.green : colors.textSecondary },
                ]}
              >
                {piece.symbol}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 24,
    borderWidth: 1,
    maxWidth: "92%",
  },
  scrollContent: {
    alignItems: "center",
  },
  pill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  glyph: {
    fontSize: 20,
  },
});
