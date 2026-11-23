import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Animated,
  ScrollView,
  Modal,
  TextInput
} from 'react-native';
import { useAuth } from '../hooks/useAuth.js';
import { RoleThemeProvider, useRoleTheme } from '../theme/roleThemes.js';
import { CARD_RADIUS } from '../theme/shape.js';
import HBLogo from '../components/brand/HBLogo.jsx';
import Icon from '../components/ui/Icon.jsx';
import SquaredCard from '../components/ui/SquaredCard.jsx';
import SquaredInput from '../components/ui/SquaredInput.jsx';
import SquaredButton from '../components/ui/SquaredButton.jsx';
import CountryFlag from '../components/ui/CountryFlag.jsx';
import { ALL_COUNTRIES, DEFAULT_COUNTRY } from '../constants/countries.js';
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
  const {
    signInUserWithGoogle,
    signInUserWithPassword,
    signUpEmployee,
    sendPasswordReset,
    navigate
  } = useAuth();
  const theme = useRoleTheme();
  const { width } = useWindowDimensions();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [fullName, setFullName] = useState('');
  const [emailLocal, setEmailLocal] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY);
  const [countrySheetOpen, setCountrySheetOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const filteredCountries = ALL_COUNTRIES.filter((c) => {
    if (!countrySearch.trim()) return true;
    const q = countrySearch.trim().toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.iso.toLowerCase().includes(q)
    );
  });

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

  const handleForgotPassword = async () => {
    const cleanEmail = mode === 'signup'
      ? `${emailLocal.trim().toLowerCase()}@hbplus.fit`
      : (email || '').trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Enter your employee email first.');
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

  const handleSignUp = async () => {
    if (loading || loadingGoogle) return;
    setError(null);
    setSuccessMessage('');

    if (!fullName.trim()) {
      setError('Please enter the employee name.');
      triggerShake();
      return;
    }
    if (!emailLocal.trim()) {
      setError('Please enter the employee email name.');
      triggerShake();
      return;
    }
    if (!phone.trim()) {
      setError('Please enter the mobile number.');
      triggerShake();
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      triggerShake();
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const result = await signUpEmployee({
        fullName,
        emailLocal,
        phone: `${countryCode.code} ${phone.trim()}`,
        countryCode: countryCode.code,
        password
      });
      setSuccessMessage(
        `Account created for ${result.email}. Check your employee inbox to verify the email before signing in.`
      );
      setFullName('');
      setEmailLocal('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Could not create the employee account.');
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
        style={[styles.backBtn, width < 900 && styles.phoneBackBtn]}
        onPress={() => navigate(ROUTES.ROLE_SELECT)}
        activeOpacity={0.8}
        accessibilityLabel="Back to Role Select"
      >
        <Icon name="arrowLeft" size={18} color={width < 900 ? '#FFFFFF' : '#0F172A'} />
      </TouchableOpacity>

      {width < 900 ? (
        <View style={styles.phoneHeaderBand}>
          {Platform.OS === 'web' ? (
            <img
              src="/src/assets/illustrations/user-workspace.svg"
              alt=""
              style={{
                width: 210,
                height: 112,
                objectFit: 'contain',
                marginBottom: -2,
                display: 'block'
              }}
            />
          ) : null}
          <View style={styles.phoneTitleRow}>
            <Icon name="userCircle" size={22} color="#FFB020" strokeWidth={2.4} />
            <Text style={styles.phoneTitleText}>User</Text>
          </View>
        </View>
      ) : null}

      {/* Centered Single Card over warm mint-cream background (Section 4) */}
      <ScrollView
        style={styles.centerScroll}
        contentContainerStyle={[
          styles.centerArea,
          width < 900 && styles.phoneCenterArea
        ]}
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
          {/* Desktop brand header */}
          {width >= 900 ? (
            <View style={styles.brandHeader}>
              <HBLogo size={56} />
              {Platform.OS === 'web' ? (
                <img
                  src="/src/assets/illustrations/user-workspace.svg"
                  alt="User workspace illustration"
                  style={{
                    width: 220,
                    height: 118,
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
          ) : null}

          <SquaredCard style={styles.userCard}>
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

            {mode === 'login' ? (
              <>
                <SquaredButton
                  title="Continue with Google"
                  variant="google"
                  icon={<GoogleIcon size={20} />}
                  onPress={handleGoogleSignIn}
                  loading={loadingGoogle}
                  disabled={loading}
                />

                <View style={styles.dividerRow}>
                  <View style={[styles.dividerLine, { backgroundColor: 'rgba(0, 179, 134, 0.15)' }]} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={[styles.dividerLine, { backgroundColor: 'rgba(0, 179, 134, 0.15)' }]} />
                </View>

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

                <TouchableOpacity
                  style={styles.forgotButton}
                  onPress={handleForgotPassword}
                  activeOpacity={0.7}
                  disabled={loading}
                >
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>

                <SquaredButton
                  title="Sign in"
                  onPress={handleEmailSignIn}
                  loading={loading}
                  disabled={loadingGoogle}
                  style={{ marginTop: 2 }}
                />

                <View style={styles.accountSwitchRow}>
                  <Text style={styles.accountSwitchText}>New employee?</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setMode('signup');
                      setError(null);
                      setSuccessMessage('');
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.accountSwitchAction}>Create account</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <SquaredInput
                  label="Employee name"
                  iconName="user"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter full name"
                  editable={!loading}
                />

                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldLabel}>Email</Text>
                  <View style={styles.emailDomainRow}>
                    <TextInput
                      value={emailLocal}
                      onChangeText={(value) => setEmailLocal(value.replace(/[^a-zA-Z0-9._-]/g, '').toLowerCase())}
                      placeholder="employee.name"
                      placeholderTextColor="#94A3B8"
                      style={styles.emailLocalInput}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!loading}
                      accessibilityLabel="Employee email name"
                    />
                    <Text style={styles.fixedDomain}>@hbplus.fit</Text>
                  </View>
                </View>

                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldLabel}>Mobile number</Text>
                  <View style={styles.phoneRow}>
                    <TouchableOpacity
                      style={styles.countryButton}
                      onPress={() => setCountrySheetOpen(true)}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel={`Country code ${countryCode.code}`}
                    >
                      <CountryFlag iso={countryCode.iso} width={26} height={17} />
                      <Text style={styles.countryCode}>{countryCode.code}</Text>
                      <Icon name="chevronDown" size={14} color="#64748B" />
                    </TouchableOpacity>
                    <TextInput
                      value={phone}
                      onChangeText={(value) => setPhone(value.replace(/[^0-9]/g, '').slice(0, 15))}
                      placeholder="Mobile number"
                      placeholderTextColor="#94A3B8"
                      keyboardType="phone-pad"
                      style={styles.phoneInput}
                      editable={!loading}
                      accessibilityLabel="Mobile number"
                    />
                  </View>
                </View>

                <SquaredInput
                  label="Password"
                  iconName="lock"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Minimum 8 characters"
                  secureTextEntry={true}
                  showPasswordToggle={true}
                  editable={!loading}
                />

                <SquaredInput
                  label="Confirm password"
                  iconName="lock"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Re-enter password"
                  secureTextEntry={true}
                  showPasswordToggle={true}
                  editable={!loading}
                  onSubmitEditing={handleSignUp}
                />

                <SquaredButton
                  title="Create account"
                  onPress={handleSignUp}
                  loading={loading}
                  style={{ marginTop: 2 }}
                />

                <View style={styles.accountSwitchRow}>
                  <Text style={styles.accountSwitchText}>Already registered?</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setMode('login');
                      setError(null);
                      setSuccessMessage('');
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.accountSwitchAction}>Sign in</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </SquaredCard>
        </Animated.View>
      </ScrollView>

      <Modal
        visible={countrySheetOpen}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setCountrySheetOpen(false);
          setCountrySearch('');
        }}
      >
        <View style={styles.countryModalOverlay}>
          <View style={styles.countrySheet}>
            <View style={styles.countrySheetHandle} />
            <View style={styles.countrySheetHeader}>
              <View style={styles.countrySheetTitleCol}>
                <Text style={styles.countrySheetTitle}>Choose country</Text>
                <Text style={styles.countrySheetSubtitle}>
                  {filteredCountries.length} countries available
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setCountrySheetOpen(false);
                  setCountrySearch('');
                }}
                style={styles.countrySheetClose}
                activeOpacity={0.7}
                accessibilityLabel="Close country selector"
              >
                <Icon name="x" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Quick Country Search Bar */}
            <View style={styles.countrySearchBox}>
              <Icon name="search" size={16} color="#64748B" />
              <TextInput
                style={styles.countrySearchInput}
                placeholder="Search country name or code (e.g. India, +91)..."
                placeholderTextColor="#94A3B8"
                value={countrySearch}
                onChangeText={setCountrySearch}
                autoCorrect={false}
                autoCapitalize="none"
              />
              {countrySearch ? (
                <TouchableOpacity onPress={() => setCountrySearch('')} activeOpacity={0.7}>
                  <Icon name="xCircle" size={16} color="#94A3B8" />
                </TouchableOpacity>
              ) : null}
            </View>

            <ScrollView
              style={styles.countryListScroll}
              contentContainerStyle={styles.countryListScrollContent}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              {filteredCountries.map((country) => {
                const isSelected = countryCode.iso === country.iso;
                return (
                  <TouchableOpacity
                    key={`${country.iso}-${country.code}`}
                    style={[
                      styles.countryOption,
                      isSelected && styles.countryOptionActive
                    ]}
                    onPress={() => {
                      setCountryCode(country);
                      setCountrySheetOpen(false);
                      setCountrySearch('');
                    }}
                    activeOpacity={0.75}
                  >
                    <View style={styles.countryFlagSquare}>
                      <CountryFlag iso={country.iso} width={28} height={19} />
                    </View>
                    <Text style={styles.countryOptionName} numberOfLines={1}>
                      {country.name}
                    </Text>
                    <Text style={styles.countryOptionCode}>{country.code}</Text>
                    {isSelected ? (
                      <Icon name="check" size={16} color="#00B386" strokeWidth={2.4} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
              {filteredCountries.length === 0 ? (
                <View style={styles.emptyCountrySearch}>
                  <Icon name="search" size={24} color="#94A3B8" />
                  <Text style={styles.emptyCountrySearchText}>No matching country found</Text>
                </View>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  phoneBackBtn: {
    top: 24,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)'
  },
  phoneHeaderBand: {
    height: '30%',
    backgroundColor: '#00B386',
    ...(Platform.OS === 'web'
      ? { backgroundImage: 'linear-gradient(135deg, #00D9A5 0%, #00B386 100%)' }
      : {}),
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 14
  },
  phoneTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  phoneTitleText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  phoneCenterArea: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    marginTop: -18,
    paddingHorizontal: 20,
    paddingBottom: 32
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
    padding: 24,
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
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E3F8EC',
    borderRadius: CARD_RADIUS,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#B5E8CE'
  },
  successText: {
    flex: 1,
    color: '#0B7A42',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600'
  },
  forgotButton: {
    alignSelf: 'flex-end',
    minHeight: 36,
    justifyContent: 'center',
    marginTop: -6,
    paddingHorizontal: 4
  },
  forgotText: {
    color: '#00B386',
    fontSize: 13,
    fontWeight: '700'
  },
  accountSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 2
  },
  accountSwitchText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '500'
  },
  accountSwitchAction: {
    color: '#00B386',
    fontSize: 13,
    fontWeight: '800'
  },
  fieldWrapper: {
    gap: 6
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155'
  },
  emailDomainRow: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F2EE',
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden'
  },
  emailLocalInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    borderWidth: 0,
    outlineStyle: 'none',
    color: '#0F172A',
    fontSize: 15
  },
  fixedDomain: {
    height: '100%',
    paddingHorizontal: 10,
    backgroundColor: '#DFEDE8',
    borderLeftWidth: 1,
    borderLeftColor: '#DDE8E5',
    color: '#51635E',
    fontSize: 13,
    fontWeight: '700',
    textAlignVertical: 'center',
    lineHeight: 52
  },
  phoneRow: {
    height: 52,
    flexDirection: 'row',
    gap: 8
  },
  countryButton: {
    width: 112,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#E8F2EE',
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  countryFlag: {
    fontSize: 20
  },
  countryCode: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700'
  },
  phoneInput: {
    flex: 1,
    height: 52,
    backgroundColor: '#E8F2EE',
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    outlineStyle: 'none',
    color: '#0F172A',
    fontSize: 15
  },
  countryModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.42)',
    padding: 16
  },
  countrySheet: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '82%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8
  },
  countrySheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 4
  },
  countrySheetHeader: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 4
  },
  countrySheetTitleCol: {
    gap: 2
  },
  countrySheetTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  countrySheetSubtitle: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500'
  },
  countrySheetClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  countrySearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    gap: 8
  },
  countrySearchInput: {
    flex: 1,
    height: '100%',
    color: '#0F172A',
    fontSize: 14,
    borderWidth: 0,
    outlineStyle: 'none'
  },
  countryListScroll: {
    flexGrow: 1,
    maxHeight: 360,
    marginTop: 4
  },
  countryListScrollContent: {
    gap: 6,
    paddingVertical: 2
  },
  countryOption: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EDF4F2',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    gap: 12
  },
  countryOptionActive: {
    backgroundColor: '#E0F8F1',
    borderColor: '#00B386'
  },
  countryFlagSquare: {
    width: 36,
    height: 26,
    borderRadius: 4,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  countryOptionName: {
    flex: 1,
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '600'
  },
  countryOptionCode: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700'
  },
  emptyCountrySearch: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 8
  },
  emptyCountrySearchText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500'
  }
});

export default UserLoginScreen;
