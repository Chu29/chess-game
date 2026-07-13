import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const colors = {
  background: "#151310",
  surface: "#1E1B18",
  surfaceContainerHigh: "#2C2927",
  surfaceContainerLow: "#1E1B18",
  primary: "#9FD668",
  secondary: "#A1C9FF",
  textOnSurface: "#E8E1DC",
  textOnSurfaceVariant: "#C2C9B6",
  softRed: "#FF5F5F",
  outlineVariant: "rgba(255, 255, 255, 0.05)",
};

interface MatchmakingScreenProps {
  onCancel: () => void;
}

export default function MatchmakingScreen({
  onCancel,
}: MatchmakingScreenProps) {
  const [seconds, setSeconds] = useState(12);

  const pulse1 = useSharedValue(0);
  const pulse2 = useSharedValue(0);
  const anchorScale = useSharedValue(1);
  const orbitRotation1 = useSharedValue(0);
  const orbitRotation2 = useSharedValue(360);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
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

    orbitRotation1.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
      false,
    );

    orbitRotation2.value = withRepeat(
      withTiming(0, { duration: 12000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [anchorScale, orbitRotation1, orbitRotation2, pulse1, pulse2]); 

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

  const animatedOrbit1Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${orbitRotation1.value}deg` }],
  }));

  const animatedOrbit2Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${orbitRotation2.value}deg` }],
  }));

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.masterWrapper}>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <Pressable style={styles.circularIconButton} onPress={onCancel}>
              <Ionicons name="arrow-back" size={22} color={colors.primary} />
            </Pressable>
            <Text style={styles.topBarTitle}>Chuvinjab Chess</Text>
          </View>
          <Pressable style={styles.circularIconButton}>
            <Ionicons
              name="settings-outline"
              size={22}
              color={colors.primary}
            />
          </Pressable>
        </View>

        <View style={styles.centerCanvas}>
          <View style={styles.radarWrapper}>
            <Animated.View style={[styles.radarRing, animatedRing1Style]} />
            <Animated.View style={[styles.radarRing, animatedRing2Style]} />

            <Animated.View style={[styles.centralAnchor, animatedAnchorStyle]}>
              <MaterialCommunityIcons
                name="chess-king"
                size={54}
                color={colors.primary}
              />
            </Animated.View>

            <Animated.View
              style={[StyleSheet.absoluteFill, animatedOrbit1Style]}
            >
              <View
                style={[
                  styles.orbitDot,
                  { top: 30, left: 30, backgroundColor: colors.primary },
                ]}
              />
            </Animated.View>

            <Animated.View
              style={[StyleSheet.absoluteFill, animatedOrbit2Style]}
            >
              <View
                style={[
                  styles.orbitDot,
                  {
                    bottom: 40,
                    right: 40,
                    backgroundColor: colors.secondary,
                    width: 8,
                    height: 8,
                  },
                ]}
              />
            </Animated.View>
          </View>
        </View>

        <View style={styles.statusBlock}>
          <Text style={styles.statusHeading}>Finding your opponent...</Text>

          <View style={styles.badgeRow}>
            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>Blitz • 3 | 2</Text>
            </View>
            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>1200 - 1400 ELO</Text>
            </View>
          </View>

          <View style={styles.bentoContainer}>
            <View style={styles.glassCard}>
              <Text style={styles.glassCardLabel}>ESTIMATED</Text>
              <Text style={[styles.glassCardValue, { color: colors.primary }]}>
                {formatTime(seconds)}
              </Text>
            </View>
            <View style={styles.glassCard}>
              <Text style={styles.glassCardLabel}>ONLINE</Text>
              <Text
                style={[styles.glassCardValue, { color: colors.secondary }]}
              >
                4.2k
              </Text>
            </View>
          </View>

          <View style={styles.tipBox}>
            <Ionicons
              name="bulb"
              size={20}
              color={colors.primary}
              style={styles.tipIcon}
            />
            <Text style={styles.tipText}>
              <Text style={{ color: colors.textOnSurface, fontWeight: "700" }}>
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
              pressed && styles.tactileCancelButtonPressed,
            ]}
          >
            <Ionicons name="close" size={20} color={colors.softRed} />
            <Text style={styles.cancelText}>Cancel Search</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  masterWrapper: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10
  },
  topBarLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  circularIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: { color: colors.primary, fontSize: 22, fontWeight: "700" },
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
    borderColor: "rgba(159, 214, 104, 0.3)",
  },
  centralAnchor: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    elevation: 8,
    boxShadow: "0px 10px 12px rgba(0,0,0,0.3)",
  },
  orbitDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    boxShadow: "0px 0px 2px rgba(0,0,0,0.5)",
  },
  statusBlock: { paddingHorizontal: 24, alignItems: "center" },
  statusHeading: {
    color: colors.textOnSurface,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  badgeRow: { flexDirection: "row", gap: 8, marginBottom: 24 },
  metaBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  metaBadgeText: {
    color: colors.textOnSurfaceVariant,
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
    backgroundColor: "rgba(44, 41, 39, 0.6)",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  glassCardLabel: {
    color: colors.textOnSurfaceVariant,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 4,
  },
  glassCardValue: { fontSize: 24, fontWeight: "700" },
  tipBox: {
    flexDirection: "row",
    backgroundColor: colors.surfaceContainerLow,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: "rgba(159, 214, 104, 0.5)",
    width: "100%",
    maxWidth: 360,
    alignItems: "flex-start",
    marginBottom: 24,
  },
  tipIcon: { marginRight: 10, marginTop: 2 },
  tipText: {
    color: colors.textOnSurfaceVariant,
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
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderBottomWidth: 3,
    borderBottomColor: "rgba(0,0,0,0.3)",
  },
  tactileCancelButtonPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 1,
  },
  cancelText: { color: colors.textOnSurface, fontSize: 16, fontWeight: "700" },
});