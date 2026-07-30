export const sfxAssets = {
  capture: require("../assets/sounds/sfx/capture.mp3"),
  check: require("../assets/sounds/sfx/check.mp3"),
  gameEnd: require("../assets/sounds/sfx/game-end.mp3"),
} as const;

export const musicAssets = {
  lobby: require("../assets/sounds/music/lobby-theme.mp3"),
} as const;

export type SfxName = keyof typeof sfxAssets;
