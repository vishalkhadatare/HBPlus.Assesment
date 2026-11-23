import React from 'react';
import { View } from 'react-native';

/**
 * Modern 3D Vector SVG Logo for Admin Role
 * Features gradient shield, beveled rim, gloss specular light, and executive emblem.
 */
export function AdminRoleLogo({ size = 36 }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="adminLogoGrad" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#FF8A2A" />
            <stop offset="50%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
          <linearGradient id="adminLogoRim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="adminLogoGloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
          </linearGradient>
          <filter id="adminLogoShadow" x="-20%" y="-15%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#EA580C" floodOpacity="0.32" />
          </filter>
        </defs>

        <g filter="url(#adminLogoShadow)">
          {/* Base Shield */}
          <path
            d="M 24 3 L 41 9.5 C 41 24.5 35 37 24 44 C 13 37 7 24.5 7 9.5 L 24 3 Z"
            fill="url(#adminLogoGrad)"
          />

          {/* 3D Beveled Rim */}
          <path
            d="M 24 5.5 L 38.5 11 C 38.5 23.5 33.2 34.5 24 41 C 14.8 34.5 9.5 23.5 9.5 11 L 24 5.5 Z"
            fill="none"
            stroke="url(#adminLogoRim)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* Top Gloss Reflection */}
          <path
            d="M 24 5.5 L 38.5 11 C 37 18 30 20 24 20 C 18 20 11 18 9.5 11 L 24 5.5 Z"
            fill="url(#adminLogoGloss)"
          />

          {/* Executive Security Key Star / Emblem */}
          <path
            d="M 24 13 L 27.5 19 L 34 19.8 L 29.2 24.2 L 30.5 30.5 L 24 27 L 17.5 30.5 L 18.8 24.2 L 14 19.8 L 20.5 19 Z"
            fill="#FFE8D6"
            opacity="0.95"
          />
          {/* Central Verified Shield Checkmark */}
          <path
            d="M 20.5 23.2 L 23.2 26 L 28.5 19.5"
            stroke="#EA580C"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </View>
  );
}

/**
 * Modern 3D Vector SVG Logo for User Workspace Role
 * Features emerald gradient badge, beveled rim, gloss specular light, and corporate workspace profile.
 */
export function UserRoleLogo({ size = 36 }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="userLogoGrad" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#00E5AE" />
            <stop offset="50%" stopColor="#00B386" />
            <stop offset="100%" stopColor="#008F6B" />
          </linearGradient>
          <linearGradient id="userLogoRim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="userLogoGloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
          </linearGradient>
          <filter id="userLogoShadow" x="-20%" y="-15%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#00B386" floodOpacity="0.32" />
          </filter>
        </defs>

        <g filter="url(#userLogoShadow)">
          {/* Base Rounded Hexagon / Pill Badge */}
          <rect
            x="6"
            y="5"
            width="36"
            height="36"
            rx="13"
            fill="url(#userLogoGrad)"
          />

          {/* 3D Beveled Rim */}
          <rect
            x="7.5"
            y="6.5"
            width="33"
            height="33"
            rx="11.5"
            fill="none"
            stroke="url(#userLogoRim)"
            strokeWidth="1.6"
          />

          {/* Top Gloss Reflection */}
          <path
            d="M 7.5 18 C 7.5 12 12 7.5 18 6.5 C 24 8.5 32 8.5 38 10 C 39.5 12 40.5 15 40.5 18 C 30 20.5 18 20.5 7.5 18 Z"
            fill="url(#userLogoGloss)"
          />

          {/* User Head Sphere */}
          <circle cx="24" cy="18" r="6" fill="#FFFFFF" />
          <circle cx="22.2" cy="16.5" r="1.6" fill="#E6FAF3" opacity="0.6" />

          {/* User Shoulder & Torso Contour */}
          <path
            d="M 14.5 33.5 C 14.5 28.2 18.8 25 24 25 C 29.2 25 33.5 28.2 33.5 33.5 C 33.5 34.8 32.5 35.5 31 35.5 H 17 C 15.5 35.5 14.5 34.8 14.5 33.5 Z"
            fill="#FFFFFF"
          />
        </g>
      </svg>
    </View>
  );
}

export default {
  AdminRoleLogo,
  UserRoleLogo
};
