/**
 * HBPlus Design System Tokens (2026 Executive Workforce Aesthetic)
 * Mood: Modern Fintech meets People-Ops (Linear / Stripe / Apple Health)
 */

export const lightTheme = {
  // Brand Iris & Aqua
  primary: '#5B5BF0',
  primaryHover: '#4A3DF0',
  primaryDeep: '#3B2FD1',
  primarySoft: '#ECEBFF',
  primaryBorder: '#D2D0FF',

  accent: '#14C8D9',
  accentSoft: '#E4FAFC',
  violet: '#8B5CF6',
  violetSoft: '#F3E8FF',

  // Surfaces & Backgrounds
  bg: '#F5F6FB',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF0F8',
  surfaceElevated: '#FFFFFF',
  surfaceGlass: 'rgba(255, 255, 255, 0.88)',
  border: '#E3E6F0',
  borderSubtle: '#F0F2F9',
  borderStrong: '#CBD2E6',

  // Typography
  text: '#0E1330',
  textMuted: '#5B6385',
  textSubtle: '#8A91AD',
  textInverse: '#FFFFFF',

  // Semantic
  success: '#16B364',
  successSoft: '#E3F8EC',
  successText: '#0B7A42',

  warning: '#F5A524',
  warningSoft: '#FFF3DC',
  warningText: '#9E6206',

  danger: '#F04438',
  dangerSoft: '#FDE8E6',
  dangerText: '#B42318',

  info: '#2E90FA',
  infoSoft: '#E1F0FF',
  infoText: '#175CD3',

  // Gradients (CSS / LinearGradient specs)
  gradientPrimary: ['#6A5CFF', '#4A3DF0', '#2F8BFF'],
  gradientAurora: ['#8B5CF6', '#5B5BF0', '#14C8D9'],
  gradientSuccess: ['#34D399', '#16B364'],
  gradientWarm: ['#FF8A65', '#F5A524'],
  gradientGlass: ['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.75)'],

  // Feature Tints (Soft colored tiles for icons)
  tints: {
    dashboard: { bg: '#ECEBFF', text: '#5B5BF0', border: '#D2D0FF' },
    directory: { bg: '#F3E8FF', text: '#8B5CF6', border: '#E9D5FF' },
    attendance: { bg: '#E3F8EC', text: '#16B364', border: '#B5E8CE' },
    leave: { bg: '#E4FAFC', text: '#0EA5B8', border: '#B8EFF4' },
    shifts: { bg: '#E1F0FF', text: '#2E90FA', border: '#B8DBFF' },
    payroll: { bg: '#F1EAFF', text: '#7C3AED', border: '#DDD6FE' },
    tasks: { bg: '#E3F8EC', text: '#16B364', border: '#B5E8CE' },
    performance: { bg: '#FFF3DC', text: '#D97706', border: '#FDE68A' },
    announcements: { bg: '#FDE8E8', text: '#E11D48', border: '#FECDD3' },
    documents: { bg: '#EEF0F8', text: '#475569', border: '#CBD5E1' },
    helpdesk: { bg: '#E0F2FE', text: '#0284C7', border: '#BAE6FD' },
    reports: { bg: '#E0E7FF', text: '#4F46E5', border: '#C7D2FE' },
    settings: { bg: '#EEF0F8', text: '#5B6385', border: '#CBD5E1' }
  }
};

export const darkTheme = {
  // Brand Iris & Aqua (Tuned for dark surfaces)
  primary: '#7B7BFF',
  primaryHover: '#8E8EFF',
  primaryDeep: '#5B5BF0',
  primarySoft: '#1F2250',
  primaryBorder: 'rgba(123, 123, 255, 0.35)',

  accent: '#3DDCEB',
  accentSoft: 'rgba(61, 220, 235, 0.15)',
  violet: '#A78BFA',
  violetSoft: 'rgba(167, 139, 250, 0.15)',

  // Surfaces & Backgrounds
  bg: '#080B16',
  surface: '#111631',
  surfaceAlt: '#1A2040',
  surfaceElevated: '#1A2040',
  surfaceGlass: 'rgba(17, 22, 49, 0.90)',
  border: '#262D52',
  borderSubtle: '#1C2344',
  borderStrong: '#3A4478',

  // Typography
  text: '#F2F4FF',
  textMuted: '#A3ABD0',
  textSubtle: '#6E769C',
  textInverse: '#080B16',

  // Semantic
  success: '#34D399',
  successSoft: 'rgba(52, 211, 153, 0.15)',
  successText: '#6EE7B7',

  warning: '#FBBF24',
  warningSoft: 'rgba(251, 191, 36, 0.15)',
  warningText: '#FDE68A',

  danger: '#F87171',
  dangerSoft: 'rgba(248, 113, 113, 0.15)',
  dangerText: '#FECACA',

  info: '#60A5FA',
  infoSoft: 'rgba(96, 165, 250, 0.15)',
  infoText: '#BFDBFE',

  // Gradients
  gradientPrimary: ['#7B7BFF', '#5B5BF0', '#3B82F6'],
  gradientAurora: ['#8B5CF6', '#5B5BF0', '#3DDCEB'],
  gradientSuccess: ['#34D399', '#059669'],
  gradientWarm: ['#FB923C', '#F59E0B'],
  gradientGlass: ['rgba(17, 22, 49, 0.95)', 'rgba(17, 22, 49, 0.80)'],

  // Feature Tints (Dark)
  tints: {
    dashboard: { bg: 'rgba(123, 123, 255, 0.15)', text: '#A5A5FF', border: 'rgba(123, 123, 255, 0.3)' },
    directory: { bg: 'rgba(167, 139, 250, 0.15)', text: '#C4B5FD', border: 'rgba(167, 139, 250, 0.3)' },
    attendance: { bg: 'rgba(52, 211, 153, 0.15)', text: '#6EE7B7', border: 'rgba(52, 211, 153, 0.3)' },
    leave: { bg: 'rgba(61, 220, 235, 0.15)', text: '#67E8F9', border: 'rgba(61, 220, 235, 0.3)' },
    shifts: { bg: 'rgba(96, 165, 250, 0.15)', text: '#93C5FD', border: 'rgba(96, 165, 250, 0.3)' },
    payroll: { bg: 'rgba(167, 139, 250, 0.15)', text: '#DDD6FE', border: 'rgba(167, 139, 250, 0.3)' },
    tasks: { bg: 'rgba(52, 211, 153, 0.15)', text: '#6EE7B7', border: 'rgba(52, 211, 153, 0.3)' },
    performance: { bg: 'rgba(251, 191, 36, 0.15)', text: '#FDE68A', border: 'rgba(251, 191, 36, 0.3)' },
    announcements: { bg: 'rgba(244, 63, 94, 0.15)', text: '#FDA4AF', border: 'rgba(244, 63, 94, 0.3)' },
    documents: { bg: 'rgba(148, 163, 184, 0.15)', text: '#CBD5E1', border: 'rgba(148, 163, 184, 0.3)' },
    helpdesk: { bg: 'rgba(56, 189, 248, 0.15)', text: '#7DD3FC', border: 'rgba(56, 189, 248, 0.3)' },
    reports: { bg: 'rgba(129, 140, 248, 0.15)', text: '#A5B4FC', border: 'rgba(129, 140, 248, 0.3)' },
    settings: { bg: 'rgba(148, 163, 184, 0.15)', text: '#CBD5E1', border: 'rgba(148, 163, 184, 0.3)' }
  }
};

export const typography = {
  fonts: {
    display: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', Menlo, monospace"
  },
  displayXL: { fontSize: 36, lineHeight: 42, fontWeight: '800', letterSpacing: -1.0 },
  display: { fontSize: 30, lineHeight: 36, fontWeight: '800', letterSpacing: -0.6 },
  title1: { fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: -0.3 },
  title2: { fontSize: 18, lineHeight: 24, fontWeight: '700', letterSpacing: -0.2 },
  headline: { fontSize: 16, lineHeight: 22, fontWeight: '600', letterSpacing: 0 },
  body: { fontSize: 14, lineHeight: 20, fontWeight: '400', letterSpacing: 0 },
  bodyStrong: { fontSize: 14, lineHeight: 20, fontWeight: '600', letterSpacing: 0 },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 0.1 },
  overline: { fontSize: 11, lineHeight: 14, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' }
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 56
};

export const borderRadius = {
  chip: 10,
  sm: 10,
  input: 14,
  md: 14,
  btn: 16,
  lg: 16,
  card: 22,
  xl: 22,
  hero: 26,
  xxl: 26,
  sheet: 30,
  full: 9999
};

export const shadows = {
  sm: {
    shadowColor: '#0E1330',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  md: {
    shadowColor: '#0E1330',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4
  },
  lg: {
    shadowColor: '#3C32C8',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 36,
    elevation: 8
  },
  glow: {
    shadowColor: '#5B5BF0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 6
  }
};

export default {
  lightTheme,
  darkTheme,
  typography,
  spacing,
  borderRadius,
  shadows
};
