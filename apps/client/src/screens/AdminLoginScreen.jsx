import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Animated,
  ScrollView
} from 'react-native';
import { useAuth } from '../hooks/useAuth.js';
import { RoleThemeProvider, useRoleTheme } from '../theme/roleThemes.js';
import { CARD_RADIUS } from '../theme/shape.js';
import HBLogo from '../components/brand/HBLogo.jsx';
import Icon from '../components/ui/Icon.jsx';
import SquaredCard from '../components/ui/SquaredCard.jsx';
import SquaredInput from '../components/ui/SquaredInput.jsx';
import SquaredButton from '../components/ui/SquaredButton.jsx';
import { ROUTES } from '../navigation/navigationConfig.js';
import adminIllustration from '../assets/illustrations/admin-secure-login.svg';

function AdminLoginInner() {
  const { signInAdmin, navigate } = useAuth();
  const theme = useRoleTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Crisp 200ms slide-up entrance animation (Section 3 & 4)
  const slideAnim = useRef(new Animated.Value(24)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();
  }, [slideAnim, opacityAnim]);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -8, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -5, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true })
    ]).start();
  };

  const handleAdminSignIn = async () => {
    if (loading) return;
    setError(null);

    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please enter your official administrator email.');
      triggerShake();
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      await signInAdmin(cleanEmail, password);
    } catch (err) {
      setError(err.message || 'Authentication failed.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 4px Deep-Teal Identity Strip across the top (Section 3) */}
      <View style={[styles.identityStrip, { backgroundColor: theme.identityStrip }]} />

      {/* DESKTOP SPLIT SCREEN (42% Control Panel / 58% Form Area) */}
      {isDesktop ? (
        <View style={styles.desktopContainer}>
          {/* Left 42%: Deep-Teal/Midnight Panel */}
          <View style={styles.desktopLeftPanel}>
            {/* Abstract subtle grid pattern at 8% opacity */}
            <View style={styles.abstractPattern} pointerEvents="none">
              <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                <defs>
                  <pattern id="adminGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(234, 88, 12, 0.06)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#adminGrid)" />
                {/* Decorative shield outline */}
                <path
                  d="M120 180 L200 140 L280 180 L280 280 C280 340 200 400 200 400 C200 400 120 340 120 280 Z"
                  fill="none"
                  stroke="rgba(234, 88, 12, 0.05)"
                  strokeWidth="2"
                />
              </svg>
            </View>

            {/* Back Button */}
            <TouchableOpacity
              style={styles.desktopBackBtn}
              onPress={() => navigate(ROUTES.ROLE_SELECT)}
              activeOpacity={0.8}
              accessibilityLabel="Back to Role Select"
            >
              <Icon name="arrowLeft" size={18} color="#0F172A" />
            </TouchableOpacity>

            {/* Branding & Role Title */}
            <View style={styles.desktopBrandBox}>
              <HBLogo size={68} />
              <View style={styles.roleTitleRow}>
                <Icon name="shieldCheck" size={26} color="#FF7A1A" strokeWidth={2.4} />
                <Text style={styles.desktopTitleText}>Admin</Text>
              </View>
              <View style={styles.controlPill}>
                <Text style={styles.controlPillText}>Control Room</Text>
              </View>
              {Platform.OS === 'web' ? (
                <img
                  src={adminIllustration}
                  alt="Secure administrator workspace illustration"
                  style={{
                    width: 'min(82%, 420px)',
                    height: 220,
                    objectFit: 'contain',
                    marginTop: 8,
                    display: 'block'
                  }}
                />
              ) : null}
            </View>
          </View>

          {/* Right 58%: Cool Mint-Slate Tint with Form Card */}
          <View style={styles.desktopRightArea}>
            <Animated.View
              style={[
                styles.formWrapper,
                {
                  opacity: opacityAnim,
                  transform: [{ translateY: slideAnim }, { translateX: shakeAnim }]
                }
              ]}
            >
              <SquaredCard style={styles.adminCard}>
                {error ? (
                  <View style={styles.errorBox}>
                    <Icon name="alertTriangle" size={16} color="#DC2626" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <SquaredInput
                  label="Email"
                  iconName="mail"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="admin@hbplus.fit"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />

                <SquaredInput
                  label="Password"
                  iconName="lock"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry={true}
                  showPasswordToggle={true}
                  editable={!loading}
                  onSubmitEditing={handleAdminSignIn}
                />

                <SquaredButton
                  title="Sign in"
                  onPress={handleAdminSignIn}
                  loading={loading}
                  style={{ marginTop: 8 }}
                />
              </SquaredCard>
            </Animated.View>
          </View>
        </View>
      ) : (
        /* PHONE LAYOUT: Header Band (~28% screen) + Cool Slate Tint */
        <View style={styles.phoneContainer}>
          {/* Header Band */}
          <View style={styles.phoneHeaderBand}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.phoneBackBtn}
              onPress={() => navigate(ROUTES.ROLE_SELECT)}
              activeOpacity={0.8}
              accessibilityLabel="Back to Role Select"
            >
              <Icon name="arrowLeft" size={18} color="#ECFBF6" />
            </TouchableOpacity>

            <View style={styles.phoneBrandBox}>
              {Platform.OS === 'web' ? (
                <img
                  src={adminIllustration}
                  alt="Admin Control"
                  style={{
                    width: 180,
                    height: 84,
                    objectFit: 'contain',
                    marginTop: 0,
                    marginBottom: 2,
                    display: 'block'
                  }}
                />
              ) : null}
              <View style={styles.phoneTitleRow}>
                <Icon name="shieldCheck" size={22} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.phoneTitleText}>Admin Control</Text>
              </View>
            </View>
          </View>

          {/* Overlapping Form Area */}
          <ScrollView
            style={styles.phoneLowerScroll}
            contentContainerStyle={styles.phoneLowerArea}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={[
                styles.phoneFormWrapper,
                {
                  opacity: opacityAnim,
                  transform: [{ translateY: slideAnim }, { translateX: shakeAnim }]
                }
              ]}
            >
              <SquaredCard style={styles.adminCard}>
                {error ? (
                  <View style={styles.errorBox}>
                    <Icon name="alertTriangle" size={16} color="#DC2626" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <SquaredInput
                  label="Email"
                  iconName="mail"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="admin@hbplus.fit"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />

                <SquaredInput
                  label="Password"
                  iconName="lock"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry={true}
                  showPasswordToggle={true}
                  editable={!loading}
                  onSubmitEditing={handleAdminSignIn}
                />

                <SquaredButton
                  title="Sign in"
                  onPress={handleAdminSignIn}
                  loading={loading}
                  style={{ marginTop: 8 }}
                />
              </SquaredCard>
            </Animated.View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

export function AdminLoginScreen() {
  return (
    <RoleThemeProvider role="admin">
      <AdminLoginInner />
    </RoleThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF6F2',
    position: 'relative'
  },
  identityStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    zIndex: 100
  },
  // Desktop Split Screen
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
    height: '100%'
  },
  desktopLeftPanel: {
    width: '42%',
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: 40
  },
  abstractPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  desktopBackBtn: {
    position: 'absolute',
    top: 36,
    left: 36,
    width: 38,
    height: 38,
    borderRadius: CARD_RADIUS,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20
  },
  desktopBrandBox: {
    alignItems: 'center',
    gap: 16,
    zIndex: 10
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  desktopTitleText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4
  },
  controlPill: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: CARD_RADIUS
  },
  controlPillText: {
    color: '#EA580C',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase'
  },
  desktopRightArea: {
    width: '58%',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 60,
    paddingRight: 40
  },
  formWrapper: {
    width: '100%',
    maxWidth: 440
  },
  adminCard: {
    width: '100%',
    padding: 24,
    gap: 16
  },
  // Phone Layout
  phoneContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  phoneHeaderBand: {
    minHeight: 180,
    paddingTop: Platform.OS === 'web' ? 'max(44px, env(safe-area-inset-top, 44px))' : 44,
    paddingBottom: 24,
    backgroundColor: '#EA580C',
    ...(Platform.OS === 'web'
      ? { backgroundImage: 'linear-gradient(135deg, #FF7A1A 0%, #EA580C 100%)' }
      : {}),
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  phoneBackBtn: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 'max(40px, env(safe-area-inset-top, 40px))' : 40,
    left: 18,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20
  },
  phoneBrandBox: {
    alignItems: 'center',
    gap: 6,
    marginTop: 2
  },
  phoneTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  phoneTitleText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ECFBF6',
    letterSpacing: -0.3
  },
  phoneLowerScroll: {
    flex: 1
  },
  phoneLowerArea: {
    paddingHorizontal: 20,
    marginTop: -20,
    paddingBottom: 32,
    alignItems: 'center'
  },
  phoneFormWrapper: {
    width: '100%',
    maxWidth: 440
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: CARD_RADIUS,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 0
  },
  errorText: {
    flex: 1,
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500'
  }
});

export default AdminLoginScreen;
