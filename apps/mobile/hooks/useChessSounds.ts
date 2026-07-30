import { useEffect, useState } from "react";
import { Audio } from "expo-av";

export function useChessSounds() {
  const [moveSound, setMoveSound] = useState<Audio.Sound | null>(null);
  const [captureSound, setCaptureSound] = useState<Audio.Sound | null>(null);
  const [checkSound, setCheckSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadSounds() {
      try {
        const { sound: move } = await Audio.Sound.createAsync(
          require("../assets/sounds/move.mp3"),
        );
        const { sound: capture } = await Audio.Sound.createAsync(
          require("../assets/sounds/capture.mp3"),
        );
        const { sound: check } = await Audio.Sound.createAsync(
          require("../assets/sounds/check.mp3"),
        );
        if (isMounted) {
          setMoveSound(move);
          setCaptureSound(capture);
          setCheckSound(check);
        } else {
          move.unloadAsync();
          capture.unloadAsync();
          check.unloadAsync();
        }
      } catch (error) {
        console.warn("Failed to load chess sounds", error);
      }
    }
    loadSounds();
    return () => {
      isMounted = false;
      if (moveSound) moveSound.unloadAsync();
      if (captureSound) captureSound.unloadAsync();
      if (checkSound) checkSound.unloadAsync();
    };
  }, []);

  const playMove = async () => {
    try {
      if (moveSound) {
        await moveSound.setPositionAsync(0);
        await moveSound.playAsync();
      }
    } catch (e) {}
  };

  const playCapture = async () => {
    try {
      if (captureSound) {
        await captureSound.setPositionAsync(0);
        await captureSound.playAsync();
      }
    } catch (e) {}
  };

  const playCheck = async () => {
    try {
      if (checkSound) {
        await checkSound.setPositionAsync(0);
        await checkSound.playAsync();
      }
    } catch (e) {}
  };

  return { playMove, playCapture, playCheck };
}
