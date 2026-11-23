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

export function AdminLoginScreen() {
  const { signInAdmin, sendPasswordReset, navigate } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const handleAdminSignIn = async () => {
    if (loading) return;
    setError(null);
    setInfoMessage(null);

    if (!email.trim()) {
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
      await signInAdmin(email.trim(), password);
    } catch (err) {
      setError(err.message || 'Authentication failed.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your administrator email first.');
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
            onPress={() => navigate(ROUTES.LOGIN_USER)}
            activeOpacity={0.7}
          >
            <Text style={styles.switchBtnText}>Switch to User Sign In →</Text>
          </TouchableOpacity>
        </View>

        {/* Central Sign-In Card */}
        <View style={[styles.card, isWide ? styles.cardWide : styles.cardSheet]}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <HBLogo size={48} />
            <View style={styles.roleBadge}>
              <Icon name="shieldCheck" size={14} color="#00775B" strokeWidth={2.5} />
              <Text style={styles.roleBadgeText}>ADMINISTRATOR PORTAL</Text>
            </View>
            <Text style={styles.title}>Admin Sign In</Text>
            <Text style={styles.subtitle}>
              Administrator accounts are provisioned securely by the company.
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

          {/* Form Fields */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Admin Email Address</Text>
            <View style={styles.inputContainer}>
              <Icon name="mail" size={18} color="#7E918C" />
              <TextInput
                style={styles.inputField}
                placeholder="admin@hbplus.fit"
                placeholderTextColor="#A0B0AB"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
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
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} color="#7E918C" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.btnDisabled]}
            onPress={handleAdminSignIn}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <View style={styles.btnLoadingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.primaryBtnText}>Authenticating credentials...</Text>
              </View>
            ) : (
              <Text style={styles.primaryBtnText}>Sign In as Admin</Text>
            )}
          </TouchableOpacity>

          {/* Security Policy Footer */}
          <View style={styles.policyFooter}>
            <Icon name="shieldCheck" size={14} color="#51635E" />
            <Text style={styles.policyFooterText}>
              Protected by Zero-Trust Domain Policy (<Text style={{ fontWeight: '700', color: '#00B386' }}>@hbplus.fit</Text>)
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
    color: '#2EE6B6',
    fontSize: 13,
    fontWeight: '700'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    gap: 16,
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
    marginBottom: 4
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E0F8F1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999
  },
  roleBadgeText: {
    color: '#00775B',
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
    height: 52,
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
    height: 54,
    borderRadius: 16,
    backgroundColor: '#00B386',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
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
    fontSize: 15.5,
    fontWeight: '700'
  },
  policyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4
  },
  policyFooterText: {
    fontSize: 12,
    color: '#51635E',
    fontWeight: '500'
  }
});

export default AdminLoginScreen;
