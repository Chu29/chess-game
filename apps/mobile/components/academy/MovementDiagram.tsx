import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Rect, Circle, Text as SvgText } from "react-native-svg";
import { colors } from "../../constants/colors";
import { MovementExample } from "../../types/academy";

interface Props {
  example: MovementExample;
  symbol: string;
  size?: number;
}

const BOARD_SIZE = 8;

export function MovementDiagram({ example, symbol, size = 300 }: Props) {
  const cell = size / BOARD_SIZE;
  const { from, to, blocked = [] } = example;

  const squares = [];
  for (let rank = 0; rank < BOARD_SIZE; rank++) {
    for (let file = 0; file < BOARD_SIZE; file++) {
      const isLight = (rank + file) % 2 === 0;
      squares.push(
        <Rect
          key={`${file}-${rank}`}
          x={file * cell}
          y={(BOARD_SIZE - 1 - rank) * cell}
          width={cell}
          height={cell}
          fill={isLight ? "#242424" : "#181818"}
        />,
      );
    }
  }

  return (
    <View style={styles.wrap}>
      <Svg width={size} height={size}>
        {squares}

        {/* Blocked / occupied squares */}
        {blocked.map((sq, i) => (
          <Rect
            key={`blocked-${i}`}
            x={sq.file * cell + 3}
            y={(BOARD_SIZE - 1 - sq.rank) * cell + 3}
            width={cell - 6}
            height={cell - 6}
            rx={4}
            fill="none"
            stroke={colors.danger}
            strokeWidth={2}
            strokeDasharray="4,3"
          />
        ))}

        {/* Legal destination squares */}
        {to.map((sq, i) => (
          <Circle
            key={`to-${i}`}
            cx={sq.file * cell + cell / 2}
            cy={(BOARD_SIZE - 1 - sq.rank) * cell + cell / 2}
            r={cell * 0.16}
            fill={colors.accent}
            opacity={0.9}
          />
        ))}

        {/* Origin piece */}
        <SvgText
          x={from.file * cell + cell / 2}
          y={(BOARD_SIZE - 1 - from.rank) * cell + cell * 0.68}
          fontSize={cell * 0.62}
          fill={colors.textPrimary}
          textAnchor="middle"
        >
          {symbol}
        </SvgText>
      </Svg>

      <Text style={styles.caption}>{example.caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 12,
    padding: 12,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  caption: {
    fontSize: 12,
    marginTop: 12,
    textAlign: "center",
    color: colors.textSecondary,
  },
});
