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

function GoogleIcon({ size = 20 }) {
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

function UserLoginInner() {
  const { signInUserWithGoogle, signInUserWithPassword, navigate } = useAuth();
  const theme = useRoleTheme();
  const { width } = useWindowDimensions();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState(null);

  // Soft, bouncy 320ms slide-up entrance animation (Section 3 & 4)
  const slideAnim = useRef(new Animated.Value(36)).current;
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
        duration: 320,
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

  const handleGoogleSignIn = async () => {
    if (loadingGoogle || loading) return;
    setError(null);
    setLoadingGoogle(true);

    try {
      await signInUserWithGoogle();
    } catch (err) {
      setError(err.message || 'Google authentication failed.');
      triggerShake();
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleEmailSignIn = async () => {
    if (loading || loadingGoogle) return;
    setError(null);

    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please enter your company email address.');
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
      await signInUserWithPassword(cleanEmail, password);
    } catch (err) {
      setError(err.message || 'Authentication failed.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 4px Amber Identity Strip across the top (Section 3) */}
      <View style={[styles.identityStrip, { backgroundColor: theme.identityStrip }]} />

      {/* Soft decorative shape (large, 10% opacity amber/emerald circle) in top corner */}
      <View style={styles.decorativeOrb} pointerEvents="none" />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigate(ROUTES.ROLE_SELECT)}
        activeOpacity={0.8}
        accessibilityLabel="Back to Role Select"
      >
        <Icon name="arrowLeft" size={18} color="#0F172A" />
      </TouchableOpacity>

      {/* Centered Single Card over warm mint-cream background (Section 4) */}
      <ScrollView
        style={styles.centerScroll}
        contentContainerStyle={styles.centerArea}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={[
            styles.cardWrapper,
            {
              opacity: opacityAnim,
              transform: [{ translateY: slideAnim }, { translateX: shakeAnim }]
            }
          ]}
        >
          {/* Centered Small Logo & Title with UserCircle Icon */}
          <View style={styles.brandHeader}>
            <HBLogo size={56} />
            {Platform.OS === 'web' ? (
              <img
                src="/src/assets/illustrations/user-workspace.svg"
                alt="User workspace illustration"
                style={{
                  width: width >= 600 ? 220 : 170,
                  height: width >= 600 ? 118 : 92,
                  objectFit: 'contain',
                  marginTop: -6,
                  marginBottom: -6,
                  display: 'block'
                }}
              />
            ) : null}
            <View style={styles.titleRow}>
              <Icon name="userCircle" size={24} color="#FFB020" strokeWidth={2.4} />
              <Text style={styles.titleText}>User</Text>
            </View>
            <View style={styles.userBadgePill}>
              <Text style={styles.userBadgeText}>Workspace</Text>
            </View>
          </View>

          <SquaredCard style={styles.userCard}>
            {error ? (
              <View style={styles.errorBox}>
                <Icon name="alertTriangle" size={16} color="#DC2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* 1. Continue with Google Button first */}
            <SquaredButton
              title="Continue with Google"
              variant="google"
              icon={<GoogleIcon size={20} />}
              onPress={handleGoogleSignIn}
              loading={loadingGoogle}
              disabled={loading}
            />

            {/* 2. Simple "or" Divider (1px line at ~10% opacity of role's colour) */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: 'rgba(0, 179, 134, 0.15)' }]} />
              <Text style={styles.dividerText}>or</Text>
              <View style={[styles.dividerLine, { backgroundColor: 'rgba(0, 179, 134, 0.15)' }]} />
            </View>

            {/* 3. Email & Password Inputs */}
            <SquaredInput
              label="Email"
              iconName="mail"
              value={email}
              onChangeText={setEmail}
              placeholder="employee@hbplus.fit"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading && !loadingGoogle}
            />

            <SquaredInput
              label="Password"
              iconName="lock"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={true}
              showPasswordToggle={true}
              editable={!loading && !loadingGoogle}
              onSubmitEditing={handleEmailSignIn}
            />

            {/* 4. Sign in Button (User Gradient) */}
            <SquaredButton
              title="Sign in"
              onPress={handleEmailSignIn}
              loading={loading}
              disabled={loadingGoogle}
              style={{ marginTop: 6 }}
            />
          </SquaredCard>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

export function UserLoginScreen() {
  return (
    <RoleThemeProvider role="user">
      <UserLoginInner />
    </RoleThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FBF7',
    ...(Platform.OS === 'web'
      ? { backgroundImage: 'linear-gradient(180deg, #F5FBF7 0%, #E6F6EE 100%)' }
      : {}),
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
  decorativeOrb: {
    position: 'absolute',
    top: -120,
    right: -100,
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: 'rgba(255, 176, 32, 0.08)',
    ...(Platform.OS === 'web' ? { filter: 'blur(50px)' } : {})
  },
  centerScroll: {
    flex: 1
  },
  backBtn: {
    position: 'absolute',
    top: 28,
    left: 24,
    width: 38,
    height: 38,
    borderRadius: CARD_RADIUS,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 440,
    alignItems: 'center'
  },
  brandHeader: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 24
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  titleText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3
  },
  userBadgePill: {
    backgroundColor: '#FFF7E6',
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 32, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: CARD_RADIUS
  },
  userBadgeText: {
    color: '#B57400',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase'
  },
  userCard: {
    width: '100%',
    padding: 28,
    gap: 16
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4
  },
  dividerLine: {
    flex: 1,
    height: 1
  },
  dividerText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600'
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

export default UserLoginScreen;
