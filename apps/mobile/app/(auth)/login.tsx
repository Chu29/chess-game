import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../constants/theme";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import SocialAuthRow from "../../components/auth/SocialAuthRow";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.iconCircle}>
        <Ionicons name="game-controller" size={28} color={colors.green} />
      </View>

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>
        The board is set. Your move, Grandmaster.
      </Text>

      <AuthInput
        label="EMAIL ADDRESS"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        icon="mail-outline"
        keyboardType="email-address"
      />

      <AuthInput
        label="PASSWORD"
        placeholder="••••••"
        value={password}
        onChangeText={setPassword}
        icon="lock-closed-outline"
        secureTextEntry
        rightLabel="Forgot Password?"
        onRightLabelPress={() => {}}
      />

      <AuthButton label="Login" icon="arrow-forward" onPress={() => {}} />

      <SocialAuthRow />

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Don&apos;t have an account? </Text>
        <Pressable onPress={() => router.push("/(auth)/register")}>
          <Text style={styles.footerLink}>Register</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.greenDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 28,
    lineHeight: 18,
  },
  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: colors.textSecondary, fontSize: 13 },
  footerLink: { color: colors.green, fontSize: 13, fontWeight: "700" },
});
