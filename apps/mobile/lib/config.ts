import { Platform } from "react-native";

/**
 * Resolves the API base URL.
 *
 * - On Web: dynamically resolves against window.location.hostname so requests
 *   always target the host serving the web client (localhost or LAN IP).
 * - On Native (Android / iOS): uses EXPO_PUBLIC_API_URL or maps appropriately
 *   (10.0.2.2 for Android emulator, localhost for iOS simulator).
 */
function resolveApiUrl(): string {
  if (
    Platform.OS === "web" &&
    typeof window !== "undefined" &&
    window.location?.hostname
  ) {
    const host = window.location.hostname;
    return `http://${host}:3000/api/v1`;
  }

  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const defaultHost = Platform.OS === "android" ? "10.0.2.2" : "localhost";
  return `http://${defaultHost}:3000/api/v1`;
}

export const API_URL = resolveApiUrl();
