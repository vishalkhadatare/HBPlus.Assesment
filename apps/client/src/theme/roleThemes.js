import React, { createContext, useContext } from 'react';
import { CARD_RADIUS } from './shape.js';

/**
 * Role Theme Definitions — 2025 Premium Color System
 * Admin = "Control" (Warm coral-orange, authoritative, data-dense)
 * User  = "Workspace" (Teal-emerald, friendly, calm, personal)
 */
export const ROLE_THEME = {
  admin: {
    role: 'admin',
    label: 'Admin',
    personality: 'Authoritative, precise, data-dense',

    // Backgrounds
    pageBgColor: '#FFF7ED',
    pageBgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #FFF7ED 100%)',
    pageTint: ['#FFFFFF', '#FFF7ED'],

    // Brand
    primary: '#C2410C',
    primaryLight: '#F97316',
    secondary: '#F97316',
    buttonGradient: ['#F97316', '#C2410C'],
    buttonGradientCss: 'linear-gradient(135deg, #F97316 0%, #C2410C 100%)',
    buttonGlow: 'rgba(194, 65, 12, 0.28)',

    // Cards
    cardTint: '#FFFFFF',
    cardShadow: 'rgba(15, 23, 42, 0.05)',
    cardShadowStyle: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 3
    },
    cardShadowWeb:
      '0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.08)',

    // Inputs
    inputFill: '#F1F5F9',
    inputFocusFill: '#FFFFFF',

    // Text
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',

    // Borders
    border: '#E2E8F0',

    // Navigation & chrome
    roleIcon: 'shieldCheck',
    roleBadge: {
      bg: '#FFF7ED',
      text: '#C2410C',
      icon: 'shieldCheck',
      label: 'Admin'
    },
    identityStrip: '#C2410C',
    sidebarBg: '#FFFFFF',
    sidebarText: '#334155',
    activeNavHighlight: '#C2410C',

    // Layout
    density: 'compact',
    rowHeight: 44,
    gap: 12,
    motion: { duration: 200, spring: 'snappy' },
    cardRadius: CARD_RADIUS
  },

  user: {
    role: 'user',
    label: 'User',
    personality: 'Friendly, calm, personal',

    // Backgrounds
    pageBgColor: '#F0FDFA',
    pageBgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #F0FDFA 100%)',
    pageTint: ['#FFFFFF', '#F0FDFA'],

    // Brand
    primary: '#0F766E',
    primaryLight: '#14B8A6',
    secondary: '#14B8A6',
    buttonGradient: ['#14B8A6', '#0F766E'],
    buttonGradientCss: 'linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)',
    buttonGlow: 'rgba(15, 118, 110, 0.28)',

    // Cards
    cardTint: '#FFFFFF',
    cardShadow: 'rgba(15, 23, 42, 0.05)',
    cardShadowStyle: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 3
    },
    cardShadowWeb:
      '0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.08)',

    // Inputs
    inputFill: '#F1F5F9',
    inputFocusFill: '#FFFFFF',

    // Text
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',

    // Borders
    border: '#E2E8F0',

    // Navigation & chrome
    roleIcon: 'userCircle',
    roleBadge: {
      bg: '#F0FDFA',
      text: '#0F766E',
      icon: 'userCircle',
      label: 'User'
    },
    identityStrip: '#0F766E',
    sidebarBg: '#FFFFFF',
    sidebarText: '#334155',
    activeNavHighlight: '#0F766E',

    // Layout
    density: 'comfortable',
    rowHeight: 60,
    gap: 20,
    motion: { duration: 320, spring: 'bouncy' },
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
