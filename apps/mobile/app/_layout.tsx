import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import SplashScreen from "../components/SplashScreen";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { SoundProvider } from "../context/SoundContext";
import { BackgroundMusicController } from "../components/BackgroundMusicController";

const MIN_SPLASH_MS = 2000;

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const [splashDone, setSplashDone] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), MIN_SPLASH_MS);
    return () => clearTimeout(timer);
  }, []);

  const isReady = splashDone && !isLoading;

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === "(auth)";
    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isReady, isAuthenticated, segments, router]);

  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider>
      <BackgroundMusicController />
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SoundProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SoundProvider>
  );
}
