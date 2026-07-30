import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useAudioPlayer, setAudioModeAsync, AudioPlayer } from "expo-audio";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sfxAssets, musicAssets, SfxName } from "../constants/sounds";

const MUTE_STORAGE_KEY = "chess:sound:muted";

interface SoundContextValue {
  playSfx: (name: SfxName) => void;
  musicPlayer: AudioPlayer;
  muted: boolean;
  setMuted: (muted: boolean) => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMutedState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const captureSfx = useAudioPlayer(sfxAssets.capture);
  const checkSfx = useAudioPlayer(sfxAssets.check);
  const gameEndSfx = useAudioPlayer(sfxAssets.gameEnd);

  const musicPlayer = useAudioPlayer(musicAssets.lobby);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: false,
      interruptionMode: "duckOthers",
    }).catch(() => {});

    musicPlayer.loop = true;
    musicPlayer.volume = 0.35;
  }, [musicPlayer]);

  useEffect(() => {
    AsyncStorage.getItem(MUTE_STORAGE_KEY)
      .then((value) => {
        if (value === "true") setMutedState(true);
      })
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    musicPlayer.volume = muted ? 0 : 0.35;
    [captureSfx, checkSfx, gameEndSfx].forEach((p) => {
      p.volume = muted ? 0 : 1;
    });
    AsyncStorage.setItem(MUTE_STORAGE_KEY, muted ? "true" : "false").catch(
      () => {},
    );
  }, [muted, hydrated, musicPlayer, captureSfx, checkSfx, gameEndSfx]);

  const setMuted = useCallback((value: boolean) => setMutedState(value), []);

  const playSfx = useCallback(
    (name: SfxName) => {
      if (muted) return;
      const player = {
        capture: captureSfx,
        check: checkSfx,
        gameEnd: gameEndSfx,
      }[name];
      player.seekTo(0);
      player.play();
    },
    [muted, captureSfx, checkSfx, gameEndSfx],
  );

  const value = useMemo<SoundContextValue>(
    () => ({ playSfx, musicPlayer, muted, setMuted }),
    [playSfx, musicPlayer, muted, setMuted],
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return ctx;
}
