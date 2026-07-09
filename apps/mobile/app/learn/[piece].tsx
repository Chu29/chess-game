import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { colors } from "../../constants/theme";

interface PieceDetail {
  name: string;
  points: string;
  pointsColor: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor: string;
  bgColor: string;
  description: string;
  movement: string;
  strategy: string;
  special?: string;
}

const pieceDetailsData: Record<string, PieceDetail> = {
  king: {
    name: "King",
    points: "VICTORY CONDITION",
    pointsColor: "#E5C158",
    icon: "chess-king",
    iconColor: colors.green,
    bgColor: "#202521",
    description:
      "The King is the most important piece in chess. The entire game revolves around protecting your King and attacking the opponent's King.",
    movement:
      "Moves exactly one square in any direction: horizontally, vertically, or diagonally. The King can never move onto a square controlled by an opponent's piece.",
    strategy:
      "In the early and middle game, keep the King tucked safely behind a shield of castled pawns. In the endgame, the King becomes an active fighting piece that should support passed pawns and guard key squares.",
    special:
      "Castling: A special defensive move involving the King and a Rook, allowing the King to move two squares toward a Rook while the Rook hops over it, providing safety and activating the Rook.",
  },
  queen: {
    name: "Queen",
    points: "9 POINTS",
    pointsColor: "#5792F0",
    icon: "chess-queen",
    iconColor: "#5792F0",
    bgColor: "#1A2535",
    description:
      "The Queen is the most powerful piece on the board, combining the movement capabilities of the Rook and the Bishop.",
    movement:
      "Moves any number of vacant squares in any direction: horizontally, vertically, or diagonally in a straight line.",
    strategy:
      "Because of her immense power, avoid bringing the Queen out too early in the opening, where she can be chased and harassed by lower-value enemy pieces. Use her in the middle game to coordinate attacks and create threats.",
  },
  rook: {
    name: "Rook",
    points: "5 POINTS",
    pointsColor: colors.white,
    icon: "chess-rook",
    iconColor: "#F2F4F0",
    bgColor: "#262A28",
    description:
      "The Rook represents castle towers or heavy chariots. They are powerful long-range pieces most effective on open files.",
    movement:
      "Moves any number of vacant squares horizontally or vertically in a straight line.",
    strategy:
      "Rooks are strongest when they can control open files (columns with no pawns) or double up on the 7th rank to capture enemy pawns and trap the opposing King.",
    special:
      "Castling: Rooks participate in castling to transition from the corner of the board to active central files while securing King safety.",
  },
  bishop: {
    name: "Bishop",
    points: "3 POINTS",
    pointsColor: "#D274E6",
    icon: "chess-bishop",
    iconColor: "#D274E6",
    bgColor: "#2A1C30",
    description:
      "Bishops are long-range diagonal snipers. You start with one light-squared bishop and one dark-squared bishop.",
    movement:
      "Moves any number of vacant squares diagonally in a straight line. A Bishop can never change the color of the square it travels on.",
    strategy:
      "Keep your diagonal paths clear of your own pawns so your Bishops can control active, sweeping diagonals across the board. The 'Bishop pair' (having both Bishops) is highly valuable in open positions.",
  },
  knight: {
    name: "Knight",
    points: "3 POINTS",
    pointsColor: "#D19A66",
    icon: "chess-knight",
    iconColor: "#D19A66",
    bgColor: "#2F2318",
    description:
      "Knights represent cavalry. They are tricky, short-range pieces that are the only pieces on the board capable of jumping over other units.",
    movement:
      "Moves in an 'L' shape: two squares in one direction (vertically or horizontally) and then one square perpendicular. It can hop over any intervening pieces.",
    strategy:
      "Knights thrive in closed positions with many pawns, where they can hop over blockades. Position them on 'outposts'—advanced central squares where they cannot be easily kicked away by enemy pawns.",
  },
  pawn: {
    name: "Pawn",
    points: "1 POINT",
    pointsColor: colors.white,
    icon: "chess-pawn",
    iconColor: "#F2F4F0",
    bgColor: "#202122",
    description:
      "Pawns represent foot soldiers. Though individually the least valuable pieces, they form the structural backbone of your chess position.",
    movement:
      "Moves forward exactly one square at a time. On its very first move, a Pawn has the option to move forward two squares. Pawns capture differently than they move: they capture exactly one square diagonally forward.",
    strategy:
      "Use pawns to control center squares and create protective structures. Beware of creating double pawns or backward pawns, which can become permanent structural weaknesses.",
    special:
      "Promotion: If a Pawn reaches the furthest rank (8th rank for White, 1st rank for Black), it must be promoted into a Queen, Rook, Bishop, or Knight.\n\nEn Passant: If an opponent's pawn moves two squares forward and lands directly adjacent to your pawn, you can capture it diagonally 'in passing' on the very next turn.",
  },
};

export default function PieceDetailScreen() {
  const router = useRouter();
  const { piece } = useLocalSearchParams<{ piece: string }>();

  // Resolve details (lowercase key lookup)
  const details = pieceDetailsData[piece?.toLowerCase() || "king"];

  if (!details) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Piece not found</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>{details.name} Guide</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Visual Hero Block */}
        <View style={[styles.heroCard]}>
          <View
            style={[styles.iconCircle, { backgroundColor: details.bgColor }]}
          >
            <MaterialCommunityIcons
              name={details.icon}
              size={64}
              color={details.iconColor}
            />
          </View>
          <Text style={styles.pieceName}>{details.name}</Text>
          <View style={[styles.badge, { backgroundColor: details.bgColor }]}>
            <Text style={[styles.badgeText, { color: details.pointsColor }]}>
              {details.points}
            </Text>
          </View>
        </View>

        {/* Section 1: Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.sectionBody}>{details.description}</Text>
        </View>

        {/* Section 2: Movement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Moves</Text>
          <Text style={styles.sectionBody}>{details.movement}</Text>
        </View>

        {/* Section 3: Special Rules (conditional) */}
        {details.special && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: "#E5C158" }]}>
              Special Mechanics
            </Text>
            <Text style={styles.sectionBody}>{details.special}</Text>
          </View>
        )}

        {/* Section 4: Strategy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Strategic Value & Tips</Text>
          <Text style={styles.sectionBody}>{details.strategy}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: colors.green,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: "#0D110F",
    fontWeight: "700",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerIcon: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
  },
  pieceName: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.white,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.green,
    marginBottom: 10,
  },
  sectionBody: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
