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

  const slideAnim = useRef(new Animated.Value(32)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 15,
        stiffness: 120,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
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

  /* ─── SHARED FORM CARD CONTENT ─── */
  const FormCard = () => (
    <SquaredCard style={styles.adminCard}>
      {error ? (
        <View style={styles.errorBox}>
          <Icon name="alertTriangle" size={15} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.cardHeaderArea}>
        <Text style={styles.cardTitle}>Administrator Sign In</Text>
        <Text style={styles.cardSubtitle}>
          Enter your corporate credentials to access the central control room.
        </Text>
      </View>

      <SquaredInput
        label="Admin Email"
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

      {/* Primary Orange Gradient Button */}
      <TouchableOpacity
        style={[
          styles.signInBtn,
          loading && styles.signInBtnDisabled
        ]}
        onPress={handleAdminSignIn}
        activeOpacity={0.88}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Sign in as Administrator"
      >
        <Text style={styles.signInBtnText}>
          {loading ? 'Authenticating…' : 'Sign in to Control Room →'}
        </Text>
      </TouchableOpacity>

      {/* Governance & Security Note */}
      <View style={styles.governanceNotice}>
        <Icon name="shieldCheck" size={16} color="#C2410C" />
        <Text style={styles.governanceText}>
          Strict Domain Governance active • @hbplus.fit only
        </Text>
      </View>

      {/* Switch to user portal */}
      <View style={styles.switchRoleRow}>
        <Text style={styles.switchRoleText}>Looking for employee workspace?</Text>
        <TouchableOpacity
          onPress={() => navigate(ROUTES.LOGIN_USER)}
          activeOpacity={0.7}
        >
          <Text style={styles.switchRoleAction}>User Sign in</Text>
        </TouchableOpacity>
      </View>
    </SquaredCard>
  );

  return (
    <View style={styles.container}>
      {/* ── PHONE LAYOUT (< 900px) ── */}
      {!isDesktop ? (
        <>
          {/* Warm Coral-Orange Gradient Background */}
          <View style={styles.phoneBg} pointerEvents="none" />

          {/* Floating Back Button with safe-area spacing */}
          <TouchableOpacity
            style={styles.phoneBackBtn}
            onPress={() => navigate(ROUTES.ROLE_SELECT)}
            activeOpacity={0.8}
            accessibilityLabel="Back to Role Select"
          >
            <Icon name="arrowLeft" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Header area: illustration + title */}
          <View style={styles.phoneHeader} pointerEvents="none">
            {Platform.OS === 'web' ? (
              <img
                src={adminIllustration}
                alt="Admin Control"
                style={{
                  width: 180,
                  height: 150,
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            ) : null}
            <View style={styles.phoneTitleRow}>
              <Icon name="shieldCheck" size={22} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.phoneTitleText}>Admin Control</Text>
            </View>
          </View>

          {/* Floating White Card Overlapping Gradient */}
          <ScrollView
            style={styles.phoneScroll}
            contentContainerStyle={styles.phoneScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={[
                styles.phoneCardWrapper,
                {
                  opacity: opacityAnim,
                  transform: [{ translateY: slideAnim }, { translateX: shakeAnim }]
                }
              ]}
            >
              <FormCard />
            </Animated.View>
          </ScrollView>
        </>
      ) : (
        /* ── DESKTOP SPLIT SCREEN (>= 900px) ── */
        <View style={styles.desktopContainer}>
          {/* Left 42%: Coral-Orange Gradient Panel */}
          <View style={styles.desktopLeftPanel}>
            {/* Subtle Grid Overlay */}
            <View style={styles.desktopPatternOverlay} pointerEvents="none">
              <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                <defs>
                  <pattern id="adminGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#adminGrid)" />
              </svg>
            </View>

            {/* Desktop Back Button */}
            <TouchableOpacity
              style={styles.desktopBackBtn}
              onPress={() => navigate(ROUTES.ROLE_SELECT)}
              activeOpacity={0.8}
              accessibilityLabel="Back to Role Select"
            >
              <Icon name="arrowLeft" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.desktopBrandBox}>
              <HBLogo size={56} />
              {Platform.OS === 'web' ? (
                <img
                  src={adminIllustration}
                  alt="Admin Control Room"
                  style={{
                    width: 'min(82%, 400px)',
                    height: 220,
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              ) : null}
              <View style={styles.desktopTitleRow}>
                <Icon name="shieldCheck" size={26} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.desktopTitleText}>Admin Control</Text>
              </View>
              <View style={styles.desktopBadgePill}>
                <Text style={styles.desktopBadgeText}>Central Governance</Text>
              </View>
            </View>
          </View>

          {/* Right 58%: Warm Cream Form Area */}
          <View style={styles.desktopRightArea}>
            <Animated.View
              style={[
                styles.desktopFormWrapper,
                {
                  opacity: opacityAnim,
                  transform: [{ translateY: slideAnim }, { translateX: shakeAnim }]
                }
              ]}
            >
              <FormCard />
            </Animated.View>
          </View>
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
    backgroundColor: '#FFF7ED'
  },

  /* ── PHONE LAYOUT ── */
  phoneBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '46%',
    backgroundColor: '#C2410C',
    ...(Platform.OS === 'web'
      ? {
          backgroundImage:
            'linear-gradient(180deg, #C2410C 0%, #EA580C 40%, #F97316 75%, #FFF7ED 100%)'
        }
      : {})
  },
  phoneBackBtn: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 'max(42px, env(safe-area-inset-top, 42px))' : 42,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30
  },
  phoneHeader: {
    paddingTop: Platform.OS === 'web' ? 'max(46px, env(safe-area-inset-top, 46px))' : 46,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  phoneTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8
  },
  phoneTitleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3
  },
  phoneScroll: {
    flex: 1,
    zIndex: 20
  },
  phoneScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'web' ? 'max(36px, env(safe-area-inset-bottom, 36px))' : 36,
    alignItems: 'center'
  },
  phoneCardWrapper: {
    width: '100%',
    maxWidth: 440
  },

  /* ── CARD & FORM ── */
  adminCard: {
    width: '100%',
    padding: 24,
    gap: 16,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#C2410C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4
  },
  cardHeaderArea: {
    gap: 4,
    marginBottom: 4
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 10
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    flex: 1,
    fontWeight: '500'
  },
  signInBtn: {
    height: 50,
    borderRadius: 16,
    backgroundColor: '#C2410C',
    ...(Platform.OS === 'web'
      ? {
          backgroundImage: 'linear-gradient(135deg, #F97316 0%, #C2410C 100%)',
          boxShadow: '0 8px 20px -4px rgba(194, 65, 12, 0.35)'
        }
      : {}),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6
  },
  signInBtnDisabled: {
    opacity: 0.65
  },
  signInBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2
  },
  governanceNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12
  },
  governanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C2410C'
  },
  switchRoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 6
  },
  switchRoleText: {
    fontSize: 13,
    color: '#64748B'
  },
  switchRoleAction: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C2410C'
  },

  /* ── DESKTOP SPLIT SCREEN ── */
  desktopContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  desktopLeftPanel: {
    width: '42%',
    backgroundColor: '#C2410C',
    ...(Platform.OS === 'web'
      ? {
          backgroundImage:
            'linear-gradient(160deg, #9A3412 0%, #C2410C 45%, #EA580C 100%)'
        }
      : {}),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 40
  },
  desktopPatternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  desktopBackBtn: {
    position: 'absolute',
    top: 32,
    left: 32,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20
  },
  desktopBrandBox: {
    alignItems: 'center',
    gap: 14,
    maxWidth: 420
  },
  desktopTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  desktopTitleText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5
  },
  desktopBadgePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999
  },
  desktopBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase'
  },
  desktopRightArea: {
    width: '58%',
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 60,
    paddingRight: 40
  },
  desktopFormWrapper: {
    width: '100%',
    maxWidth: 440
  }
});

export default AdminLoginScreen;
