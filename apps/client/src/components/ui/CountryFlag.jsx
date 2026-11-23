import React from 'react';
import * as Flags from 'country-flag-icons/react/3x2';

/**
 * High-definition Vector SVG Country Flag Component
 * Renders genuine SVG flags for all countries with zero reliance on Windows font emoji support.
 */
export function CountryFlag({ iso, width = 28, height = 19, style }) {
  const normalizedIso = (iso || '').toUpperCase();
  const FlagComponent = Flags[normalizedIso];

  if (!FlagComponent) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width,
          height,
          borderRadius: 3,
          backgroundColor: '#F1F5F9',
          color: '#64748B',
          fontSize: 10,
          fontWeight: '700'
        }}
      >
        {normalizedIso}
      </span>
    );
  }

  return (
    <FlagComponent
      style={{
        width,
        height,
        borderRadius: 3,
        boxShadow: '0 0 1px rgba(0, 0, 0, 0.3)',
        display: 'block',
        flexShrink: 0,
        ...style
      }}
    />
  );
}

export default CountryFlag;
