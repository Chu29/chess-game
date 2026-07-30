import React from "react";
import { View, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { CapturedCounts } from "../../lib/chessUtils";
import { PlayerColor } from "../../lib/api";

export function CapturedPieces({
  counts,
  color,
}: {
  counts: CapturedCounts;
  color: PlayerColor;
}) {
  const iconColor = color === "WHITE" ? "#F2F4F0" : "#1C2418";

  const renderPiece = (
    type: string,
    count: number,
    iconName: keyof typeof MaterialCommunityIcons.glyphMap,
  ) => {
    if (count <= 0) return null;
    return Array.from({ length: count }).map((_, i) => (
      <MaterialCommunityIcons
        key={`${type}-${i}`}
        name={iconName}
        size={14}
        color={iconColor}
        style={styles.icon}
      />
    ));
  };

  return (
    <View style={styles.container}>
      {renderPiece("p", counts.p, "chess-pawn")}
      {renderPiece("n", counts.n, "chess-knight")}
      {renderPiece("b", counts.b, "chess-bishop")}
      {renderPiece("r", counts.r, "chess-rook")}
      {renderPiece("q", counts.q, "chess-queen")}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  icon: {
    marginRight: -4, // overlap slightly
  },
});
