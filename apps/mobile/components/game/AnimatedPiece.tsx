import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

function getPieceIcon(
  type: string,
): keyof typeof MaterialCommunityIcons.glyphMap {
  switch (type) {
    case "k":
      return "chess-king";
    case "q":
      return "chess-queen";
    case "r":
      return "chess-rook";
    case "b":
      return "chess-bishop";
    case "n":
      return "chess-knight";
    case "p":
      return "chess-pawn";
    default:
      return "chess-pawn";
  }
}

interface AnimatedPieceProps {
  id: string;
  type: string;
  color: string;
  square: string;
  cellSize: number;
  playerColor: "WHITE" | "BLACK";
}

function AnimatedPieceComponent({
  type,
  color,
  square,
  cellSize,
  playerColor,
}: AnimatedPieceProps) {
  // Calculate square indices
  const colIdx = square.charCodeAt(0) - 97; // 'a' is 97
  const rowIdx = 8 - parseInt(square[1], 10); // '8' is row 0

  // Adjust for board rotation
  const visualRow = playerColor === "BLACK" ? 7 - rowIdx : rowIdx;
  const visualCol = playerColor === "BLACK" ? 7 - colIdx : colIdx;

  const targetX = visualCol * cellSize;
  const targetY = visualRow * cellSize;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(targetX, {
            duration: 250,
            easing: Easing.inOut(Easing.quad),
          }),
        },
        {
          translateY: withTiming(targetY, {
            duration: 250,
            easing: Easing.inOut(Easing.quad),
          }),
        },
      ],
    };
  }, [targetX, targetY]);

  return (
    <Animated.View
      style={[
        styles.pieceContainer,
        { width: cellSize, height: cellSize },
        animatedStyle,
      ]}
      pointerEvents="none"
    >
      <MaterialCommunityIcons
        name={getPieceIcon(type)}
        size={cellSize * 0.7}
        color={color === "w" ? "#F2F4F0" : "#1C2418"}
      />
    </Animated.View>
  );
}

export const AnimatedPiece = React.memo(AnimatedPieceComponent);
AnimatedPiece.displayName = "AnimatedPiece";

const styles = StyleSheet.create({
  pieceContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
