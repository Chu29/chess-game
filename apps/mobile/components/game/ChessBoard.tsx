import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export interface ChessBoardProps {
  fen?: string;
  playerColor?: "WHITE" | "BLACK";
}

export default function ChessBoard({
  fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  playerColor = "WHITE",
}: ChessBoardProps) {
  const { width } = useWindowDimensions();

  // Parse FEN to get piece positions
  const boardState = parseFen(fen);

  function getSquareName(row: number, col: number): string {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];
    return files[col] + ranks[row];
  }

  const boardPadding = 16;
  const boardSize = width - boardPadding * 2;
  const cellSize = boardSize / 8;

  // Viewport orders
  const rows = [0, 1, 2, 3, 4, 5, 6, 7];
  const cols = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <View style={[styles.boardContainer, { width: boardSize, height: boardSize }]}>
      {rows.map((row) => (
        <View key={`row-${row}`} style={styles.row}>
          {cols.map((col) => {
            const square = getSquareName(row, col);
            const piece = boardState[row][col];

            const isLightSquare = (row + col) % 2 === 0;
            const isLastMoveSrc = square === "b2";
            const isLastMoveDst = square === "b4";

            // Labels
            const showRankLabel = col === 0; // Show rank numbers on left edge
            const showFileLabel = row === 7; // Show file letters on bottom edge
            const rankLabel = (8 - row).toString();
            const fileLabel = String.fromCharCode(97 + col); // 'a' through 'h'

            // Color palette (Warm Chessboard.js Style: light #f0d9b5, dark #b58863)
            const squareStyle = isLightSquare ? styles.lightSquare : styles.darkSquare;
            const labelColor = isLightSquare ? "#b58863" : "#f0d9b5";

            return (
              <View
                key={square}
                style={[
                  styles.cell,
                  { width: cellSize, height: cellSize },
                  squareStyle,
                  (isLastMoveSrc || isLastMoveDst) && styles.yellowHighlight,
                ]}
              >
                {/* Rank Number Label */}
                {showRankLabel && (
                  <Text style={[styles.rankLabel, { color: labelColor }]}>
                    {rankLabel}
                  </Text>
                )}

                {/* File Letter Label */}
                {showFileLabel && (
                  <Text style={[styles.fileLabel, { color: labelColor }]}>
                    {fileLabel}
                  </Text>
                )}

                {/* Text Overlay Behind Piece (mockup aesthetic) */}
                {piece && (
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={[
                      styles.pieceTextBackground,
                      { color: piece.color === "w" ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.18)" },
                    ]}
                  >
                    {getPieceName(piece.type)}
                  </Text>
                )}

                {/* Piece Icon on Top */}
                {piece && (
                  <MaterialCommunityIcons
                    name={getPieceIcon(piece.type)}
                    size={cellSize * 0.7}
                    color={piece.color === "w" ? "#F2F4F0" : "#1C2418"}
                    style={styles.pieceIcon}
                  />
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

// Simple FEN Parser returning 8x8 array of pieces or null
interface Piece {
  type: string;
  color: string;
}

function parseFen(fen: string): (Piece | null)[][] {
  const board: (Piece | null)[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  const parts = fen.split(" ");
  const boardPart = parts[0];
  const rows = boardPart.split("/");

  for (let r = 0; r < 8; r++) {
    let c = 0;
    const rowStr = rows[r];
    for (let i = 0; i < rowStr.length; i++) {
      const char = rowStr[i];
      if (/\d/.test(char)) {
        c += parseInt(char, 10);
      } else {
        const color = char === char.toUpperCase() ? "w" : "b";
        const type = char.toLowerCase();
        board[r][c] = { type, color };
        c++;
      }
    }
  }

  return board;
}

function getPieceName(type: string): string {
  switch (type) {
    case "p":
      return "PAWN";
    case "n":
      return "KNIGHT";
    case "b":
      return "BISHOP";
    case "r":
      return "ROOK";
    case "q":
      return "QUEEN";
    case "k":
      return "KING";
    default:
      return "";
  }
}

function getPieceIcon(type: string): keyof typeof MaterialCommunityIcons.glyphMap {
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

const styles = StyleSheet.create({
  boardContainer: {
    borderRadius: 4,
    overflow: "hidden",
    alignSelf: "center",
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  cell: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  lightSquare: {
    backgroundColor: "#F0D9B5",
  },
  darkSquare: {
    backgroundColor: "#B58863",
  },
  yellowHighlight: {
    backgroundColor: "#D2B84C",
    borderColor: "rgba(242, 201, 76, 0.4)",
    borderWidth: 1.5,
  },
  rankLabel: {
    position: "absolute",
    top: 2,
    left: 4,
    fontSize: 9,
    fontWeight: "700",
    zIndex: 1,
  },
  fileLabel: {
    position: "absolute",
    bottom: 2,
    right: 4,
    fontSize: 9,
    fontWeight: "700",
    zIndex: 1,
  },
  pieceTextBackground: {
    position: "absolute",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: -0.5,
    textAlign: "center",
    zIndex: 2,
    width: "100%",
  },
  pieceIcon: {
    zIndex: 3,
  },
});
