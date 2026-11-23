import { lightTheme } from '../theme/tokens.js';

export const colors = {
  primary: lightTheme.primary,
  primaryLight: lightTheme.primarySoft,
  primaryDark: lightTheme.primaryDeep,
  accent: lightTheme.accent,
  violet: lightTheme.violet,

  background: lightTheme.bg,
  surface: lightTheme.surface,
  surfaceLight: lightTheme.surfaceAlt,

  textPrimary: lightTheme.text,
  textSecondary: lightTheme.textMuted,
  textDisabled: lightTheme.textSubtle,
  textOnPrimary: lightTheme.textInverse,

  border: lightTheme.border,
  borderLight: lightTheme.borderSubtle,
  divider: lightTheme.border,

  success: lightTheme.success,
  successBg: lightTheme.successSoft,
  warning: lightTheme.warning,
  warningBg: lightTheme.warningSoft,
  error: lightTheme.danger,
  errorBg: lightTheme.dangerSoft,
  info: lightTheme.info,
  infoBg: lightTheme.infoSoft
};

export default colors;
