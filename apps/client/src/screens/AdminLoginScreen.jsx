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
import SquaredInput from '../components/ui/SquaredInput.jsx';
import { ROUTES } from '../navigation/navigationConfig.js';
import adminIllustration from '../assets/illustrations/admin-secure-login.svg';

function AdminLoginInner() {
  const { signInAdmin, sendPasswordReset, navigate } = useAuth();
  const theme = useRoleTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

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
    setSuccessMessage('');

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

  const handleForgotPassword = async () => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Enter your administrator email first.');
      triggerShake();
      return;
    }
    setError(null);
    setSuccessMessage('');
    setLoading(true);
    try {
      await sendPasswordReset(cleanEmail);
      setSuccessMessage(`Password reset link sent to ${cleanEmail}`);
    } catch (err) {
      setError(err.message || 'Could not send the reset email.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => (
    <View style={styles.formFieldsContainer}>
      {error ? (
        <View style={styles.errorBox}>
          <Icon name="alertTriangle" size={16} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {successMessage ? (
        <View style={styles.successBox}>
          <Icon name="checkCircle" size={16} color="#0B7A42" />
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      ) : null}

      <SquaredInput
        label="Administrator Email"
        iconName="mail"
        value={email}
        onChangeText={setEmail}
        placeholder="admin@hbplus.fit"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
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

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={handleForgotPassword}
        activeOpacity={0.7}
        disabled={loading}
      >
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
        onPress={handleAdminSignIn}
        activeOpacity={0.88}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Sign in as Administrator"
      >
        <Text style={styles.primaryBtnText}>
          {loading ? 'Authenticating…' : 'Sign in as Administrator →'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 4px Deep-Teal Identity Strip across the top */}
      <View style={[styles.identityStrip, { backgroundColor: theme.identityStrip }]} />

      {/* DESKTOP SPLIT SCREEN */}
      {isDesktop ? (
        <View style={styles.desktopContainer}>
          {/* Left 42%: Control Panel Branding */}
          <View style={styles.desktopLeftPanel}>
            <View style={styles.abstractPattern} pointerEvents="none">
              <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                <defs>
                  <pattern id="adminGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(234, 88, 12, 0.06)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#adminGrid)" />
                <path
                  d="M120 180 L200 140 L280 180 L280 280 C280 340 200 400 200 400 C200 400 120 340 120 280 Z"
                  fill="none"
                  stroke="rgba(234, 88, 12, 0.05)"
                  strokeWidth="2"
                />
              </svg>
            </View>

            <TouchableOpacity
              style={styles.desktopBackBtn}
              onPress={() => navigate(ROUTES.ROLE_SELECT)}
              activeOpacity={0.8}
              accessibilityLabel="Back to Role Select"
            >
              <Icon name="arrowLeft" size={18} color="#0F172A" />
            </TouchableOpacity>

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

          {/* Right 58%: Plain Data Entry Form Area */}
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
              <View style={styles.desktopFormHeader}>
                <Text style={styles.desktopFormTitle}>Admin Authentication</Text>
                <Text style={styles.desktopFormSubtitle}>
                  Restricted portal for operations, governance and attendance audit
                </Text>
              </View>

              {renderFormFields()}
            </Animated.View>
          </View>
        </View>
      ) : (
        /* PHONE LAYOUT (PLAIN DATA ENTERING SYSTEM, NO OVERLAY BOX) */
        <ScrollView
          style={styles.phoneScroll}
          contentContainerStyle={styles.phoneScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Bar with Back Button and Role Badge */}
          <View style={styles.phoneTopBar}>
            <TouchableOpacity
              style={styles.backPillBtn}
              onPress={() => navigate(ROUTES.ROLE_SELECT)}
              activeOpacity={0.8}
              accessibilityLabel="Back to Role Select"
            >
              <Icon name="arrowLeft" size={18} color="#0F172A" />
            </TouchableOpacity>

            <View style={styles.roleBadgePill}>
              <View style={styles.roleBadgeDot} />
              <Text style={styles.roleBadgeText}>Admin Control</Text>
            </View>
          </View>

          {/* Header area with illustration and titles */}
          <View style={styles.phoneHeaderArea}>
            {Platform.OS === 'web' ? (
              <img
                src={adminIllustration}
                alt="Admin Control"
                style={{
                  width: 150,
                  height: 110,
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            ) : null}

            <Text style={styles.mainTitleText}>Administrator Sign in</Text>
            <Text style={styles.subTitleText}>
              Manage workforce governance, live attendance and approvals
            </Text>
          </View>

          {/* Plain Data Entering Container */}
          <Animated.View
            style={[
              styles.phonePlainFormArea,
              {
                opacity: opacityAnim,
                transform: [{ translateY: slideAnim }, { translateX: shakeAnim }]
              }
            ]}
          >
            {renderFormFields()}
          </Animated.View>
        </ScrollView>
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

const ORANGE_BTN_GRADIENT = Platform.OS === 'web'
  ? { backgroundImage: 'linear-gradient(135deg, #C2410C 0%, #EA580C 50%, #F97316 100%)' }
  : { backgroundColor: '#C2410C' };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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

  /* ── Desktop Split Screen ── */
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
    height: '100%'
  },
  desktopLeftPanel: {
    width: '42%',
    backgroundColor: '#FFF7ED',
    borderRightWidth: 1,
    borderRightColor: '#FED7AA',
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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48
  },
  desktopFormWrapper: {
    width: '100%',
    maxWidth: 420
  },
  desktopFormHeader: {
    marginBottom: 24,
    gap: 6
  },
  desktopFormTitle: {
    color: '#0F172A',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4
  },
  desktopFormSubtitle: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500'
  },

  /* ── Phone Layout (Plain data entering system, no overlay box) ── */
  phoneScroll: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  phoneScrollContent: {
    paddingHorizontal: 22,
    paddingTop: 52,
    paddingBottom: 40,
    alignItems: 'center',
    flexGrow: 1
  },
  phoneTopBar: {
    width: '100%',
    maxWidth: 440,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  backPillBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  roleBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5'
  },
  roleBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#EA580C'
  },
  roleBadgeText: {
    color: '#EA580C',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2
  },

  phoneHeaderArea: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    maxWidth: 440,
    gap: 6
  },
  mainTitleText: {
    color: '#0F172A',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginTop: 6,
    textAlign: 'center'
  },
  subTitleText: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 12
  },

  phonePlainFormArea: {
    width: '100%',
    maxWidth: 440
  },

  /* ── Form Fields Container (Plain layout, NO card borders/shadows) ── */
  formFieldsContainer: {
    width: '100%',
    gap: 16
  },

  /* ── Primary Action Button ── */
  primaryBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...ORANGE_BTN_GRADIENT,
    marginTop: 8,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)' }
      : { elevation: 3 })
  },
  primaryBtnDisabled: {
    opacity: 0.65
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2
  },

  /* ── Error Banner ── */
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FECACA'
  },
  errorText: {
    flex: 1,
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500'
  },

  /* ── Success Banner ── */
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  successText: {
    flex: 1,
    color: '#065F46',
    fontSize: 13,
    fontWeight: '500'
  },

  /* ── Forgot password ── */
  forgotButton: {
    alignSelf: 'flex-end',
    minHeight: 28,
    justifyContent: 'center',
    marginTop: -4,
    paddingHorizontal: 4
  },
  forgotText: {
    color: '#EA580C',
    fontSize: 13,
    fontWeight: '700'
  }
});

export default AdminLoginScreen;