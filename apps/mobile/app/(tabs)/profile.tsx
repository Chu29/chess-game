import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../constants/theme";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons
          name="person"
          size={64}
          color={colors.green}
          style={styles.icon}
        />
        <Text style={styles.title}>Grandmaster Profile</Text>
        <Text style={styles.subtitle}>
          Track your stats, game history, rating progress, and achievements
          here.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: "center",
  },
});
