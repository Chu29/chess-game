import { TextStyle } from 'react-native';

/**
 * Type scale tuned for an educational, editorial feel (Chess.com / Duolingo hybrid).
 * Use with NativeWind via the `academy-*` font-size utilities defined in tailwind.config.js,
 * or directly as style objects where dynamic type scaling matters.
 */
export const typography: Record<string, TextStyle> = {
  displayLarge: { fontSize: 34, fontWeight: '800', letterSpacing: -0.5, lineHeight: 40 },
  displayMedium: { fontSize: 28, fontWeight: '800', letterSpacing: -0.3, lineHeight: 34 },
  title: { fontSize: 22, fontWeight: '700', letterSpacing: -0.2, lineHeight: 28 },
  subtitle: { fontSize: 17, fontWeight: '600', lineHeight: 22 },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
  bodyStrong: { fontSize: 15, fontWeight: '600', lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
  overline: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, lineHeight: 14 },
};

// Respect the OS "Larger Text" accessibility setting by default on all Text components.
export const allowFontScaling = true;
