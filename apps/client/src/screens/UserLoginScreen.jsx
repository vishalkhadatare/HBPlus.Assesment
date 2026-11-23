import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Animated
} from 'react-native';
import { useAuth } from '../hooks/useAuth.js';
import HBLogo from '../components/brand/HBLogo.jsx';
import Icon from '../components/ui/Icon.jsx';
import { ROUTES } from '../navigation/navigationConfig.js';

function GoogleIcon({ size = 18 }) {
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
  const { signInUserWithGoogle, signInUserWithPassword, navigate } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState(null);

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
    <View style={styles.root}>
      {/* Background Soft Gradient */}
      <View style={styles.gradientBg} pointerEvents="none" />

      {/* Top Bar with Back Button */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigate(ROUTES.ROLE_SELECT)}
          activeOpacity={0.7}
          accessibilityLabel="Back"
        >
          <Icon name="arrowLeft" size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentWrapper}>
        {/* Small Logo & Title */}
        <View style={styles.headerArea}>
          <HBLogo size={52} />
          <Text style={styles.title}>User</Text>
        </View>

        {/* Login Card */}
        <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}>
          {error ? (
            <View style={styles.errorBox}>
              <Icon name="alertTriangle" size={16} color="#DC2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Google Sign In Button */}
          <TouchableOpacity
            style={[styles.googleBtn, loadingGoogle && styles.btnDisabled]}
            onPress={handleGoogleSignIn}
            disabled={loadingGoogle || loading}
            activeOpacity={0.85}
          >
            {loadingGoogle ? (
              <ActivityIndicator color="#0F172A" size="small" />
            ) : (
              <>
                <GoogleIcon size={18} />
                <Text style={styles.googleBtnText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Simple "or" Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email / Password Form */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputContainer}>
              <Icon name="mail" size={18} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="employee@hbplus.fit"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading && !loadingGoogle}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputContainer}>
              <Icon name="lock" size={18} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, { paddingRight: 40 }]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                editable={!loading && !loadingGoogle}
                onSubmitEditing={handleEmailSignIn}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Icon
                  name={showPassword ? 'eyeOff' : 'eye'}
                  size={18}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.btnDisabled]}
            onPress={handleEmailSignIn}
            disabled={loading || loadingGoogle}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Sign in</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F7FBFA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    position: 'relative'
  },
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F7FBFA',
    ...(Platform.OS === 'web'
      ? { backgroundImage: 'linear-gradient(180deg, #F7FBFA 0%, #E4F5EF 100%)' }
      : {})
  },
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 24 : 48,
    left: 24,
    zIndex: 20
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    zIndex: 10
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 28,
    gap: 12
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    gap: 16
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8
  },
  errorText: {
    flex: 1,
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500'
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1
  },
  googleBtnText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '600'
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0'
  },
  dividerText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500'
  },
  inputGroup: {
    gap: 6
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 48
  },
  inputIcon: {
    marginRight: 8
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    height: '100%',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {})
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    padding: 6
  },
  submitBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#00B386',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#00B386',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2
  },
  btnDisabled: {
    opacity: 0.6
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600'
  }
});

export default UserLoginScreen;
