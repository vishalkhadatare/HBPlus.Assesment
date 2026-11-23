import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';

/**
 * Section 3.2 & 3.3: Modern Hexagonal Honeycomb HB+ Animated Mark
 * Colors: Midnight, Emerald (#00B386) and Amber (#FFB020)
 */
export function AnimatedLogo({
  size = 120,
  showWordmark = true,
  showTagline = true,
  reduceMotion = false,
  textColor = '#FFFFFF',
  onAnimationComplete
}) {
  // Animation Values
  const bgRingOpacity = useRef(new Animated.Value(0)).current;
  const hexScale = useRef(new Animated.Value(reduceMotion ? 1 : 0.2)).current;
  const hexOpacity = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const hBarScaleY = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const bCurveOpacity = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const plusScale = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const plusRot = useRef(new Animated.Value(reduceMotion ? 0 : -180)).current;
  const shineSweep = useRef(new Animated.Value(-1)).current;
  const wordmarkSlide = useRef(new Animated.Value(reduceMotion ? 0 : 20)).current;
  const wordmarkOpacity = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const taglineOpacity = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;

  // Idle Loop Values
  const glowPulse = useRef(new Animated.Value(1)).current;
  const plusPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reduceMotion) return;

    // Sequence (Total 2.4s entrance)
    // 1. 0.00 to 0.40s: faint ring and blurred emerald orbs fade in
    Animated.timing(bgRingOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true
    }).start();

    // 2. 0.20 to 0.90s: hexagon outline & fill scales up with spring
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(hexOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.spring(hexScale, { toValue: 1, damping: 12, stiffness: 140, useNativeDriver: true })
      ]).start();
    }, 200);

    // 3. 0.60 to 1.30s: H bars grow upward from the base
    setTimeout(() => {
      Animated.spring(hBarScaleY, { toValue: 1, damping: 14, stiffness: 120, useNativeDriver: true }).start();
    }, 600);

    // B curves draw / fade on staggered by 80ms
    setTimeout(() => {
      Animated.timing(bCurveOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, 680);

    // 4. 1.10 to 1.60s: amber "+" pops in with bouncy spring and spins 180 deg
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(plusScale, { toValue: 1, damping: 9, stiffness: 180, useNativeDriver: true }),
        Animated.spring(plusRot, { toValue: 0, damping: 11, stiffness: 120, useNativeDriver: true })
      ]).start();
    }, 1100);

    // 5. 1.40 to 2.00s: diagonal light shine sweeps across hexagon
    setTimeout(() => {
      Animated.timing(shineSweep, {
        toValue: 1,
        duration: 700,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true
      }).start(() => {
        shineSweep.setValue(-1);
      });
    }, 1400);

    // 6. 1.60 to 2.40s: wordmark slides up and tagline fades in
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(wordmarkOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(wordmarkSlide, { toValue: 0, damping: 15, stiffness: 120, useNativeDriver: true })
      ]).start();
    }, 1600);

    setTimeout(() => {
      Animated.timing(taglineOpacity, { toValue: 1, duration: 600, useNativeDriver: true }).start(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      });
    }, 2000);

    // 7. Idle Loop
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1.15, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 1.0, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])
    );
    glowLoop.start();

    // Amber '+' gentle pulse every 6s
    const plusPulseLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(5000),
        Animated.spring(plusPulse, { toValue: 1.25, damping: 6, stiffness: 200, useNativeDriver: true }),
        Animated.spring(plusPulse, { toValue: 1.0, damping: 10, stiffness: 150, useNativeDriver: true })
      ])
    );
    plusPulseLoop.start();

    // Shine sweep repeat every 5s
    const shineLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(5000),
        Animated.timing(shineSweep, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        }),
        Animated.timing(shineSweep, { toValue: -1, duration: 0, useNativeDriver: true })
      ])
    );
    shineLoop.start();

    return () => {
      glowLoop.stop();
      plusPulseLoop.stop();
      shineLoop.stop();
    };
  }, [reduceMotion]);

  const plusRotateStr = plusRot.interpolate({
    inputRange: [-180, 0],
    outputRange: ['-180deg', '0deg']
  });

  const shineTranslateX = shineSweep.interpolate({
    inputRange: [-1, 1],
    outputRange: [-size, size * 1.5]
  });

  return (
    <View style={styles.root}>
      {/* Container for Hexagon & Glow */}
      <View style={{ width: size * 1.3, height: size * 1.3, alignItems: 'center', justifyContent: 'center' }}>
        {/* Step 1: Ambient Ring and Emerald Glow */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glowRing,
            {
              width: size * 1.1,
              height: size * 1.1,
              borderRadius: (size * 1.1) / 2,
              opacity: bgRingOpacity,
              transform: [{ scale: glowPulse }]
            }
          ]}
        />

        {/* Step 2: Hexagonal Honeycomb Mark */}
        <Animated.View
          style={[
            styles.hexWrapper,
            {
              width: size,
              height: size,
              opacity: hexOpacity,
              transform: [{ scale: hexScale }]
            }
          ]}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 120 120"
            fill="none"
            style={{ display: 'block', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="hbGradientBrand" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00D9A5" />
                <stop offset="55%" stopColor="#00B386" />
                <stop offset="100%" stopColor="#0A84FF" />
              </linearGradient>
              <linearGradient id="hbGradientAmber" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFC857" />
                <stop offset="100%" stopColor="#FF9F1C" />
              </linearGradient>
              <filter id="hexDropShadow" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#00775B" floodOpacity="0.45" />
              </filter>
            </defs>

            {/* Honeycomb Hexagon with Rounded Corners & Brand Gradient */}
            <path
              d="M 56,13 Q 60,10.5 64,13 L 101,34 Q 104,36 104,40 L 104,80 Q 104,84 101,86 L 64,107 Q 60,109.5 56,107 L 19,86 Q 16,84 16,80 L 16,40 Q 16,36 19,34 Z"
              fill="url(#hbGradientBrand)"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1.5"
              filter="url(#hexDropShadow)"
            />

            {/* Glossy Top Edge Highlight */}
            <path
              d="M 22,38 L 60,15 L 98,38 Q 60,30 22,38 Z"
              fill="rgba(255,255,255,0.22)"
            />

            {/* H Left Vertical Bar */}
            <rect x="33" y="36" width="9" height="48" rx="4.5" fill="#FFFFFF" />

            {/* H Crossbar */}
            <rect x="38" y="56" width="22" height="8" rx="3" fill="#FFFFFF" />

            {/* H and B Shared Middle Bar */}
            <rect x="54" y="36" width="9" height="48" rx="4.5" fill="#FFFFFF" />

            {/* B Upper Bowl */}
            <path
              d="M 59,36 H 70 C 78,36 82,41 82,48 C 82,55 78,60 70,60 H 59"
              stroke="#FFFFFF"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* B Lower Bowl */}
            <path
              d="M 59,60 H 72 C 81,60 85,66 85,73 C 85,80 81,84 72,84 H 59"
              stroke="#FFFFFF"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>

          {/* Diagonal Light Shine Sweep */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.shineSweep,
              {
                width: size * 0.35,
                height: size * 1.5,
                transform: [{ translateX: shineTranslateX }, { rotate: '25deg' }]
              }
            ]}
          />

          {/* Overlapping Amber '+' Badge at Top Right */}
          <Animated.View
            style={[
              styles.amberBadge,
              {
                top: size * 0.06,
                right: size * 0.08,
                transform: [{ scale: Animated.multiply(plusScale, plusPulse) }, { rotate: plusRotateStr }]
              }
            ]}
          >
            <svg width={size * 0.28} height={size * 0.28} viewBox="0 0 32 32" fill="none">
              <rect x="4" y="12" width="24" height="8" rx="4" fill="url(#hbGradientAmber)" />
              <rect x="12" y="4" width="8" height="24" rx="4" fill="url(#hbGradientAmber)" />
            </svg>
          </Animated.View>
        </Animated.View>
      </View>

      {/* Step 6: Wordmark "HBPlus" & Tagline */}
      {showWordmark ? (
        <Animated.View
          style={[
            styles.wordmarkWrapper,
            {
              opacity: wordmarkOpacity,
              transform: [{ translateY: wordmarkSlide }]
            }
          ]}
        >
          <View style={styles.titleRow}>
            <Text style={[styles.brandHB, { color: textColor }]}>HB</Text>
            <Text style={styles.brandPlus}>Plus</Text>
          </View>
          {showTagline ? (
            <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
              Work, simplified.
            </Animated.Text>
          ) : null}
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  glowRing: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 179, 134, 0.35)',
    ...(Platform.OS === 'web' ? { filter: 'blur(36px)' } : null)
  },
  hexWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  shineSweep: {
    position: 'absolute',
    top: -20,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    ...(Platform.OS === 'web' ? { filter: 'blur(6px)' } : null)
  },
  amberBadge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  wordmarkWrapper: {
    alignItems: 'center',
    marginTop: 4
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  brandHB: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8
  },
  brandPlus: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFB020',
    letterSpacing: -0.8,
    marginLeft: 1
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.72)',
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.1
  }
});

export default AnimatedLogo;
