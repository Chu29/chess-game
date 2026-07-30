import { useEffect } from "react";
import { usePathname } from "expo-router";
import { useSound } from "../context/SoundContext";

const SILENT_ROUTE_PREFIXES = ["/game", "/play/ai"];

export function BackgroundMusicController() {
  const pathname = usePathname();
  const { musicPlayer, muted } = useSound();

  useEffect(() => {
    const shouldBeSilent = SILENT_ROUTE_PREFIXES.some((prefix) =>
      pathname?.startsWith(prefix),
    );

    if (muted || shouldBeSilent) {
      musicPlayer.pause();
    } else {
      musicPlayer.play();
    }
  }, [pathname, muted, musicPlayer]);

  return null;
}
