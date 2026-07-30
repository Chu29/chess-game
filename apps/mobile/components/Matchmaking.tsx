import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "../context/ThemeContext";
import { MOCK_OPPONENT_PROFILES } from "../data/mockOpponents";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface MatchmakingScreenProps {
  onCancel: () => void;
  ratingRange?: { min: number; max: number };
  timeControlLabel?: string;
}

export default function MatchmakingScreen({
  onCancel,
  ratingRange,
  timeControlLabel = "Blitz • 3 | 2",
}: MatchmakingScreenProps) {
  const { colors } = useTheme();
  const [seconds, setSeconds] = useState(0);
  const [scanIndex, setScanIndex] = useState(0);

  const pulse1 = useSharedValue(0);
  const pulse2 = useSharedValue(0);
  const anchorScale = useSharedValue(1);
  const orbitRotation = useSharedValue(0);

  const [onlineCount, setOnlineCount] = useState(
    Math.floor(100 + Math.random() * 100),
  );

  useEffect(() => {
    const jitterInterval = setInterval(() => {
      setOnlineCount((prev) => {
        const drift = Math.floor(Math.random() * 40) - 20;
        return Math.max(100, prev + drift);
      });
    }, 2500);
    return () => clearInterval(jitterInterval);
  }, []);

  const formatOnlineCount = (count: number) => {
    return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : `${count}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanIndex((prev) => (prev + 1) % MOCK_OPPONENT_PROFILES.length);
    }, 1000);
    return () => clearInterval(scanInterval);
  }, []);

  useEffect(() => {
    pulse1.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.linear }),
      -1,
      false,
    );

    pulse2.value = withSequence(
      withTiming(0, { duration: 1000 }),
      withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.linear }),
        -1,
        false,
      ),
    );

    anchorScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000, easing: Easing.ease }),
        withTiming(0.95, { duration: 1000, easing: Easing.ease }),
      ),
      -1,
      true,
    );

    orbitRotation.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [anchorScale, orbitRotation, pulse1, pulse2]);

  const animatedRing1Style = useAnimatedStyle(() => ({
    transform: [{ scale: 0.6 + pulse1.value * 1.6 }],
    opacity: 1 - pulse1.value,
  }));

  const animatedRing2Style = useAnimatedStyle(() => {
    if (pulse2.value === 0) return { opacity: 0 };
    return {
      transform: [{ scale: 0.6 + pulse2.value * 1.6 }],
      opacity: 1 - pulse2.value,
    };
  });

  const animatedAnchorStyle = useAnimatedStyle(() => ({
    transform: [{ scale: anchorScale.value }],
  }));

  const animatedOrbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${orbitRotation.value}deg` }],
  }));

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const scanningProfile = MOCK_OPPONENT_PROFILES[scanIndex];

  return (
    <View
      style={[styles.masterWrapper, { backgroundColor: colors.background }]}
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <Pressable style={styles.circularIconButton} onPress={onCancel}>
              <Ionicons name="arrow-back" size={22} color={colors.green} />
            </Pressable>
            <Text style={[styles.topBarTitle, { color: colors.green }]}>
              Chuvinjab Chess
            </Text>
          </View>
        </View>

        <View style={styles.centerCanvas}>
          <View style={styles.radarWrapper}>
            <Animated.View
              style={[
                styles.radarRing,
                { borderColor: `${colors.green}40` },
                animatedRing1Style,
              ]}
            />
            <Animated.View
              style={[
                styles.radarRing,
                { borderColor: `${colors.green}40` },
                animatedRing2Style,
              ]}
            />

            <Animated.View
              style={[
                styles.centralAnchor,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
                animatedAnchorStyle,
              ]}
            >
              <Image
                source={{ uri: scanningProfile.avatarUrl }}
                style={styles.orbitAvatarImage}
              />
            </Animated.View>

            <Animated.View
              style={[StyleSheet.absoluteFill, animatedOrbitStyle]}
            >
              <View style={styles.orbitAvatar} />
            </Animated.View>
          </View>
        </View>

        <View style={styles.statusBlock}>
          <Text style={[styles.statusHeading, { color: colors.textPrimary }]}>
            Finding your opponent...
          </Text>

          <View
            key={scanningProfile.username}
            style={[
              styles.scanCard,
              {
                backgroundColor: colors.card,
                borderColor: `${colors.green}40`,
              },
            ]}
          >
            <Image
              source={{ uri: scanningProfile.avatarUrl }}
              style={styles.scanAvatarImage}
            />
            <Text style={[styles.scanName, { color: colors.textPrimary }]}>
              {scanningProfile.username}
            </Text>
            <Text style={[styles.scanDot, { color: colors.textSecondary }]}>
              ·
            </Text>
            <Text style={[styles.scanRating, { color: colors.green }]}>
              {scanningProfile.rating}
            </Text>
          </View>

          <View style={styles.badgeRow}>
            <View
              style={[
                styles.metaBadge,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <Text
                style={[styles.metaBadgeText, { color: colors.textSecondary }]}
              >
                {timeControlLabel}
              </Text>
            </View>
            <View
              style={[
                styles.metaBadge,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <Text
                style={[styles.metaBadgeText, { color: colors.textSecondary }]}
              >
                {ratingRange
                  ? `${ratingRange.min} - ${ratingRange.max} ELO`
                  : "Matching by rating…"}
              </Text>
            </View>
          </View>

          <View style={styles.bentoContainer}>
            <View
              style={[
                styles.glassCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <Text
                style={[styles.glassCardLabel, { color: colors.textSecondary }]}
              >
                ESTIMATED
              </Text>
              <Text style={[styles.glassCardValue, { color: colors.green }]}>
                {formatTime(seconds)}
              </Text>
            </View>
            <View
              style={[
                styles.glassCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <Text
                style={[styles.glassCardLabel, { color: colors.textSecondary }]}
              >
                ONLINE
              </Text>
              <Text style={[styles.glassCardValue, { color: "#5B9BD5" }]}>
                {formatOnlineCount(onlineCount)}
              </Text>
            </View>
          </View>

          <View style={[styles.tipBox, { backgroundColor: colors.card }]}>
            <Ionicons
              name="bulb"
              size={20}
              color={colors.green}
              style={styles.tipIcon}
            />
            <Text style={[styles.tipText, { color: colors.textSecondary }]}>
              <Text style={{ color: colors.textPrimary, fontWeight: "700" }}>
                Grandmaster Tip:{" "}
              </Text>
              Controlling the center in the opening gives your pieces more
              mobility and limits your opponent&apos;s options.
            </Text>
          </View>
        </View>

        <View style={styles.footerContainer}>
          <Pressable
            onPress={onCancel}
            style={({ pressed }) => [
              styles.tactileCancelButton,
              { backgroundColor: colors.cardBorder },
              pressed && styles.tactileCancelButtonPressed,
            ]}
          >
            <Ionicons name="close" size={20} color="#FF5F5F" />
            <Text style={[styles.cancelText, { color: colors.textPrimary }]}>
              Cancel Search
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  masterWrapper: { flex: 1 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
  },
  topBarLeft: { flexDirection: "row", alignItems: "center", gap: 80 },
  circularIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: { fontSize: 22, fontWeight: "700" },
  centerCanvas: { flex: 1, alignItems: "center", justifyContent: "center" },
  radarWrapper: {
    width: SCREEN_WIDTH * 0.75,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  radarRing: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
  },
  centralAnchor: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    elevation: 8,
  },
  orbitAvatar: {
    position: "absolute",
    top: -4,
    left: "50%",
    marginLeft: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  orbitAvatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  scanAvatarImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  statusBlock: { paddingHorizontal: 24, alignItems: "center" },
  statusHeading: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  scanCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  scanName: { fontSize: 14, fontWeight: "600" },
  scanDot: { fontSize: 13 },
  scanRating: { fontSize: 14, fontWeight: "600" },
  badgeRow: { flexDirection: "row", gap: 8, marginBottom: 24 },
  metaBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  metaBadgeText: {
    fontSize: 13,
    fontWeight: "500",
  },
  bentoContainer: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
    maxWidth: 360,
    marginBottom: 20,
  },
  glassCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  glassCardLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 4,
  },
  glassCardValue: { fontSize: 24, fontWeight: "700" },
  tipBox: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    width: "100%",
    maxWidth: 360,
    alignItems: "flex-start",
    marginBottom: 24,
  },
  tipIcon: { marginRight: 10, marginTop: 2 },
  tipText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  footerContainer: {
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
  },
  tactileCancelButton: {
    width: "100%",
    maxWidth: 360,
    alignSelf: "center",
    height: 54,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  tactileCancelButtonPressed: {
    transform: [{ translateY: 2 }],
  },
  cancelText: { fontSize: 16, fontWeight: "700" },
});
