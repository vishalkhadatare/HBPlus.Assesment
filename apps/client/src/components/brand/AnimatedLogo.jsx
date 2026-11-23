import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

/**
 * Premium HBPlus "H+" Mark with Gradient, Squircle Geometry & Gloss Highlight (Section 8)
 */
export function AnimatedLogo({ size = 44, showWordmark = false, showGlow = true, textColor }) {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance bounce
    Animated.spring(scaleAnim, {
      toValue: 1,
      damping: 14,
      stiffness: 180,
      useNativeDriver: true
    }).start();

    // Subtle breathing glow loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 2200,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true
        })
      ])
    ).start();
  }, [scaleAnim, pulseAnim]);

  const cornerRadius = Math.round(size * 0.28);

  return (
    <View style={styles.root}>
      <View style={[styles.container, { width: size, height: size }]}>
        {showGlow ? (
          <Animated.View
            style={[
              styles.glow,
              {
                width: size + 14,
                height: size + 14,
                borderRadius: cornerRadius + 6,
                transform: [{ scale: pulseAnim }]
              }
            ]}
          />
        ) : null}

        {/* Geometric Mark Squircle Tile */}
        <Animated.View
          style={[
            styles.tile,
            {
              width: size,
              height: size,
              borderRadius: cornerRadius,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Inner Gloss Sweep */}
          <View style={styles.glossHighlight} />

          {/* Precision H+ Geometric SVG Mark */}
          <svg
            width={Math.round(size * 0.62)}
            height={Math.round(size * 0.62)}
            viewBox="0 0 32 32"
            fill="none"
            style={{ display: 'block' }}
          >
            {/* Left Vertical Stem of H */}
            <rect x="5" y="6" width="5" height="20" rx="2.5" fill="#FFFFFF" />
            
            {/* Right Vertical Stem of H */}
            <rect x="22" y="6" width="5" height="20" rx="2.5" fill="#FFFFFF" />
            
            {/* Horizontal Bar of H intersecting with + */}
            <rect x="8" y="13.5" width="16" height="5" rx="2" fill="#FFFFFF" />
            
            {/* Vertical Stem of + in the middle */}
            <rect x="13.5" y="8" width="5" height="16" rx="2" fill="#FFFFFF" />

            {/* Glowing Accent Core in center of the + */}
            <circle cx="16" cy="16" r="2.2" fill="#14C8D9" />
          </svg>
        </Animated.View>
      </View>

      {showWordmark ? (
        <View style={styles.wordmarkContainer}>
          <Text style={[styles.wordmarkTitle, textColor ? { color: textColor } : null]}>HBPlus</Text>
          <Text style={styles.wordmarkSubtitle}>Workspace</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  glow: {
    position: 'absolute',
    backgroundColor: 'rgba(91, 91, 240, 0.35)',
    filter: 'blur(8px)'
  },
  tile: {
    backgroundColor: '#5B5BF0',
    backgroundImage: 'linear-gradient(135deg, #6A5CFF 0%, #4A3DF0 50%, #2F8BFF 100%)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(74, 61, 240, 0.38), inset 0 1px 1px rgba(255, 255, 255, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)'
  },
  glossHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '48%',
    backgroundColor: 'linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 100%)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  wordmarkContainer: {
    marginLeft: 10
  },
  wordmarkTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#0E1330'
  },
  wordmarkSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5B6385',
    letterSpacing: 0.2
  }
});

export default AnimatedLogo;
