import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../constants/theme";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import SocialAuthRow from "../../components/auth/SocialAuthRow";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../lib/api";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (isSubmitting) return;
    setError(null);

    const username = displayName.trim();
    if (username.length < 3 || username.length > 30) {
      setError("Display name must be between 3 and 30 characters.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register(username, email.trim(), password);
      // Root layout redirects to /(tabs) once authenticated.
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 409) {
        setError("That username or email is already taken.");
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to reach the server. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {error && <Text style={styles.errorText}>{error}</Text>}

      {isSubmitting ? (
        <ActivityIndicator color={colors.green} style={styles.loader} />
      ) : (
        <AuthButton
          label="Register"
          icon="arrow-forward"
          onPress={handleRegister}
        />
      )}

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
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 28,
    lineHeight: 18,
    textAlign: "center",
  },
  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: colors.textSecondary, fontSize: 13 },
  footerLink: { color: colors.green, fontSize: 13, fontWeight: "700" },
  errorText: {
    color: colors.loss,
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
  },
  loader: { paddingVertical: 14 },
});
