import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../context/ThemeContext";
import { ChessAcademyScreen } from "@/screens/ChessAcademyScreen";

export default function LearnScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={[styles.headerTitle, { color: colors.green }]}>
          Chuvinjab Chess
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.academyCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <View style={styles.academyLeft}>
            <Text style={[styles.academyTitle, { color: colors.green }]}>
              The Academy
            </Text>
            <Text
              style={[styles.academySubtitle, { color: colors.textSecondary }]}
            >
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
              <Text style={[styles.piecesBadgeText, { color: colors.green }]}>
                0/6 Pieces
              </Text>
            </View>
          </View>
          <View style={styles.academyRight}>
            <Ionicons
              name="school"
              size={76}
              color={colors.green}
              style={{ opacity: 0.1 }}
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerSpacer: {
    width: 26,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  academyCard: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
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
    marginBottom: 6,
  },
  academySubtitle: {
    fontSize: 12,
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
    fontSize: 11,
    fontWeight: "700",
  },
  academyRight: {
    position: "absolute",
    right: -10,
    top: 5,
    zIndex: 1,
  },
});
