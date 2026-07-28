import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Modal } from "react-native";
import { colors } from "../../constants/theme";

interface Props {
  visible: boolean;
}

export function HintLoading({ visible }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ActivityIndicator color={colors.green} size="large" />
          <Text style={styles.text}>AI Coach is thinking...</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 28,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
  },
});
