import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import SplashScreen from "../components/SplashScreen";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 2800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReady) {
      router.replace("/login");
    }
  }, [isReady]);

  if (!isReady) {
    return <SplashScreen />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
