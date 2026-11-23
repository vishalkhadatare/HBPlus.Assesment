import React, { createContext, useContext } from 'react';
import { CARD_RADIUS } from './shape.js';

/**
 * Role Theme Definitions (Section 3)
 * Admin = "Control" (Authoritative, precise, data-dense)
 * User = "Workspace" (Friendly, calm, personal)
 */
export const ROLE_THEME = {
  admin: {
    role: 'admin',
    label: 'Admin',
    personality: 'Authoritative, precise, data-dense',
    pageTint: ['#E9F1F1', '#DCE9EB'],
    pageBgGradient: 'linear-gradient(180deg, #E9F1F1 0%, #DCE9EB 100%)',
    pageBgColor: '#E9F1F1',
    primary: '#00775B',
    secondary: '#0E3B5C',
    buttonGradient: ['#00775B', '#0E3B5C'],
    buttonGradientCss: 'linear-gradient(135deg, #00775B 0%, #0E3B5C 100%)',
    buttonGlow: 'rgba(0, 119, 91, 0.28)',
    cardTint: 'rgba(255, 255, 255, 0.72)',
    cardShadow: 'rgba(14, 59, 92, 0.08)',
    cardShadowStyle: {
      shadowColor: '#0E3B5C',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
      elevation: 0
    },
    inputFill: '#E3ECEE',
    inputFocusFill: '#DBE6E8',
    roleIcon: 'shieldCheck',
    roleBadge: {
      bg: '#00775B',
      text: '#FFFFFF',
      icon: 'shieldCheck',
      label: 'Admin'
    },
    density: 'compact',
    rowHeight: 44,
    gap: 12,
    motion: { duration: 200, spring: 'snappy' },
    identityStrip: '#00775B',
    sidebarBg: '#0B2B27',
    sidebarText: '#ECFBF6',
    activeNavHighlight: '#00B386',
    cardRadius: CARD_RADIUS
  },
  user: {
    role: 'user',
    label: 'User',
    personality: 'Friendly, calm, personal',
    pageTint: ['#F5FBF7', '#E6F6EE'],
    pageBgGradient: 'linear-gradient(180deg, #F5FBF7 0%, #E6F6EE 100%)',
    pageBgColor: '#F5FBF7',
    primary: '#00B386',
    secondary: '#FFB020',
    buttonGradient: ['#00D9A5', '#00B386'],
    buttonGradientCss: 'linear-gradient(135deg, #00D9A5 0%, #00B386 100%)',
    buttonGlow: 'rgba(0, 179, 134, 0.25)',
    cardTint: 'rgba(255, 255, 255, 0.78)',
    cardShadow: 'rgba(0, 119, 91, 0.07)',
    cardShadowStyle: {
      shadowColor: '#00775B',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.07,
      shadowRadius: 24,
      elevation: 0
    },
    inputFill: '#E8F2EE',
    inputFocusFill: '#DFEDE8',
    roleIcon: 'userCircle',
    roleBadge: {
      bg: '#FFF7E6',
      text: '#B57400',
      icon: 'userCircle',
      label: 'User'
    },
    density: 'comfortable',
    rowHeight: 60,
    gap: 20,
    motion: { duration: 320, spring: 'bouncy' },
    identityStrip: '#FFB020',
    sidebarBg: 'rgba(255, 255, 255, 0.85)',
    sidebarText: '#0F172A',
    activeNavHighlight: '#00B386',
    cardRadius: CARD_RADIUS
  }
};

export const RoleThemeContext = createContext(ROLE_THEME.user);

export function RoleThemeProvider({ role = 'user', children }) {
  const normalizedRole = (role || 'user').toLowerCase() === 'admin' ? 'admin' : 'user';
  const theme = ROLE_THEME[normalizedRole] || ROLE_THEME.user;

  return React.createElement(RoleThemeContext.Provider, { value: theme }, children);
}

export function useRoleTheme() {
  const theme = useContext(RoleThemeContext);
  return theme || ROLE_THEME.user;
}

export default ROLE_THEME;
