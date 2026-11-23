import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
  useWindowDimensions
} from 'react-native';
import AnimatedLogo from '../components/brand/AnimatedLogo.jsx';

/**
 * Full-Screen Animated Splash Screen (Website & Android APK First Launch)
 * Displays the complete HB+ honeycomb entrance animation with ambient glows,
 * progress indicator, and smooth fade transition into the app.
 */
export function SplashScreen({ onFinish }) {
  const { width, height } = useWindowDimensions();
  const isWide = width >= 768;

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    // Animate progress bar over 2.4s to match logo entrance
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2400,
      useNativeDriver: false
    }).start();

    // Auto-transition after 2.6s if not tapped early
    const timer = setTimeout(() => {
      handleComplete();
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    if (hasCompleted) return;
    setHasCompleted(true);

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true
    }).start(() => {
      if (onFinish) onFinish();
    });
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
      <TouchableOpacity
        style={styles.touchArea}
        activeOpacity={1}
        onPress={handleComplete}
        accessibilityLabel="Tap to continue"
      >
        {/* Soft Ambient Background Glows */}
        <View style={styles.ambientGlowTop} pointerEvents="none" />
        <View style={styles.ambientGlowBottom} pointerEvents="none" />

        {/* Center Animated HB+ Mark & Typography */}
        <View style={styles.centerContainer}>
          <AnimatedLogo
            size={isWide ? 136 : 120}
            showWordmark={true}
            showTagline={true}
            textColor="#0F172A"
            onAnimationComplete={handleComplete}
          />
        </View>

        {/* Bottom Loading Progress & Branding */}
        <View style={styles.bottomArea}>
          <View style={styles.progressBarTrack}>
            <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.versionText}>HBPlus • Enterprise Workspace Portal</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center'
  },
  touchArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  ambientGlowTop: {
    position: 'absolute',
    top: '-10%',
    left: '-10%',
    width: '60%',
    height: '50%',
    borderRadius: 999,
    backgroundColor: 'rgba(0, 179, 134, 0.08)',
    ...(Platform.OS === 'web'
      ? { filter: 'blur(70px)' }
      : {})
  },
  ambientGlowBottom: {
    position: 'absolute',
    bottom: '-10%',
    right: '-10%',
    width: '60%',
    height: '50%',
    borderRadius: 999,
    backgroundColor: 'rgba(234, 88, 12, 0.08)',
    ...(Platform.OS === 'web'
      ? { filter: 'blur(70px)' }
      : {})
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  bottomArea: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
    gap: 12
  },
  progressBarTrack: {
    width: 140,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#00B386',
    ...(Platform.OS === 'web'
      ? { backgroundImage: 'linear-gradient(90deg, #00D9A5 0%, #00B386 60%, #EA580C 100%)' }
      : {})
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 0.3
  }
});

export default SplashScreen;
