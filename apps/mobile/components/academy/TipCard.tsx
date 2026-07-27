import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface Props {
  title: string;
  items: string[];
  icon?: string;
}

export function TipCard({ title, items, icon = "💡" }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {title}
        </Text>
      </View>
      {items.map((item, i) => (
        <View key={i} style={styles.itemRow}>
          <View style={[styles.dot, { backgroundColor: colors.green }]} />
          <Text style={[styles.itemText, { color: colors.textSecondary }]}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  title: {
    fontWeight: "700",
    fontSize: 13,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    paddingLeft: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    marginRight: 8,
  },
  itemText: {
    flex: 1,
    fontSize: 12,
  },
});
