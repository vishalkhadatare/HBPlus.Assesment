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

export function AdminLoginScreen() {
  const { signInAdmin, navigate } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
          <Text style={styles.title}>Admin</Text>
        </View>

        {/* Login Form */}
        <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}>
          {error ? (
            <View style={styles.errorBox}>
              <Icon name="alertTriangle" size={16} color="#DC2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputContainer}>
              <Icon name="mail" size={18} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="admin@hbplus.fit"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                onSubmitEditing={() => {}}
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
                editable={!loading}
                onSubmitEditing={handleAdminSignIn}
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
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleAdminSignIn}
            disabled={loading}
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
    gap: 18
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
    marginTop: 6,
    shadowColor: '#00B386',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2
  },
  submitBtnDisabled: {
    opacity: 0.6
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600'
  }
});

export default AdminLoginScreen;
