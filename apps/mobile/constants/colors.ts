/**
 * Chess Academy — Color Tokens
 * Single source of truth for the app's dark, premium theme.
 * Also mirrored in tailwind.config.js under `theme.extend.colors.academy`.
 */
export const colors = {
  background: '#0F0F0F',
  surface: '#1A1A1A',
  surfaceElevated: '#212121',
  border: '#2A2A2A',
  accent: '#B7FF3C',
  accentMuted: 'rgba(183, 255, 60, 0.12)',
  textPrimary: '#FFFFFF',
  textSecondary: '#BDBDBD',
  textTertiary: '#7A7A7A',
  danger: '#FF6B6B',
  warning: '#FFC24B',
  success: '#4BDE97',
  overlay: 'rgba(0, 0, 0, 0.6)',
} as const;

export const difficultyColors = {
  beginner: '#4BDE97',
  intermediate: '#FFC24B',
  advanced: '#FF6B6B',
} as const;

export type ColorToken = keyof typeof colors;
