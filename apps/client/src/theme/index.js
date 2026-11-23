/**
 * HBPlus Design System Tokens (2026 Premium Fintech/SaaS Aesthetic)
 * Supporting Light & Dark modes, 8pt spatial grid, fluid typography.
 */

export const lightPalette = {
  // Brand Emerald Gradient
  primary: '#10B981',
  primaryHover: '#059669',
  primaryDark: '#047857',
  primaryLight: '#34D399',
  primarySubtle: '#ECFDF5',
  primaryBorder: '#A7F3D0',

  // Surfaces & Backgrounds
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  surfaceElevated: '#FFFFFF',
  surfaceGlass: 'rgba(255, 255, 255, 0.85)',
  border: '#E2E8F0',
  borderSubtle: '#F1F5F9',
  borderStrong: '#CBD5E1',

  // Typography
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  // Semantic
  success: '#10B981',
  successSubtle: '#ECFDF5',
  successText: '#065F46',
  warning: '#F59E0B',
  warningSubtle: '#FFFBEB',
  warningText: '#92400E',
  danger: '#EF4444',
  dangerSubtle: '#FEF2F2',
  dangerText: '#991B1B',
  info: '#3B82F6',
  infoSubtle: '#EFF6FF',
  infoText: '#1E40AF',

  // Accents
  accentPurple: '#8B5CF6',
  accentPink: '#EC4899',
  accentCyan: '#06B6D4'
};

export const darkPalette = {
  // Brand Emerald Gradient (tuned for dark surfaces)
  primary: '#10B981',
  primaryHover: '#34D399',
  primaryDark: '#059669',
  primaryLight: '#6EE7B7',
  primarySubtle: 'rgba(16, 185, 129, 0.15)',
  primaryBorder: 'rgba(52, 211, 153, 0.3)',

  // Surfaces & Backgrounds
  background: '#0B1120',
  surface: '#131D31',
  surfaceSubtle: '#1E293B',
  surfaceElevated: '#1E293B',
  surfaceGlass: 'rgba(19, 29, 49, 0.85)',
  border: '#1E293B',
  borderSubtle: '#1E293B',
  borderStrong: '#334155',

  // Typography
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#64748B',
  textInverse: '#0B1120',

  // Semantic
  success: '#34D399',
  successSubtle: 'rgba(52, 211, 153, 0.15)',
  successText: '#A7F3D0',
  warning: '#FBBF24',
  warningSubtle: 'rgba(251, 191, 36, 0.15)',
  warningText: '#FDE68A',
  danger: '#F87171',
  dangerSubtle: 'rgba(248, 113, 113, 0.15)',
  dangerText: '#FECACA',
  info: '#60A5FA',
  infoSubtle: 'rgba(96, 165, 250, 0.15)',
  infoText: '#BFDBFE',

  // Accents
  accentPurple: '#A78BFA',
  accentPink: '#F472B6',
  accentCyan: '#22D3EE'
};

export const typography = {
  fonts: {
    regular: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    bold: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  sizes: {
    display: 32,
    title: 22,
    subtitle: 18,
    body: 15,
    callout: 14,
    caption: 12,
    micro: 10
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800'
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64
};

export const borderRadius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24,
  xxl: 28,
  full: 9999
};

export const shadows = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4
  },
  elevated: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 8
  },
  glow: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6
  }
};

export default {
  lightPalette,
  darkPalette,
  typography,
  spacing,
  borderRadius,
  shadows
};
