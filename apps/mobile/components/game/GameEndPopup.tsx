import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { useTheme } from "../../context/ThemeContext";

export type GameEndResult = "WIN" | "LOSS" | "DRAW";

interface GameEndPopupProps {
  visible: boolean;
  result: GameEndResult;
  reason?: string;
  primaryButtonLabel?: string;
  onPrimaryAction?: () => void;
  secondaryButtonLabel?: string;
  onSecondaryAction?: () => void;
  isRematchOffered?: boolean;
  isRematchOfferedByMe?: boolean;
  onAcceptRematch?: () => void;
  onDeclineRematch?: () => void;
}

export function GameEndPopup({
  visible,
  result,
  reason = "Game Ended",
  primaryButtonLabel = "Lobby",
  onPrimaryAction,
  secondaryButtonLabel = "View Board",
  onSecondaryAction,
  isRematchOffered,
  isRematchOfferedByMe,
  onAcceptRematch,
  onDeclineRematch,
}: GameEndPopupProps) {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();

  // Reset confetti on visible toggle
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (visible) {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        {showConfetti && result === "WIN" && (
          <ConfettiCannon
            count={150}
            origin={{ x: width / 2, y: height }}
            autoStart={true}
            fadeOut={true}
            fallSpeed={2500}
            explosionSpeed={500}
          />
        )}

        {showConfetti && result === "LOSS" && (
          <ConfettiCannon
            count={80}
            origin={{ x: width / 2, y: -50 }}
            autoStart={true}
            fadeOut={true}
            colors={["#879bbd", "#647796", "#45546b"]}
            fallSpeed={4000}
            explosionSpeed={100}
            spread={width}
            // Simulating tears/rain with narrow confetti if possible, or just standard shapes
          />
        )}

        <Animated.View
          entering={ZoomIn.duration(400).springify()}
          exiting={ZoomOut.duration(300)}
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                color:
                  result === "WIN"
                    ? colors.green
                    : result === "LOSS"
                      ? "#D9534F"
                      : colors.textPrimary,
              },
            ]}
          >
            {result === "WIN"
              ? "Victory!"
              : result === "LOSS"
                ? "Defeat"
                : "Draw"}
          </Text>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {reason}
          </Text>

          {isRematchOffered && isRematchOfferedByMe ? (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Waiting for opponent...
            </Text>
          ) : isRematchOffered && !isRematchOfferedByMe ? (
            <>
              <Text
                style={[
                  styles.subtitle,
                  { color: colors.green, fontWeight: "700" },
                ]}
              >
                Opponent wants a rematch!
              </Text>
              <View style={styles.buttonRow}>
                <Pressable
                  onPress={onDeclineRematch}
                  style={[
                    styles.button,
                    styles.secondaryButton,
                    { borderColor: "#D9534F" },
                  ]}
                >
                  <Text style={[styles.buttonText, { color: "#D9534F" }]}>
                    Decline
                  </Text>
                </Pressable>
                <Pressable
                  onPress={onAcceptRematch}
                  style={[
                    styles.button,
                    styles.primaryButton,
                    { backgroundColor: colors.green },
                  ]}
                >
                  <Text style={[styles.buttonText, { color: "#1B3310" }]}>
                    Accept
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <View style={styles.buttonRow}>
              {onSecondaryAction && (
                <Pressable
                  onPress={onSecondaryAction}
                  style={[
                    styles.button,
                    styles.secondaryButton,
                    { borderColor: colors.cardBorder },
                  ]}
                >
                  <Text
                    style={[styles.buttonText, { color: colors.textPrimary }]}
                  >
                    {secondaryButtonLabel}
                  </Text>
                </Pressable>
              )}
              {onPrimaryAction && (
                <Pressable
                  onPress={onPrimaryAction}
                  style={[
                    styles.button,
                    styles.primaryButton,
                    { backgroundColor: colors.green },
                  ]}
                >
                  <Text style={[styles.buttonText, { color: "#1B3310" }]}>
                    {primaryButtonLabel}
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "80%",
    maxWidth: 320,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  primaryButton: {},
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
