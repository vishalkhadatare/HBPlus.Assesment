import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
  Animated
} from 'react-native';
import { useAuth } from '../hooks/useAuth.js';
import HBLogo from '../components/brand/HBLogo.jsx';
import Icon from '../components/ui/Icon.jsx';
import { ROUTES } from '../navigation/navigationConfig.js';

function GoogleG({ size = 20 }) {
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

export function UserLoginScreen() {
  const { signInUserWithGoogle, signInUserWithPassword, sendPasswordReset, navigate } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true })
    ]).start();
  };

  const handleGoogleSignIn = async () => {
    if (loadingGoogle || loading) return;
    setError(null);
    setInfoMessage(null);
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
    setInfoMessage(null);

    if (!email.trim()) {
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
      await signInUserWithPassword(email.trim(), password);
    } catch (err) {
      setError(err.message || 'Authentication failed.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email address first.');
      triggerShake();
      return;
    }
    try {
      await sendPasswordReset(email.trim());
      setInfoMessage('Password reset email sent. Please check your inbox.');
      setError(null);
    } catch (err) {
      setError(err.message || 'Could not send reset email.');
      triggerShake();
    }
  };

  return (
    <View style={styles.root}>
      {/* Aurora Ambient Background */}
      <View style={styles.gradientBg} pointerEvents="none" />

      <View style={[styles.mainWrapper, isWide && styles.mainWrapperWide]}>
        {/* Navigation Bar: Back & Switch */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigate(ROUTES.ROLE_SELECT)}
            activeOpacity={0.7}
          >
            <Icon name="arrowLeft" size={18} color="#FFFFFF" />
            <Text style={styles.backBtnText}>Role Select</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchBtn}
            onPress={() => navigate(ROUTES.LOGIN_ADMIN)}
            activeOpacity={0.7}
          >
            <Text style={styles.switchBtnText}>Switch to Admin Sign In →</Text>
          </TouchableOpacity>
        </View>

        {/* Central Sign-In Card */}
        <View style={[styles.card, isWide ? styles.cardWide : styles.cardSheet]}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <HBLogo size={48} />
            <View style={styles.roleBadge}>
              <Icon name="user" size={14} color="#B54708" strokeWidth={2.5} />
              <Text style={styles.roleBadgeText}>EMPLOYEE WORKSPACE</Text>
            </View>
            <Text style={styles.title}>User Sign In</Text>
            <Text style={styles.subtitle}>
              Sign in with your official @hbplus.fit Google account or password.
            </Text>
          </View>

          {/* Info Banner */}
          {infoMessage ? (
            <View style={styles.infoBanner}>
              <Icon name="checkCircle" size={16} color="#0B7A42" />
              <Text style={styles.infoBannerText}>{infoMessage}</Text>
            </View>
          ) : null}

          {/* Error Banner with Shake */}
          {error ? (
            <Animated.View style={[styles.errorBanner, { transform: [{ translateX: shakeAnim }] }]}>
              <Icon name="alertTriangle" size={16} color="#B42318" />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
              <TouchableOpacity onPress={() => setError(null)}>
                <Icon name="x" size={14} color="#B42318" />
              </TouchableOpacity>
            </Animated.View>
          ) : null}

          {/* Primary Action: Continue with Google */}
          <TouchableOpacity
            style={[styles.googleBtn, loadingGoogle && styles.btnDisabled]}
            onPress={handleGoogleSignIn}
            disabled={loadingGoogle || loading}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
          >
            {loadingGoogle ? (
              <View style={styles.btnLoadingRow}>
                <ActivityIndicator size="small" color="#00B386" />
                <Text style={styles.googleBtnText}>Connecting to Google...</Text>
              </View>
            ) : (
              <View style={styles.googleBtnInner}>
                <GoogleG size={20} />
                <Text style={styles.googleBtnText}>Continue with Google</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign in with password</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Form Fields */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Company Email Address</Text>
            <View style={styles.inputContainer}>
              <Icon name="mail" size={18} color="#7E918C" />
              <TextInput
                style={styles.inputField}
                placeholder="employee@hbplus.fit"
                placeholderTextColor="#A0B0AB"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading && !loadingGoogle}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.passwordLabelRow}>
              <Text style={styles.inputLabel}>Password</Text>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Icon name="lock" size={18} color="#7E918C" />
              <TextInput
                style={styles.inputField}
                placeholder="Enter your password"
                placeholderTextColor="#A0B0AB"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading && !loadingGoogle}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} color="#7E918C" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.btnDisabled]}
            onPress={handleEmailSignIn}
            disabled={loading || loadingGoogle}
            activeOpacity={0.88}
          >
            {loading ? (
              <View style={styles.btnLoadingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.primaryBtnText}>Authenticating credentials...</Text>
              </View>
            ) : (
              <Text style={styles.primaryBtnText}>Sign In as User</Text>
            )}
          </TouchableOpacity>

          {/* Security Policy Footer */}
          <View style={styles.policyFooter}>
            <Icon name="shieldCheck" size={14} color="#51635E" />
            <Text style={styles.policyFooterText}>
              Restricted to verified <Text style={{ fontWeight: '700', color: '#00B386' }}>@hbplus.fit</Text> accounts
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#04100E',
    overflow: 'hidden'
  },
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    ...(Platform.OS === 'web'
      ? {
          background: 'linear-gradient(150deg, #04100E 0%, #07302A 50%, #0B5D4B 100%)'
        }
      : {
          backgroundColor: '#07302A'
        })
  },
  mainWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32
  },
  mainWrapperWide: {
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%'
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  switchBtn: {
    paddingVertical: 4
  },
  switchBtnText: {
    color: '#FFB020',
    fontSize: 13,
    fontWeight: '700'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    gap: 14,
    boxShadow: '0 20px 48px rgba(4, 16, 14, 0.45)',
    elevation: 8
  },
  cardSheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32
  },
  cardWide: {
    borderRadius: 28
  },
  cardHeader: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 2
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF7E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999
  },
  roleBadgeText: {
    color: '#B54708',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0A1A17',
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 13.5,
    color: '#51635E',
    textAlign: 'center',
    lineHeight: 19
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E3F8EC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B5E8CE'
  },
  infoBannerText: {
    color: '#0B7A42',
    fontSize: 13,
    fontWeight: '600',
    flex: 1
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE4E2',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECDCA'
  },
  errorBannerText: {
    color: '#B42318',
    fontSize: 13,
    fontWeight: '600'
  },
  googleBtn: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDE8E5',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(10, 26, 23, 0.06)',
    elevation: 2
  },
  googleBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0A1A17'
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 2
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDE8E5'
  },
  dividerText: {
    fontSize: 12,
    color: '#7E918C',
    fontWeight: '500'
  },
  formGroup: {
    gap: 6
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0A1A17'
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  forgotPasswordText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00B386'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    borderWidth: 1,
    borderColor: '#DDE8E5',
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: '#F4F8F7'
  },
  inputField: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#0A1A17',
    outlineStyle: 'none'
  },
  primaryBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#00B386',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    boxShadow: '0 8px 20px rgba(0, 179, 134, 0.3)',
    elevation: 4
  },
  btnDisabled: {
    opacity: 0.7
  },
  btnLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },
  policyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 2
  },
  policyFooterText: {
    fontSize: 12,
    color: '#51635E',
    fontWeight: '500'
  }
});

export default UserLoginScreen;
