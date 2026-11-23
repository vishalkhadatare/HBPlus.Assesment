import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export function AnimatedLogo({ size = 44, fontSize = 18, showGlow = true }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Gentle breathing pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1800,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true
        })
      ])
    ).start();

    // Subtle continuous rotation for the accent glow
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 12000,
        useNativeDriver: true
      })
    ).start();
  }, [pulseAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={[styles.container, { width: size + 16, height: size + 16 }]}>
      {showGlow ? (
        <Animated.View
          style={[
            styles.glowRing,
            {
              width: size + 12,
              height: size + 12,
              borderRadius: (size + 12) / 2,
              transform: [{ scale: pulseAnim }, { rotate: spin }]
            }
          ]}
        />
      ) : null}

      <Animated.View
        style={[
          styles.badge,
          {
            width: size,
            height: size,
            borderRadius: Math.round(size * 0.28),
            transform: [{ scale: pulseAnim }]
          }
        ]}
      >
        <Text style={[styles.logoText, { fontSize }]}>HB+</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  glowRing: {
    position: 'absolute',
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    borderWidth: 1.5,
    borderColor: 'rgba(52, 211, 153, 0.4)'
  },
  badge: {
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)'
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: -0.5
  }
});

export default AnimatedLogo;
