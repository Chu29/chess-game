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
import { useRouter } from "expo-router";
import { colors } from "../../constants/theme";
import { ChessAcademyScreen } from "@/screens/ChessAcademyScreen";

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

        <ChessAcademyScreen />
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
