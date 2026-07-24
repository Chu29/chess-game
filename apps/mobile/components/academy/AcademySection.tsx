// components/academy/AcademySection.tsx

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface Props {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
  children: React.ReactNode;
}

export function AcademySection({ title, subtitle, onSeeAll, children }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
        {onSeeAll && (
          <Pressable
            onPress={onSeeAll}
            accessibilityRole="button"
            accessibilityLabel={`See all ${title}`}
            hitSlop={8}
            style={styles.seeAll}
          >
            <Text style={[styles.seeAllText, { color: colors.green }]}>
              See all
            </Text>
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  titleWrap: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  seeAll: {
    minHeight: 44,
    minWidth: 44,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "600",
  },
});