import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Chess } from "chess.js";
import * as Haptics from "expo-haptics";
import { useChessSounds } from "../../hooks/useChessSounds";
import {
  calculateNewPieces,
  TrackedPiece,
  parseFen,
} from "../../lib/chessUtils";
import { AnimatedPiece } from "./AnimatedPiece";

export interface ChessBoardProps {
  fen?: string;
  playerColor?: "WHITE" | "BLACK";
  lastMove?: { from: string; to: string } | null;
  onMove?: (from: string, to: string) => void;
  interactive?: boolean;
}

export default function ChessBoard({
  fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  playerColor = "WHITE",
  lastMove = null,
  onMove,
  interactive = true,
}: ChessBoardProps) {
  const { width } = useWindowDimensions();
  const [selectedSquare, setSelectedSquare] = React.useState<string | null>(
    null,
  );
  const { playMove, playCapture, playCheck } = useChessSounds();

  const [piecesInfo, setPiecesInfo] = React.useState<{
    fen: string;
    pieces: TrackedPiece[];
  }>({ fen: "", pieces: [] });

  if (piecesInfo.fen !== fen) {
    const newPieces = calculateNewPieces(piecesInfo.pieces, fen, lastMove);
    setPiecesInfo({ fen, pieces: newPieces });
  }
  const currentPieces =
    piecesInfo.fen === fen
      ? piecesInfo.pieces
      : calculateNewPieces(piecesInfo.pieces, fen, lastMove);

  // Clear selected square if FEN changes
  React.useEffect(() => {
    setSelectedSquare(null);
  }, [fen]);

  const { isCheck, currentTurn } = React.useMemo(() => {
    try {
      const chess = new Chess(fen);
      return { isCheck: chess.isCheck(), currentTurn: chess.turn() };
    } catch (e) {
      return { isCheck: false, currentTurn: "w" };
    }
  }, [fen]);

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

  // Viewport orders (flip for Black perspective)
  const rows =
    playerColor === "BLACK"
      ? [7, 6, 5, 4, 3, 2, 1, 0]
      : [0, 1, 2, 3, 4, 5, 6, 7];
  const cols =
    playerColor === "BLACK"
      ? [7, 6, 5, 4, 3, 2, 1, 0]
      : [0, 1, 2, 3, 4, 5, 6, 7];

  // Calculate possible moves for the selected square
  const possibleMoves = React.useMemo(() => {
    if (!selectedSquare) return [];
    try {
      const chess = new Chess(fen);
      const piece = chess.get(selectedSquare as any);
      if (!piece) return [];

      const turn = chess.turn();
      const isPlayerTurn = turn === (playerColor === "WHITE" ? "w" : "b");

      if (!isPlayerTurn || piece.color !== turn) {
        return [];
      }

      return chess
        .moves({ square: selectedSquare as any, verbose: true })
        .map((m) => m.to);
    } catch (e) {
      return [];
    }
  }, [fen, selectedSquare, playerColor]);

  function handleSquarePress(square: string) {
    if (!interactive) return;

    try {
      const chess = new Chess(fen);
      const piece = chess.get(square as any);

      if (selectedSquare === square) {
        setSelectedSquare(null);
        Haptics.selectionAsync();
        return;
      }

      // Check if tapping a valid move destination
      if (selectedSquare) {
        const moves = chess.moves({
          square: selectedSquare as any,
          verbose: true,
        });
        const validMove = moves.find((m) => m.to === square);

        if (validMove) {
          const isMoveCheck =
            validMove.san.endsWith("+") || validMove.san.endsWith("#");
          if (isMoveCheck) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            playCheck();
          } else if (validMove.captured || validMove.flags.includes("c")) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            playCapture();
          } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            playMove();
          }
          onMove?.(selectedSquare, square);
          setSelectedSquare(null);
          return;
        }
      }

      // If we clicked a piece of our own color, select it
      if (piece) {
        const turn = chess.turn();
        const isPlayerTurn = turn === (playerColor === "WHITE" ? "w" : "b");
        if (isPlayerTurn && piece.color === turn) {
          setSelectedSquare(square);
          Haptics.selectionAsync();
          return;
        }
      }

      setSelectedSquare(null);
    } catch (e) {
      setSelectedSquare(null);
    }
  }

  return (
    <View
      style={[styles.boardContainer, { width: boardSize, height: boardSize }]}
    >
      {rows.map((row) => (
        <View key={`row-${row}`} style={styles.row}>
          {cols.map((col) => {
            const square = getSquareName(row, col);
            const piece = boardState[row][col];

            const isLightSquare = (row + col) % 2 === 0;
            const isLastMoveSrc = lastMove && square === lastMove.from;
            const isLastMoveDst = lastMove && square === lastMove.to;
            const isSelected = square === selectedSquare;
            const isPossibleMove = possibleMoves.includes(square as any);
            const isKingInCheck =
              isCheck && piece?.type === "k" && piece?.color === currentTurn;

            // Labels
            const showRankLabel = col === cols[0]; // Show rank numbers on left edge
            const showFileLabel = row === rows[7]; // Show file letters on bottom edge
            const rankLabel = (8 - row).toString();
            const fileLabel = String.fromCharCode(97 + col); // 'a' through 'h'

            // Color palette (Warm Chessboard.js Style: light #f0d9b5, dark #b58863)
            const squareStyle = isLightSquare
              ? styles.lightSquare
              : styles.darkSquare;
            const labelColor = isLightSquare ? "#b58863" : "#f0d9b5";

            return (
              <Pressable
                key={square}
                onPress={() => handleSquarePress(square)}
                style={[
                  styles.cell,
                  { width: cellSize, height: cellSize },
                  squareStyle,
                  (isLastMoveSrc || isLastMoveDst) && styles.yellowHighlight,
                  isSelected && styles.selectedHighlight,
                  isKingInCheck && styles.checkHighlight,
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

                {/* Pieces are now rendered in the overlay layer above */}

                {/* Possible Move Indicator Dot / Circle */}
                {isPossibleMove && (
                  <View
                    style={[
                      styles.possibleMoveIndicator,
                      piece
                        ? styles.possibleMoveCapture
                        : styles.possibleMoveDot,
                    ]}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      ))}

      {/* Piece Overlay Layer */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {currentPieces.map((p) => (
          <AnimatedPiece
            key={p.id}
            id={p.id}
            type={p.type}
            color={p.color}
            square={p.square}
            cellSize={cellSize}
            playerColor={playerColor}
          />
        ))}
      </View>
    </View>
  );
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
  selectedHighlight: {
    backgroundColor: "#7B9F35",
    borderColor: "rgba(123, 159, 53, 0.6)",
    borderWidth: 1.5,
  },
  checkHighlight: {
    backgroundColor: "rgba(235, 97, 80, 0.8)",
    borderColor: "rgba(235, 97, 80, 1)",
    borderWidth: 1.5,
  },
  possibleMoveIndicator: {
    position: "absolute",
    zIndex: 4,
    alignSelf: "center",
  },
  possibleMoveDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  possibleMoveCapture: {
    width: "80%",
    height: "80%",
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "rgba(0, 0, 0, 0.15)",
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
