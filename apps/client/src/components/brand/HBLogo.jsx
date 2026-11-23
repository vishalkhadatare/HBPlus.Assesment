import React from 'react';
import { View } from 'react-native';

/**
 * Static SVG HBPlus Honeycomb Logo (Section 3.2)
 * Variants: 'color' (default brand gradient), 'monochrome', 'light-on-dark'
 */
export function HBLogo({ size = 44, variant = 'color' }) {
  const isMono = variant === 'monochrome';
  const isLight = variant === 'light-on-dark';

  const hexFill = isMono ? '#0A1A17' : isLight ? '#FFFFFF' : 'url(#hbStaticBrand)';
  const glyphFill = isMono ? '#FFFFFF' : isLight ? '#0A1A17' : '#FFFFFF';
  const amberFill = isMono ? '#0A1A17' : isLight ? '#FFFFFF' : '#FFB020';

  return (
    <View style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="hbStaticBrand" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D9A5" />
            <stop offset="55%" stopColor="#00B386" />
            <stop offset="100%" stopColor="#0A84FF" />
          </linearGradient>
        </defs>

        {/* Honeycomb Hexagon */}
        <path
          d="M 56,13 Q 60,10.5 64,13 L 101,34 Q 104,36 104,40 L 104,80 Q 104,84 101,86 L 64,107 Q 60,109.5 56,107 L 19,86 Q 16,84 16,80 L 16,40 Q 16,36 19,34 Z"
          fill={hexFill}
          stroke={isLight ? 'transparent' : 'rgba(255,255,255,0.4)'}
          strokeWidth="1.5"
        />

        {/* Gloss Top */}
        {!isMono && !isLight ? (
          <path d="M 22,38 L 60,15 L 98,38 Q 60,30 22,38 Z" fill="rgba(255,255,255,0.22)" />
        ) : null}

        {/* H Left Bar */}
        <rect x="33" y="36" width="9" height="48" rx="4.5" fill={glyphFill} />
        {/* H Crossbar */}
        <rect x="38" y="56" width="22" height="8" rx="3" fill={glyphFill} />
        {/* H/B Shared Bar */}
        <rect x="54" y="36" width="9" height="48" rx="4.5" fill={glyphFill} />

        {/* B Upper Bowl */}
        <path
          d="M 59,36 H 70 C 78,36 82,41 82,48 C 82,55 78,60 70,60 H 59"
          stroke={glyphFill}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* B Lower Bowl */}
        <path
          d="M 59,60 H 72 C 81,60 85,66 85,73 C 85,80 81,84 72,84 H 59"
          stroke={glyphFill}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Amber + Badge */}
        <rect x="88" y="23" width="16" height="6" rx="3" fill={amberFill} />
        <rect x="93" y="18" width="6" height="16" rx="3" fill={amberFill} />
      </svg>
    </View>
  );
}

export default HBLogo;
