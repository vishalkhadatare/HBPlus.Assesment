/**
 * HBPlus Design System Tokens (Midnight, Emerald and Amber)
 * Mood: Modern Fintech meets Enterprise Security
 */

export const lightTheme = {
  // Brand Emerald & Amber
  primary: '#00B386',
  primaryHover: '#009973',
  primaryDeep: '#00775B',
  primarySoft: '#E0F8F1',
  primaryBorder: '#B2EADB',

  // 2025 Premium additions
  teal: '#14B8A6',
  tealDeep: '#0F766E',
  tealSoft: '#F0FDFA',
  adminPrimary: '#C2410C',
  adminPrimaryLight: '#F97316',
  adminPrimaryGlow: 'rgba(194, 65, 12, 0.28)',
  adminPrimaryGradient: 'linear-gradient(135deg, #F97316 0%, #C2410C 100%)',
  adminBg: '#FFF7ED',

  accent: '#FFB020',
  accentSoft: '#FFF7E6',
  accentDeep: '#E09200',
  violet: '#1D8CF8',
  violetSoft: '#E8F3FF',

  // Surfaces & Backgrounds
  bg: '#F4F8F7',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',
  surfaceElevated: '#FFFFFF',
  surfaceGlass: 'rgba(255, 255, 255, 0.95)',
  border: '#E2E8F0',
  borderSubtle: '#F1F5F9',
  borderStrong: '#CBD5E1',

  // Typography
  text: '#0A1A17',
  textMuted: '#51635E',
  textSubtle: '#7E918C',
  textInverse: '#FFFFFF',

  // Semantic
  success: '#16B364',
  successSoft: '#E3F8EC',
  successText: '#0B7A42',

  warning: '#F79009',
  warningSoft: '#FEF0C7',
  warningText: '#B54708',

  danger: '#F04438',
  dangerSoft: '#FEE4E2',
  dangerText: '#B42318',

  info: '#1D8CF8',
  infoSoft: '#E1F0FF',
  infoText: '#175CD3',

  // Gradients
  gradientBrand: ['#14B8A6', '#0F766E'],
  gradientNight: ['#04100E', '#07302A', '#0B5D4B'],
  gradientGold: ['#FFC857', '#FF9F1C'],
  gradientPrimary: ['#14B8A6', '#0F766E'],
  gradientAurora: ['#14B8A6', '#1D8CF8', '#FFB020'],
  gradientSuccess: ['#34D399', '#16B364'],
  gradientWarm: ['#FFC857', '#FF9F1C'],
  gradientGlass: ['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.75)'],

  // Feature Tints (Soft colored tiles for icons)
  tints: {
    dashboard: { bg: '#F0FDFA', text: '#14B8A6', border: '#99F6E4' },
    directory: { bg: '#E8F3FF', text: '#1D8CF8', border: '#BBDCFF' },
    attendance: { bg: '#FFF7E6', text: '#FFB020', border: '#FFE4A8' },
    leave: { bg: '#E3F8EC', text: '#16B364', border: '#B5E8CE' },
    shifts: { bg: '#E1F0FF', text: '#1D8CF8', border: '#B8DBFF' },
    payroll: { bg: '#FFF8E1', text: '#D97706', border: '#FDE68A' },
    tasks: { bg: '#F0FDFA', text: '#14B8A6', border: '#99F6E4' },
    performance: { bg: '#FFF3DC', text: '#D97706', border: '#FDE68A' },
    announcements: { bg: '#FEE4E2', text: '#F04438', border: '#FECDCA' },
    documents: { bg: '#F1F5F9', text: '#64748B', border: '#E2E8F0' },
    helpdesk: { bg: '#E0F2FE', text: '#0284C7', border: '#BAE6FD' },
    reports: { bg: '#E8F3FF', text: '#1D8CF8', border: '#BBDCFF' },
    settings: { bg: '#F1F5F9', text: '#64748B', border: '#E2E8F0' }
  }
};

export const darkTheme = {
  // Brand Emerald & Amber (Dark Mode Adjusted)
  primary: '#2EE6B6',
  primaryHover: '#00B386',
  primaryDeep: '#00B386',
  primarySoft: '#0E2B26',
  primaryBorder: '#1A4D43',

  accent: '#FFC857',
  accentSoft: '#33270A',
  accentDeep: '#FFB020',
  violet: '#5AB0FF',
  violetSoft: '#0C2640',

  // Surfaces & Backgrounds
  bg: '#06100E',
  surface: '#0D1B18',
  surfaceAlt: '#132622',
  surfaceElevated: '#172E29',
  surfaceGlass: 'rgba(13, 27, 24, 0.88)',
  border: '#1E332E',
  borderSubtle: '#152420',
  borderStrong: '#2A4740',

  // Typography
  text: '#ECFBF6',
  textMuted: '#9FB8B0',
  textSubtle: '#6A837C',
  textInverse: '#06100E',

  // Semantic
  success: '#32D583',
  successSoft: '#083321',
  successText: '#6CE9A6',

  warning: '#FEC84B',
  warningSoft: '#372007',
  warningText: '#FEDF89',

  danger: '#F97066',
  dangerSoft: '#3D110F',
  dangerText: '#FDA29B',

  info: '#5AB0FF',
  infoSoft: '#0C2640',
  infoText: '#84CAFF',

  // Gradients
  gradientBrand: ['#2EE6B6', '#00B386', '#1D8CF8'],
  gradientNight: ['#020807', '#041814', '#07302A'],
  gradientGold: ['#FFC857', '#FF9F1C'],
  gradientPrimary: ['#2EE6B6', '#00B386', '#1D8CF8'],
  gradientAurora: ['#2EE6B6', '#5AB0FF', '#FFC857'],
  gradientSuccess: ['#32D583', '#16B364'],
  gradientWarm: ['#FFC857', '#FF9F1C'],
  gradientGlass: ['rgba(13, 27, 24, 0.95)', 'rgba(13, 27, 24, 0.75)'],

  tints: {
    dashboard: { bg: '#0E2B26', text: '#2EE6B6', border: '#1A4D43' },
    directory: { bg: '#0C2640', text: '#5AB0FF', border: '#153A60' },
    attendance: { bg: '#33270A', text: '#FFC857', border: '#4D3B0F' },
    leave: { bg: '#083321', text: '#32D583', border: '#0F4D32' },
    shifts: { bg: '#1E332E', text: '#84CAFF', border: '#2A4740' },
    payroll: { bg: '#33270A', text: '#FFC857', border: '#4D3B0F' },
    tasks: { bg: '#0E2B26', text: '#2EE6B6', border: '#1A4D43' },
    performance: { bg: '#372007', text: '#FEDF89', border: '#52300B' },
    announcements: { bg: '#3D110F', text: '#FDA29B', border: '#5C1A17' },
    documents: { bg: '#132622', text: '#9FB8B0', border: '#1E332E' },
    helpdesk: { bg: '#0C2640', text: '#7DD3FC', border: '#153A60' },
    reports: { bg: '#0C2640', text: '#84CAFF', border: '#153A60' },
    settings: { bg: '#132622', text: '#9FB8B0', border: '#1E332E' }
  }
};

export const typography = {
  fonts: {
    display: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', Menlo, monospace"
  },
  fontFamily: {
    heading: 'Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
  },
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 36
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800'
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.65
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64
};

export const radius = {
  sm: 8,
  md: 12,
  input: 14,
  button: 16,
  lg: 18,
  card: 24,
  sheet: 32,
  full: 9999
};

export const borderRadius = radius;

export const shadows = {
  subtle: {
    // Native
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    // Web multi-layer
    boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 6px -1px rgba(0,0,0,0.04)'
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.08)'
  },
  modal: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 12,
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.10), 0 20px 40px -8px rgba(0,0,0,0.14)'
  }
};

export default {
  light: lightTheme,
  dark: darkTheme,
  typography,
  spacing,
  radius,
  shadows
};
