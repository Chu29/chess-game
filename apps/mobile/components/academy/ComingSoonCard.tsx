import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";

interface Props {
  title: string;
  description: string;
  icon?: string;
}

export function ComingSoonCard({ title, description, icon = "✨" }: Props) {
  return (
    <View
      style={styles.card}
      accessibilityRole="text"
      accessibilityLabel={`${title}, coming soon. ${description}`}
    >
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.textWrap}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>COMING SOON</Text>
          </View>
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    opacity: 0.75,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  title: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 13,
    marginRight: 8,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: colors.border,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  description: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
