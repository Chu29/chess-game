import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../constants/theme";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import SocialAuthRow from "../../components/auth/SocialAuthRow";

export default function RegisterScreen() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Master the board. Start your grandmaster journey today.
      </Text>

      <AuthInput
        label="DISPLAY NAME"
        placeholder="Grandmaster_42"
        value={displayName}
        onChangeText={setDisplayName}
      />

      <AuthInput
        label="EMAIL ADDRESS"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <AuthInput
        label="PASSWORD"
        placeholder="••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <AuthInput
        label="CONFIRM PASSWORD"
        placeholder="••••••"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <AuthButton label="Register" icon="arrow-forward" onPress={() => {}} />

      <SocialAuthRow />

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Pressable onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.footerLink}>Login</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
 title: {
  color: colors.white,
  fontSize: 30,
  fontWeight: '700',
  marginBottom: 8,
  textAlign: 'center',
},
  subtitle: { color: colors.textSecondary, fontSize: 13, marginBottom: 28, lineHeight: 18 , textAlign: "center"},
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: colors.textSecondary, fontSize: 13 },
  footerLink: { color: colors.green, fontSize: 13, fontWeight: '700' },
});