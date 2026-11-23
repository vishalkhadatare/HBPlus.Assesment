/**
 * HBPlus modern animated login screen (TypeScript / React Native Web / Android APK / iOS)
 *
 * Implements:
 * - Aurora dark indigo gradient with 3 floating blurred orbs
 * - Spring-loaded animated logo with rotating "+" and periodic gloss shine sweep
 * - Floating feature chips (Attendance, Leave, Payroll) with sinusoidal motion
 * - Google button with real 4-color "G" mark, tactile spring press feedback, and spinner
 * - Shaking card error container with friendly error diagnostics & dismiss
 * - Responsive phone bottom sheet vs desktop centered glass card
 * - Corner gear for Developer & QA testing tools
 * - Full Gmail Test Mode and 1-click Demo credentials
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Animated,
  Easing,
  useWindowDimensions,
  Modal,
  ScrollView
} from 'react-native';
import { useAuth } from '../hooks/useAuth.js';
import DiagnosticsPanel from '../components/common/DiagnosticsPanel.jsx';
import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';

/* ---------- design tokens ---------- */
const C = {
  ink: '#0E1330',
  muted: '#5B6385',
  subtle: '#8A91AD',
  border: '#E3E6F0',
  surface: '#FFFFFF',
  primary: '#5B5BF0',
  primarySoft: '#ECEBFF',
  danger: '#F04438',
  dangerSoft: '#FDE8E6'
};

export type LoginScreenProps = {
  onGooglePress?: () => Promise<void>;
  onOpenDevTools?: () => void;
  allowedDomain?: string;
};

/* ---------- friendly error messages ---------- */
function friendlyError(e: any, domain: string = '@hbplus.fit'): string {
  const code: string = e?.code ?? '';
  const msg: string = e?.message ?? (typeof e === 'string' ? e : '');
  if (code === 'auth/network-request-failed' || /network/i.test(msg)) {
    return 'Cannot reach the server. Check your connection and try again.';
  }
  if (
    code === 'auth/popup-closed-by-user' ||
    code === 'auth/cancelled-popup-request' ||
    /cancel/i.test(msg)
  ) {
    return 'Sign-in was cancelled.';
  }
  if (code === 'auth/unauthorized-domain') {
    return 'This website address is not authorised in Firebase (Authorized domains).';
  }
  if (/domain|restricted|official/i.test(msg)) {
    return `Access restricted. Please login using your official domain email.`;
  }
  if (code === 'permission-denied') {
    return 'Access denied by the server rules.';
  }
  return msg || 'Something went wrong. Please try again.';
}

/* ---------- floating blurred aurora orb ---------- */
function Orb({
  size,
  color,
  top,
  left,
  dx,
  dy,
  duration
}: {
  size: number;
  color: string;
  top: number | string;
  left: number | string;
  dx: number;
  dy: number;
  duration: number;
}) {
  const p = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(p, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        }),
        Animated.timing(p, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [duration, p]);

  const translateX = p.interpolate({ inputRange: [0, 1], outputRange: [0, dx] });
  const translateY = p.interpolate({ inputRange: [0, 1], outputRange: [0, dy] });
  const scale = p.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.orb,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          top: top as any,
          left: left as any,
          transform: [{ translateX }, { translateY }, { scale }]
        }
      ]}
    />
  );
}

/* ---------- animated logo ---------- */
function AnimatedLogo({ size = 92 }: { size?: number }) {
  const scale = useRef(new Animated.Value(0.4)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const plusRot = useRef(new Animated.Value(-180)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const sweep = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    // Entrance spring
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, damping: 9, stiffness: 140, useNativeDriver: true })
    ]).start();

    // Plus spin into place
    const timer1 = setTimeout(() => {
      Animated.spring(plusRot, { toValue: 0, damping: 11, stiffness: 120, useNativeDriver: true }).start();
    }, 350);

    // Glow pulse loop
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 1800, useNativeDriver: true })
      ])
    );
    glowLoop.start();

    // Shine sweep loop
    const shineLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(sweep, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        }),
        Animated.delay(2800),
        Animated.timing(sweep, { toValue: -1, duration: 0, useNativeDriver: true })
      ])
    );
    shineLoop.start();

    return () => {
      clearTimeout(timer1);
      glowLoop.stop();
      shineLoop.stop();
    };
  }, [opacity, scale, plusRot, glow, sweep]);

  const plusRotate = plusRot.interpolate({
    inputRange: [-180, 0],
    outputRange: ['-180deg', '0deg']
  });

  const glowScale = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.35]
  });

  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.8]
  });

  const shineTranslate = sweep.interpolate({
    inputRange: [-1, 1],
    outputRange: [-size, size * 1.4]
  });

  return (
    <View
      style={{
        width: size * 1.8,
        height: size * 1.8,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Pulsing aurora glow behind logo */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.logoGlow,
          {
            width: size * 1.2,
            height: size * 1.2,
            borderRadius: size * 0.4,
            opacity: glowOpacity,
            transform: [{ scale: glowScale }]
          }
        ]}
      />

      {/* Main squircle tile with gradient */}
      <Animated.View
        style={[
          styles.logoTile,
          {
            width: size,
            height: size,
            borderRadius: size * 0.3,
            opacity,
            transform: [{ scale }]
          }
        ]}
      >
        <View style={styles.logoTileGradient}>
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: size * 0.38,
              fontWeight: '800',
              letterSpacing: -1
            }}
          >
            HB
          </Text>
          <Animated.Text
            style={[
              {
                color: '#9BF3FF',
                fontSize: size * 0.42,
                fontWeight: '800',
                marginLeft: 1
              },
              { transform: [{ rotate: plusRotate }] }
            ]}
          >
            +
          </Animated.Text>
        </View>

        {/* Gloss sweep highlight */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.logoShine,
            {
              top: -size * 0.3,
              width: size * 0.35,
              height: size * 1.6,
              transform: [{ translateX: shineTranslate }, { rotate: '20deg' }]
            }
          ]}
        />
      </Animated.View>
    </View>
  );
}

/* ---------- Google "G" 4-Color SVG Mark ---------- */
function GoogleG({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

/* ---------- floating feature chip ---------- */
function FeatureChip({
  icon,
  label,
  delay = 0
}: {
  icon: string;
  label: string;
  delay: number;
}) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in entrance
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: 500 + delay,
      useNativeDriver: true
    }).start();

    // Subtle sinusoidal floating motion
    const timer = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 2400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true
          })
        ])
      ).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, fadeAnim, floatAnim]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6]
  });

  return (
    <Animated.View
      style={[
        styles.chip,
        {
          opacity: fadeAnim,
          transform: [{ translateY }]
        }
      ]}
    >
      <Icon name={icon} size={15} color="#FFFFFF" />
      <Text style={styles.chipText}>{label}</Text>
    </Animated.View>
  );
}

/* ---------- main screen ---------- */
export default function LoginScreen(props: LoginScreenProps) {
  const auth = useAuth();
  const { width } = useWindowDimensions();
  const wide = width >= 900;

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isDevSheetOpen, setIsDevSheetOpen] = useState(false);

  const pressAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const cardEntranceAnim = useRef(new Animated.Value(0)).current;

  const allowedDomain = props.allowedDomain || '@hbplus.fit';

  // Synchronize error from auth context
  const activeError = localError || (auth?.error ? friendlyError(auth.error, allowedDomain) : null);
  const isDomainError = auth?.errorCode === 'DOMAIN_NOT_ALLOWED' || /domain|restricted/i.test(activeError || '');

  // Card slide-in animation on mount
  useEffect(() => {
    Animated.spring(cardEntranceAnim, {
      toValue: 1,
      damping: 16,
      stiffness: 140,
      useNativeDriver: true
    }).start();
  }, [cardEntranceAnim]);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true })
    ]).start();
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    if (loading || auth?.isAuthorizing) return;
    setLocalError(null);
    auth?.clearError?.();
    setLoading(true);

    try {
      if (props.onGooglePress) {
        await props.onGooglePress();
      } else if (auth?.signInWithGoogle) {
        await auth.signInWithGoogle();
      }
    } catch (e: any) {
      setLocalError(friendlyError(e, allowedDomain));
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  // Trigger shake when auth context encounters an error
  useEffect(() => {
    if (auth?.error) {
      triggerShake();
    }
  }, [auth?.error]);

  const cardTranslateY = cardEntranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 0]
  });

  const cardOpacity = cardEntranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  return (
    <View style={styles.root}>
      {/* 1. Deep Indigo Ambient Aurora Background */}
      <View style={styles.gradientBg} pointerEvents="none" />

      {/* 2. Floating Blurred Aurora Orbs */}
      <View style={styles.orbLayer} pointerEvents="none">
        <Orb size={320} color="#6A5CFF" top={-80} left={-90} dx={70} dy={60} duration={7000} />
        <Orb size={280} color="#14C8D9" top="40%" left="55%" dx={-60} dy={-50} duration={8500} />
        <Orb size={240} color="#8B5CF6" top="70%" left={-60} dx={80} dy={-40} duration={9500} />
      </View>

      {/* 3. Developer Tools Gear Icon */}
      <TouchableOpacity
        style={styles.gear}
        onPress={() => {
          if (props.onOpenDevTools) {
            props.onOpenDevTools();
          } else {
            setIsDevSheetOpen(true);
          }
        }}
        activeOpacity={0.7}
        accessibilityLabel="Developer tools"
      >
        <Icon name="settings" size={20} color="rgba(255,255,255,0.85)" />
      </TouchableOpacity>

      <View style={[styles.content, wide && styles.contentWide]}>
        {/* Brand Showcase Hero */}
        <View style={[styles.hero, wide && styles.heroWide]}>
          <AnimatedLogo size={wide ? 96 : 84} />
          <Text style={styles.brand}>HBPlus</Text>
          <Text style={styles.tagline}>Work, simplified.</Text>

          {/* Floating Feature Chips */}
          <View style={styles.chipRow}>
            <FeatureChip icon="fingerprint" label="Attendance" delay={0} />
            <FeatureChip icon="airplane" label="Leave" delay={300} />
            <FeatureChip icon="wallet" label="Payroll" delay={600} />
          </View>
        </View>

        {/* 4. Sliding Card (Bottom Sheet on Phone, Centered Card on Laptop) */}
        <Animated.View
          style={[
            styles.card,
            wide ? styles.cardWide : styles.cardSheet,
            {
              opacity: cardOpacity,
              transform: [{ translateY: cardTranslateY }]
            }
          ]}
        >
          <Text style={styles.title}>Welcome to HBPlus</Text>
          <Text style={styles.subtitle}>Sign in with your company Google account to continue</Text>

          {/* 5. Shaking Error Banner */}
          {activeError ? (
            <Animated.View
              style={[
                styles.errorBox,
                { transform: [{ translateX: shakeAnim }] }
              ]}
            >
              <Icon name="alertTriangle" size={18} color={C.danger} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.errorText}>{activeError}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setLocalError(null);
                  auth?.clearError?.();
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="x" size={16} color={C.danger} />
              </TouchableOpacity>
            </Animated.View>
          ) : null}

          {/* 1-Click Fast Pass & Gmail Mode Options on Domain Restriction */}
          {isDomainError ? (
            <View style={styles.bypassRow}>
              <TouchableOpacity
                style={[styles.instantDemoBtn, { backgroundColor: C.primary }]}
                onPress={async () => {
                  auth?.setDevAllowAnyGoogle?.(true);
                  setLocalError(null);
                  auth?.clearError?.();
                  setTimeout(() => {
                    handleGoogleSignIn();
                  }, 120);
                }}
                activeOpacity={0.85}
              >
                <Icon name="checkCircle" size={14} color="#FFFFFF" />
                <Text style={styles.instantDemoBtnText}>
                  Enable Gmail Mode & Re-authenticate with Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.instantDemoBtn, { backgroundColor: '#16B364', marginTop: 6 }]}
                onPress={() => auth?.signInWithDemoAccount?.('employee@hbplus.fit', 'User')}
                activeOpacity={0.85}
              >
                <Icon name="zap" size={14} color="#FFFFFF" />
                <Text style={styles.instantDemoBtnText}>
                  Enter Instantly as Verified Employee (1-Click Demo)
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* 6. Primary Action: Google Sign-In with Tactile Spring Shrink */}
          <Animated.View style={[{ width: '100%' }, { transform: [{ scale: pressAnim }] }]}>
            <TouchableOpacity
              onPress={handleGoogleSignIn}
              onPressIn={() =>
                Animated.spring(pressAnim, { toValue: 0.97, damping: 15, useNativeDriver: true }).start()
              }
              onPressOut={() =>
                Animated.spring(pressAnim, { toValue: 1, damping: 12, useNativeDriver: true }).start()
              }
              disabled={loading || auth?.isAuthorizing}
              style={[styles.googleBtn, (loading || auth?.isAuthorizing) && styles.googleBtnDisabled]}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
            >
              {loading || auth?.isAuthorizing ? (
                <ActivityIndicator color={C.primary} size="small" />
              ) : (
                <GoogleG size={22} />
              )}
              <Text style={styles.googleText}>
                {loading || auth?.isAuthorizing ? 'Signing you in...' : 'Continue with Google'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* 7. Gmail Test Mode Quick Toggle */}
          <TouchableOpacity
            style={[
              styles.gmailToggleBar,
              auth?.devAllowAnyGoogle && styles.gmailToggleBarActive
            ]}
            onPress={() => auth?.setDevAllowAnyGoogle?.(!auth?.devAllowAnyGoogle)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.gmailToggleCheckbox,
                auth?.devAllowAnyGoogle && styles.gmailToggleCheckboxActive
              ]}
            >
              {auth?.devAllowAnyGoogle ? (
                <Icon name="check" size={11} color="#FFFFFF" strokeWidth={3} />
              ) : null}
            </View>
            <Text
              style={[
                styles.gmailToggleText,
                auth?.devAllowAnyGoogle && styles.gmailToggleTextActive
              ]}
            >
              {auth?.devAllowAnyGoogle
                ? 'Gmail Mode Active: personal @gmail.com accounts admitted'
                : 'Enable Gmail Test Mode (admit @gmail.com for evaluation)'}
            </Text>
          </TouchableOpacity>

          {/* 8. Quick Access Demo Chips */}
          <View style={styles.quickAccessBar}>
            <TouchableOpacity
              style={styles.quickDemoChip}
              onPress={() => auth?.signInWithDemoAccount?.('employee@hbplus.fit', 'User')}
              activeOpacity={0.8}
            >
              <Icon name="user" size={13} color={C.primary} />
              <Text style={[styles.quickDemoChipText, { color: C.primary }]}>Employee Demo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickDemoChip}
              onPress={() => auth?.signInWithDemoAccount?.('admin@hbplus.fit', 'Admin')}
              activeOpacity={0.8}
            >
              <Icon name="shieldCheck" size={13} color="#8B5CF6" />
              <Text style={[styles.quickDemoChipText, { color: '#8B5CF6' }]}>Admin Demo</Text>
            </TouchableOpacity>
          </View>

          {/* 9. Domain Restriction Policy Footer */}
          <View style={styles.secureRow}>
            <Icon name="shieldCheck" size={16} color={C.primary} />
            <Text style={styles.secureText}>
              Only <Text style={{ color: C.primary, fontWeight: '700' }}>{allowedDomain}</Text> accounts can access this workspace.
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Floating Bottom Copyright */}
      <Text style={styles.footer}>© 2026 HBPlus. Corporate Access Portal.</Text>

      {/* 10. DEVELOPER TESTING MODAL (Gear Icon) */}
      {isDevSheetOpen ? (
        <Modal
          visible={isDevSheetOpen}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsDevSheetOpen(false)}
        >
          <View style={styles.devOverlay}>
            <View style={styles.devSheet}>
              <View style={styles.sheetHandleRow}>
                <View style={styles.sheetHandle} />
              </View>

              <View style={styles.devSheetHeader}>
                <View>
                  <Text style={styles.devSheetTitle}>Developer & QA Sandbox</Text>
                  <Text style={styles.devSheetSub}>
                    Test Cloud Firestore, Auth & Live Diagnostics
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setIsDevSheetOpen(false)}>
                  <Icon name="x" size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
                {/* 1-Tap Demo Logins */}
                <Text style={styles.sandboxLabel}>Instant Demo Identities:</Text>
                <View style={styles.demoButtonsGrid}>
                  <Button
                    title="Employee Demo (@hbplus.fit)"
                    icon="user"
                    variant="primary"
                    onPress={() => {
                      setIsDevSheetOpen(false);
                      auth?.signInWithDemoAccount?.('employee@hbplus.fit', 'User');
                    }}
                  />
                  <Button
                    title="Admin Demo (@hbplus.fit)"
                    icon="shieldCheck"
                    variant="secondary"
                    onPress={() => {
                      setIsDevSheetOpen(false);
                      auth?.signInWithDemoAccount?.('admin@hbplus.fit', 'Admin');
                    }}
                  />
                </View>

                {/* Personal Google Bypass */}
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => auth?.setDevAllowAnyGoogle?.(!auth?.devAllowAnyGoogle)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.checkboxBox,
                      auth?.devAllowAnyGoogle && { backgroundColor: C.primary, borderColor: C.primary }
                    ]}
                  >
                    {auth?.devAllowAnyGoogle ? (
                      <Icon name="check" size={12} color="#FFFFFF" strokeWidth={3} />
                    ) : null}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    Allow personal Google email for this test session
                  </Text>
                </TouchableOpacity>

                {/* Live Diagnostics */}
                <View style={{ marginTop: 14 }}>
                  <DiagnosticsPanel currentUser={auth?.user} />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B1030',
    overflow: 'hidden',
    position: 'relative'
  },
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Native CSS gradient on Web / Capacitor
    ...(Platform.OS === 'web'
      ? {
          background: 'linear-gradient(145deg, #0B1030 0%, #1E176E 45%, #4338CA 100%)'
        }
      : {
          backgroundColor: '#1E176E'
        })
  },
  orbLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    ...(Platform.OS === 'web' ? { filter: 'blur(70px)' } : null)
  },
  orb: {
    position: 'absolute',
    opacity: 0.65
  },
  content: {
    flex: 1,
    justifyContent: 'space-between'
  },
  contentWide: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 36,
    paddingHorizontal: 20
  },
  heroWide: {
    flex: 0,
    paddingTop: 0,
    marginBottom: 8
  },
  logoGlow: {
    position: 'absolute',
    backgroundColor: '#7C7CFF'
  },
  logoTile: {
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 16px 36px rgba(75, 69, 232, 0.45)',
    elevation: 12
  },
  logoTileGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? {
          background: 'linear-gradient(135deg, #7A6CFF 0%, #4A3DF0 50%, #2F8BFF 100%)'
        }
      : {
          backgroundColor: '#4A3DF0'
        })
  },
  logoShine: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.35)'
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
    marginTop: -4
  },
  tagline: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 15,
    marginTop: 4,
    fontWeight: '500'
  },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(12px)' } : null)
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600'
  },
  card: {
    backgroundColor: C.surface,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#1B1450',
    shadowOpacity: 0.35,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 20 },
    elevation: 20
  },
  cardSheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 44
  },
  cardWide: {
    width: 440,
    maxWidth: '92%',
    borderRadius: 32
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.5,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: C.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 2
  },
  googleBtn: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#5B5BF0',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3
  },
  googleBtnDisabled: {
    opacity: 0.75
  },
  googleText: {
    fontSize: 15,
    fontWeight: '700',
    color: C.ink
  },
  gmailToggleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(91, 91, 240, 0.18)',
    backgroundColor: 'rgba(91, 91, 240, 0.04)',
    gap: 8,
    width: '100%'
  },
  gmailToggleBarActive: {
    borderColor: C.primary,
    backgroundColor: 'rgba(91, 91, 240, 0.09)'
  },
  gmailToggleCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gmailToggleCheckboxActive: {
    backgroundColor: C.primary,
    borderColor: C.primary
  },
  gmailToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.muted,
    flex: 1
  },
  gmailToggleTextActive: {
    color: C.primary,
    fontWeight: '700'
  },
  quickAccessBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 2
  },
  quickDemoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    gap: 6
  },
  quickDemoChipText: {
    fontSize: 12,
    fontWeight: '700'
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
    paddingHorizontal: 4
  },
  secureText: {
    flex: 1,
    minWidth: 0,
    fontSize: 12.5,
    color: C.muted,
    lineHeight: 18
  },
  errorBox: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: C.dangerSoft,
    borderWidth: 1,
    borderColor: '#F9C5C0'
  },
  errorText: {
    color: '#B42318',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500'
  },
  bypassRow: {
    width: '100%',
    marginVertical: 2
  },
  instantDemoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12
  },
  instantDemoBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  gear: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 18 : 46,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    fontWeight: '500'
  },
  devOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  devSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    paddingBottom: 32
  },
  sheetHandleRow: {
    alignItems: 'center',
    marginBottom: 8
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1'
  },
  devSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  devSheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A'
  },
  devSheetSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  sandboxLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8
  },
  demoButtonsGrid: {
    gap: 8,
    marginBottom: 14
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    gap: 10
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B'
  }
});
