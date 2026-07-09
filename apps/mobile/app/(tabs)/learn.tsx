import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { colors } from "../../constants/theme";

export default function LearnScreen() {
  const router = useRouter();

  const handlePiecePress = (piece: string) => {
    router.push({
      pathname: "/learn/[piece]",
      params: { piece: piece.toLowerCase() },
    });
  };

  const handleQuizPress = () => {
    Alert.alert(
      "Quick Quiz",
      "Start a 5-question quiz to test your chess piece mastery!",
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>Chuvinjab Chess</Text>
        <Pressable style={styles.headerIcon}>
          <Ionicons name="settings" size={22} color={colors.green} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* The Academy Banner Card */}
        <View style={styles.academyCard}>
          <View style={styles.academyLeft}>
            <Text style={styles.academyTitle}>The Academy</Text>
            <Text style={styles.academySubtitle}>
              Master the battlefield. Select a piece to learn its unique
              movement patterns and strategic value.
            </Text>
            <View style={styles.piecesBadge}>
              <Ionicons
                name="star"
                size={12}
                color={colors.green}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.piecesBadgeText}>0/6 Pieces</Text>
            </View>
          </View>
          <View style={styles.academyRight}>
            <Ionicons
              name="school"
              size={76}
              color="rgba(143, 194, 74, 0.08)"
            />
          </View>
        </View>

        {/* King Card (Most Important) */}
        <Pressable
          style={styles.kingCard}
          onPress={() => handlePiecePress("King")}
        >
          <View style={styles.kingCardHeader}>
            <Text style={styles.importantLabel}>Most Important</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textSecondary}
            />
          </View>
          <View style={styles.kingCardContent}>
            <View style={styles.kingIconCircle}>
              <MaterialCommunityIcons
                name="chess-king"
                size={36}
                color={colors.green}
              />
            </View>
            <Text style={styles.kingTitle}>King</Text>
            <Text style={styles.kingSubtitle}>VICTORY CONDITION</Text>
          </View>
        </Pressable>

        {/* Grid for Queen, Rook, Bishop, Knight */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            {/* Queen Card */}
            <Pressable
              style={styles.gridCard}
              onPress={() => handlePiecePress("Queen")}
            >
              <View
                style={[styles.gridIconCircle, { backgroundColor: "#1A2535" }]}
              >
                <MaterialCommunityIcons
                  name="chess-queen"
                  size={26}
                  color="#5792F0"
                />
              </View>
              <Text style={styles.gridPieceName}>Queen</Text>
              <View style={[styles.pointBadge, { backgroundColor: "#16283F" }]}>
                <Text style={[styles.pointBadgeText, { color: "#5792F0" }]}>
                  9 POINTS
                </Text>
              </View>
            </Pressable>

            {/* Rook Card */}
            <Pressable
              style={styles.gridCard}
              onPress={() => handlePiecePress("Rook")}
            >
              <View
                style={[styles.gridIconCircle, { backgroundColor: "#262A28" }]}
              >
                <MaterialCommunityIcons
                  name="chess-rook"
                  size={24}
                  color="#F2F4F0"
                />
              </View>
              <Text style={styles.gridPieceName}>Rook</Text>
              <View style={[styles.pointBadge, { backgroundColor: "#2A2E2C" }]}>
                <Text
                  style={[
                    styles.pointBadgeText,
                    { color: colors.textSecondary },
                  ]}
                >
                  5 POINTS
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.gridRow}>
            {/* Bishop Card */}
            <Pressable
              style={styles.gridCard}
              onPress={() => handlePiecePress("Bishop")}
            >
              <View
                style={[styles.gridIconCircle, { backgroundColor: "#2A1C30" }]}
              >
                <MaterialCommunityIcons
                  name="chess-bishop"
                  size={24}
                  color="#D274E6"
                />
              </View>
              <Text style={styles.gridPieceName}>Bishop</Text>
              <View style={[styles.pointBadge, { backgroundColor: "#3C1F45" }]}>
                <Text style={[styles.pointBadgeText, { color: "#D274E6" }]}>
                  3 POINTS
                </Text>
              </View>
            </Pressable>

            {/* Knight Card */}
            <Pressable
              style={styles.gridCard}
              onPress={() => handlePiecePress("Knight")}
            >
              <View
                style={[styles.gridIconCircle, { backgroundColor: "#2F2318" }]}
              >
                <MaterialCommunityIcons
                  name="chess-knight"
                  size={24}
                  color="#D19A66"
                />
              </View>
              <Text style={styles.gridPieceName}>Knight</Text>
              <View style={[styles.pointBadge, { backgroundColor: "#453220" }]}>
                <Text style={[styles.pointBadgeText, { color: "#D19A66" }]}>
                  3 POINTS
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Pawn Card */}
        <Pressable
          style={styles.pawnCard}
          onPress={() => handlePiecePress("Pawn")}
        >
          <View style={styles.pawnLeftRow}>
            <View style={styles.pawnIconCircle}>
              <MaterialCommunityIcons
                name="chess-pawn"
                size={22}
                color={colors.white}
              />
            </View>
            <View style={styles.pawnTextMeta}>
              <Text style={styles.pawnTitle}>Pawn</Text>
              <Text style={styles.pawnSubtitle}>The soul of chess</Text>
            </View>
          </View>
          <View
            style={[
              styles.pointBadge,
              { backgroundColor: "#2A2E2C", minWidth: 64 },
            ]}
          >
            <Text
              style={[styles.pointBadgeText, { color: colors.textSecondary }]}
            >
              1 POINT
            </Text>
          </View>
        </Pressable>

        {/* Mastery Progress & Quiz Footer */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLeft}>
            <Text style={styles.progressTitle}>Mastery Progress</Text>
            <View style={styles.progressBarTrack}>
              <View style={styles.progressBarFill} />
            </View>
          </View>
          <Pressable style={styles.quizBtn} onPress={handleQuizPress}>
            <Text style={styles.quizBtnText}>Quick Quiz</Text>
          </Pressable>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerSpacer: {
    width: 26,
  },
  headerIcon: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: colors.green,
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  academyCard: {
    flexDirection: "row",
    backgroundColor: "#161B17",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  academyLeft: {
    flex: 1,
    zIndex: 2,
  },
  academyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.green,
    marginBottom: 6,
  },
  academySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 14,
  },
  piecesBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(143, 194, 74, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(143, 194, 74, 0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  piecesBadgeText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: "700",
  },
  academyRight: {
    position: "absolute",
    right: -10,
    top: 5,
    zIndex: 1,
  },
  kingCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    marginBottom: 16,
  },
  kingCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  importantLabel: {
    color: "#E5C158",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  kingCardContent: {
    alignItems: "center",
    paddingVertical: 12,
  },
  kingIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#202521",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  kingTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
  },
  kingSubtitle: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: "700",
    marginTop: 4,
    letterSpacing: 0.8,
  },
  gridContainer: {
    flexDirection: "column",
    gap: 12,
    marginBottom: 16,
  },
  gridRow: {
    flexDirection: "row",
    gap: 12,
  },
  gridCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    alignItems: "center",
  },
  gridIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  gridPieceName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 8,
  },
  pointBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  pointBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  pawnCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    marginBottom: 20,
  },
  pawnLeftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pawnIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#202122",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  pawnTextMeta: {
    justifyContent: "center",
  },
  pawnTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
  },
  pawnSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#161B17",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
  },
  progressLeft: {
    flex: 1,
    marginRight: 16,
  },
  progressTitle: {
    fontFamily: "monospace",
    fontSize: 12,
    color: colors.green,
    fontWeight: "700",
    marginBottom: 8,
  },
  progressBarTrack: {
    height: 5,
    backgroundColor: "#232A24",
    borderRadius: 3,
    position: "relative",
  },
  progressBarFill: {
    width: "12%",
    height: "100%",
    backgroundColor: colors.green,
    borderRadius: 3,
  },
  quizBtn: {
    backgroundColor: colors.green,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  quizBtnText: {
    color: "#0D110F",
    fontSize: 12,
    fontWeight: "700",
  },
});
