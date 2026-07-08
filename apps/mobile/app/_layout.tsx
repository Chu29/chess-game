import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const colors = {
  barBackground: "#1C1B19",
  activePill: "#8FC24A",
  activeText: "#1C1B19",
  inactiveIcon: "#C9CBC5",
  inactiveText: "#9A9C96",
};

type TabKey = "lobby" | "play" | "learn" | "profile";

const TABS: {
  key: TabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: "lobby", label: "Lobby", icon: "home" },
  { key: "play", label: "Play", icon: "game-controller-outline" },
  { key: "learn", label: "Learn", icon: "school-outline" },
  { key: "profile", label: "Profile", icon: "person-outline" },
];

export default function RootLayout() {
  const [activeTab, setActiveTab] = useState<TabKey>("lobby");

  return (
    <View style={{ flex: 1, backgroundColor: "#0B0F14" }}>
      {/* Rest of your screen content would go here */}
      <View style={{ flex: 1 }} />

      <View style={styles.container}>
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tab, isActive && styles.activeTabPill]}
            >
              <Ionicons
                name={tab.icon}
                size={22}
                color={isActive ? colors.activeText : colors.inactiveIcon}
              />
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.barBackground,
    borderRadius: 28,
    padding: 8,
    marginHorizontal: 16,
    marginBottom: 24,
    justifyContent: "space-between",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  activeTabPill: {
    backgroundColor: colors.activePill,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.inactiveText,
    marginTop: 4,
  },
  activeLabel: {
    color: colors.activeText,
    fontWeight: "600",
  },
});

// const colors = {
//   background: '#0D110F',
//   iconBg: '#1A211C',
//   green: '#8FC24A',
//   greenGlow: 'rgba(143, 194, 74, 0.35)',
//   white: '#F2F4F0',
//   textSecondary: '#8A9086',
//   badgeBorder: '#2A322C',
//   badgeBg: '#161B17',
// };

// export default function RootLayout() {
//   const iconScale = useRef(new Animated.Value(0.7)).current;
//   const iconFade = useRef(new Animated.Value(0)).current;
//   const glowPulse = useRef(new Animated.Value(0)).current;
//   const dotPulse = useRef(new Animated.Value(0)).current;
//   const titleFade = useRef(new Animated.Value(0)).current;
//   const titleSlide = useRef(new Animated.Value(12)).current;
//   const subtitleFade = useRef(new Animated.Value(0)).current;
//   const spinnerRotate = useRef(new Animated.Value(0)).current;
//   const readyFade = useRef(new Animated.Value(0)).current;
//   const badgeFade = useRef(new Animated.Value(0)).current;
//   const badgeSlide = useRef(new Animated.Value(10)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.spring(iconScale, {
//         toValue: 1,
//         friction: 6,
//         tension: 45,
//         useNativeDriver: true,
//       }),
//       Animated.timing(iconFade, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(glowPulse, {
//           toValue: 1,
//           duration: 1600,
//           easing: Easing.inOut(Easing.sin),
//           useNativeDriver: true,
//         }),
//         Animated.timing(glowPulse, {
//           toValue: 0,
//           duration: 1600,
//           easing: Easing.inOut(Easing.sin),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(dotPulse, {
//           toValue: 1,
//           duration: 900,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(dotPulse, {
//           toValue: 0,
//           duration: 900,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     Animated.sequence([
//       Animated.delay(250),
//       Animated.parallel([
//         Animated.timing(titleFade, {
//           toValue: 1,
//           duration: 500,
//           useNativeDriver: true,
//         }),
//         Animated.timing(titleSlide, {
//           toValue: 0,
//           duration: 500,
//           easing: Easing.out(Easing.cubic),
//           useNativeDriver: true,
//         }),
//       ]),
//       Animated.timing(subtitleFade, {
//         toValue: 1,
//         duration: 450,
//         useNativeDriver: true,
//       }),
//       Animated.delay(200),
//       Animated.timing(readyFade, {
//         toValue: 1,
//         duration: 400,
//         useNativeDriver: true,
//       }),
//       Animated.parallel([
//         Animated.timing(badgeFade, {
//           toValue: 1,
//           duration: 450,
//           useNativeDriver: true,
//         }),
//         Animated.timing(badgeSlide, {
//           toValue: 0,
//           duration: 450,
//           easing: Easing.out(Easing.cubic),
//           useNativeDriver: true,
//         }),
//       ]),
//     ]).start();

//     Animated.loop(
//       Animated.timing(spinnerRotate, {
//         toValue: 1,
//         duration: 1100,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       })
//     ).start();
//   }, []);

//   const glowOpacity = glowPulse.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0.4, 0.9],
//   });
//   const glowScale = glowPulse.interpolate({
//     inputRange: [0, 1],
//     outputRange: [1, 1.15],
//   });
//   const dotOpacity = dotPulse.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0.4, 1],
//   });
//   const spin = spinnerRotate.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });

//   return (
//     <View style={styles.container}>
//       <View style={styles.iconWrapper}>
//         <Animated.View
//           style={[
//             styles.glow,
//             { opacity: glowOpacity, transform: [{ scale: glowScale }] },
//           ]}
//         />
//         <Animated.View
//           style={[
//             styles.iconBox,
//             { opacity: iconFade, transform: [{ scale: iconScale }] },
//           ]}
//         >
//           <Text style={styles.iconGlyph}>♜</Text>
//         </Animated.View>
//         <Animated.View style={[styles.cornerDot, { opacity: dotOpacity }]} />
//       </View>

//       <Animated.Text
//         style={[
//           styles.title,
//           { opacity: titleFade, transform: [{ translateY: titleSlide }] },
//         ]}
//       >
//         Chuvinjab Chess
//       </Animated.Text>

//       <Animated.Text style={[styles.subtitle, { opacity: subtitleFade }]}>
//         Master the game of kings through{'\n'}modern strategic mastery.
//       </Animated.Text>

//       <View style={styles.bottomSection}>
//         <View style={styles.spinnerTrack}>
//           <Animated.View
//             style={[styles.spinnerArc, { transform: [{ rotate: spin }] }]}
//           />
//         </View>
//         <Animated.Text style={[styles.readyText, { opacity: readyFade }]}>
//           READY TO PLAY
//         </Animated.Text>
//         <Animated.View
//           style={[
//             styles.badge,
//             { opacity: badgeFade, transform: [{ translateY: badgeSlide }] },
//           ]}
//         >
//           <Text style={styles.badgeCheck}>✓</Text>
//           <Text style={styles.badgeText}>Grandmaster Grade AI</Text>
//         </Animated.View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 32,
//   },
//   iconWrapper: {
//     width: 96,
//     height: 96,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 28,
//   },
//   glow: {
//     position: 'absolute',
//     width: 110,
//     height: 110,
//     borderRadius: 55,
//     backgroundColor: colors.greenGlow,
//   },
//   iconBox: {
//     width: 84,
//     height: 84,
//     borderRadius: 22,
//     backgroundColor: colors.iconBg,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   iconGlyph: {
//     fontSize: 42,
//     color: colors.green,
//   },
//   cornerDot: {
//     position: 'absolute',
//     top: 6,
//     right: 12,
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: colors.green,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: colors.white,
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   bottomSection: {
//     position: 'absolute',
//     bottom: 70,
//     alignItems: 'center',
//   },
//   spinnerTrack: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     borderWidth: 3,
//     borderColor: 'rgba(143, 194, 74, 0.15)',
//     marginBottom: 14,
//   },
//   spinnerArc: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     borderWidth: 3,
//     borderColor: 'transparent',
//     borderTopColor: colors.green,
//     borderRightColor: colors.green,
//   },
//   readyText: {
//     fontSize: 12,
//     fontWeight: '700',
//     letterSpacing: 1.5,
//     color: colors.green,
//     marginBottom: 16,
//   },
//   badge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.badgeBg,
//     borderWidth: 1,
//     borderColor: colors.badgeBorder,
//     borderRadius: 20,
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//   },
//   badgeCheck: {
//     color: colors.green,
//     fontSize: 12,
//     marginRight: 6,
//   },
//   badgeText: {
//     fontSize: 12,
//     color: colors.textSecondary,
//     fontWeight: '500',
//   },
// });
