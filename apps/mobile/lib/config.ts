import { Platform } from "react-native";

/**
 * Resolves the API base URL.
 *
 * Set EXPO_PUBLIC_API_URL to override (requires dev-server restart).
 * Android emulators cannot reach the host via localhost — 10.0.2.2 maps
 * to the host machine's loopback interface.
 */
const DEFAULT_HOST = Platform.OS === "android" ? "10.0.2.2" : "localhost";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? `http://${DEFAULT_HOST}:3000/api/v1`;
