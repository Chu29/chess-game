import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";
import { ChessPiece } from "../../types/academy";

interface Props {
  pieces: ChessPiece[];
  activeId: string;
  onSelect: (piece: ChessPiece) => void;
}

export function PieceSwitcher({ pieces, activeId, onSelect }: Props) {
  return (
    <View style={styles.container}>
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
              style={[styles.pill, active && styles.pillActive]}
            >
              <Text
                style={[
                  styles.glyph,
                  { color: active ? colors.accent : colors.textTertiary },
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
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
  pillActive: {
    borderWidth: 2,
    borderColor: colors.accent,
  },
  glyph: {
    fontSize: 20,
  },
});
