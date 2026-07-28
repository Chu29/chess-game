import React from "react";
import { View, Text, Pressable, StyleSheet, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../constants/theme";
import type { HintResponse } from "../../lib/api";

interface Props {
  visible: boolean;
  hint: HintResponse | null;
  error: string | null;
  onApply?: () => void; // omit to hide the "Apply Hint" button entirely
  onClose: () => void;
}

export function HintModal({ visible, hint, error, onApply, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Ionicons name="bulb" size={22} color={colors.green} />
            <Text style={styles.title}>AI Coach Suggestion</Text>
          </View>

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : hint ? (
            <>
              <View style={styles.moveRow}>
                <Text style={styles.moveLabel}>Suggested Move</Text>
                <Text style={styles.moveValue}>{hint.bestMove || "—"}</Text>
              </View>

              {hint.score !== "N/A" && (
                <View style={styles.moveRow}>
                  <Text style={styles.moveLabel}>Evaluation</Text>
                  <Text style={styles.scoreValue}>{hint.score}</Text>
                </View>
              )}

              <Text style={styles.explanationLabel}>Why this move?</Text>
              <Text style={styles.explanation}>{hint.explanation}</Text>
            </>
          ) : null}

          <View style={styles.actions}>
            {onApply && hint?.bestMove ? (
              <Pressable onPress={onApply} style={[styles.actionBtn, styles.applyBtn]}>
                <Text style={styles.applyText}>Apply Hint</Text>
              </Pressable>
            ) : null}
            <Pressable onPress={onClose} style={[styles.actionBtn, styles.closeBtn]}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "800",
    marginLeft: 8,
  },
  errorText: {
    color: colors.loss,
    fontSize: 14,
    marginBottom: 16,
  },
  moveRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  moveLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  moveValue: {
    color: colors.green,
    fontSize: 16,
    fontWeight: "800",
  },
  scoreValue: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  explanationLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  explanation: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  applyBtn: {
    backgroundColor: colors.green,
  },
  applyText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: "800",
  },
  closeBtn: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  closeText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
});
