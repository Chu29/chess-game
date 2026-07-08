import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { colors } from "../constants/theme";

export default function SplashScreen() {
  const iconScale = useRef(new Animated.Value(0.7)).current;
  const iconFade = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;
  const dotPulse = useRef(new Animated.Value(0)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(12)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const spinnerRotate = useRef(new Animated.Value(0)).current;
  const readyFade = useRef(new Animated.Value(0)).current;
  const badgeFade = useRef(new Animated.Value(0)).current;
  const badgeSlide = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(iconScale, {
        toValue: 1,
        friction: 6,
        tension: 45,
        useNativeDriver: true,
      }),
      Animated.timing(iconFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(dotPulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(dotPulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.sequence([
      Animated.delay(250),
      Animated.parallel([
        Animated.timing(titleFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(titleSlide, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(subtitleFade, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.delay(200),
      Animated.timing(readyFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(badgeFade, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(badgeSlide, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.loop(
      Animated.timing(spinnerRotate, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const glowOpacity = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.9],
  });
  const glowScale = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });
  const dotOpacity = dotPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });
  const spin = spinnerRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Animated.View
          style={[
            styles.glow,
            { opacity: glowOpacity, transform: [{ scale: glowScale }] },
          ]}
        />
        <Animated.View
          style={[
            styles.iconBox,
            { opacity: iconFade, transform: [{ scale: iconScale }] },
          ]}
        >
          <Text style={styles.iconGlyph}>♜</Text>
        </Animated.View>
        <Animated.View style={[styles.cornerDot, { opacity: dotOpacity }]} />
      </View>

      <Animated.Text
        style={[
          styles.title,
          { opacity: titleFade, transform: [{ translateY: titleSlide }] },
        ]}
      >
        Chuvinjab Chess
      </Animated.Text>

      <Animated.Text style={[styles.subtitle, { opacity: subtitleFade }]}>
        Master the game of kings through{"\n"}modern strategic mastery.
      </Animated.Text>

      <View style={styles.bottomSection}>
        <View style={styles.spinnerTrack}>
          <Animated.View
            style={[styles.spinnerArc, { transform: [{ rotate: spin }] }]}
          />
        </View>
        <Animated.Text style={[styles.readyText, { opacity: readyFade }]}>
          READY TO PLAY
        </Animated.Text>
        <Animated.View
          style={[
            styles.badge,
            { opacity: badgeFade, transform: [{ translateY: badgeSlide }] },
          ]}
        >
          <Text style={styles.badgeCheck}>✓</Text>
          <Text style={styles.badgeText}>Grandmaster Grade AI</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  glow: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(143, 194, 74, 0.35)",
  },
  iconBox: {
    width: 84,
    height: 84,
    borderRadius: 22,
    backgroundColor: colors.greenDark,
    alignItems: "center",
    justifyContent: "center",
  },
  iconGlyph: {
    fontSize: 42,
    color: colors.green,
  },
  cornerDot: {
    position: "absolute",
    top: 6,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  bottomSection: {
    position: "absolute",
    bottom: 70,
    alignItems: "center",
  },
  spinnerTrack: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: "rgba(143, 194, 74, 0.15)",
    marginBottom: 14,
  },
  spinnerArc: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: "transparent",
    borderTopColor: colors.green,
    borderRightColor: colors.green,
  },
  readyText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: colors.green,
    marginBottom: 16,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  badgeCheck: {
    color: colors.green,
    fontSize: 12,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
});
