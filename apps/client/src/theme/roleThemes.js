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
    pageTint: ['#FAF6F2', '#F3ECE4'],
    pageBgGradient: 'linear-gradient(180deg, #FAF6F2 0%, #F3ECE4 100%)',
    pageBgColor: '#FAF6F2',
    primary: '#EA580C',
    secondary: '#FF6B00',
    buttonGradient: ['#FF7A1A', '#EA580C'],
    buttonGradientCss: 'linear-gradient(135deg, #FF7A1A 0%, #EA580C 100%)',
    buttonGlow: 'rgba(234, 88, 12, 0.32)',
    cardTint: 'rgba(255, 255, 255, 0.78)',
    cardShadow: 'rgba(30, 20, 15, 0.08)',
    cardShadowStyle: {
      shadowColor: '#EA580C',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
      elevation: 0
    },
    inputFill: '#F5EBE1',
    inputFocusFill: '#EFE2D5',
    roleIcon: 'shieldCheck',
    roleBadge: {
      bg: '#EA580C',
      text: '#FFFFFF',
      icon: 'shieldCheck',
      label: 'Admin'
    },
    density: 'compact',
    rowHeight: 44,
    gap: 12,
    motion: { duration: 200, spring: 'snappy' },
    identityStrip: '#FF6B00',
    sidebarBg: '#1A1412',
    sidebarText: '#FDF4EC',
    activeNavHighlight: '#EA580C',
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
