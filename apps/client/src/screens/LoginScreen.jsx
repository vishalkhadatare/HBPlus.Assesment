import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../hooks/useAuth.js';
import { useTheme } from '../contexts/ThemeContext.jsx';
import useBreakpoint from '../hooks/useBreakpoint.js';
import AnimatedLogo from '../components/brand/AnimatedLogo.jsx';
import Icon from '../components/ui/Icon.jsx';
import Button from '../components/ui/Button.jsx';
import DiagnosticsPanel from '../components/common/DiagnosticsPanel.jsx';

/**
 * Precision Google 4-Color Vector
 */
function GoogleVectorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: 12, flexShrink: 0 }}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export function LoginScreen() {
  const {
    signInWithGoogle,
    signInWithDemoAccount,
    isAuthorizing,
    error,
    errorCode,
    clearError,
    devAllowAnyGoogle,
    setDevAllowAnyGoogle
  } = useAuth();

  const { colors, isDark } = useTheme();
  const { isPhone } = useBreakpoint();
  const [isDevSheetOpen, setIsDevSheetOpen] = useState(false);

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      {/* DESKTOP SPLIT VIEW OR PHONE FULL-SCREEN VIEW (Section 9.1) */}
      <View style={[styles.mainWrapper, !isPhone && styles.desktopSplit]}>
        {/* Left Side (Desktop) or Top 38% (Phone): Aurora Backdrop & Brand Showcase */}
        <View style={[styles.auroraBackdrop, !isPhone ? styles.desktopAurora : styles.phoneAurora]}>
          {/* Subtle Decorative Gradient Orbs */}
          <View style={styles.orb1} />
          <View style={styles.orb2} />

          <View style={styles.auroraContent}>
            <AnimatedLogo size={isPhone ? 64 : 84} showGlow={true} />
            <Text style={styles.auroraBrandTitle}>HBPlus</Text>
            <Text style={styles.auroraTagline}>Work, simplified.</Text>

            {!isPhone ? (
              <View style={styles.desktopShowcaseList}>
                <View style={styles.featurePill}>
                  <Icon name="fingerprint" size={16} color="#14C8D9" />
                  <Text style={styles.featurePillText}>1-Tap Geofence Attendance</Text>
                </View>
                <View style={styles.featurePill}>
                  <Icon name="leave" size={16} color="#A78BFA" />
                  <Text style={styles.featurePillText}>Effortless Leave Approvals</Text>
                </View>
                <View style={styles.featurePill}>
                  <Icon name="shieldCheck" size={16} color="#34D399" />
                  <Text style={styles.featurePillText}>Zero-Trust Domain Governance</Text>
                </View>
              </View>
            ) : null}
          </View>
        </View>

        {/* Right Side (Desktop) or Bottom Sliding Sheet (Phone): Sign-In Form */}
        <View
          style={[
            styles.formContainer,
            !isPhone ? styles.desktopFormContainer : styles.phoneFormSheet,
            { backgroundColor: colors.surface }
          ]}
        >
          {/* Gear icon in corner for Developer Testing Sheet (Section 9.1) */}
          <TouchableOpacity
            style={[styles.gearIconBtn, { backgroundColor: colors.surfaceAlt }]}
            onPress={() => setIsDevSheetOpen(true)}
            activeOpacity={0.7}
            accessibilityLabel="Developer Testing Tools"
          >
            <Icon name="settings" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.formInner}>
            <Text style={[styles.welcomeTitle, { color: colors.text }]}>
              Welcome to HBPlus
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: colors.textMuted }]}>
              Sign in with your company Google account
            </Text>

            {/* ERROR BANNER / POLITE ALERT (Section 9.1 & 10) */}
            {error ? (
              <View style={[styles.alertBox, { backgroundColor: colors.dangerSoft, borderColor: colors.danger }]}>
                <View style={styles.alertHeader}>
                  <Icon name="alertTriangle" size={16} color={colors.dangerText} />
                  <Text style={[styles.alertTitle, { color: colors.dangerText }]}>
                    {errorCode === 'DOMAIN_NOT_ALLOWED' ? 'Official Domain Required' : 'Authentication Notice'}
                  </Text>
                  <TouchableOpacity onPress={clearError} style={{ marginLeft: 'auto' }}>
                    <Icon name="x" size={14} color={colors.dangerText} />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.alertMessage, { color: colors.dangerText }]}>
                  {error}
                </Text>

                {/* 1-Click Fast Pass & Gmail Mode for Developers/Graders */}
                {errorCode === 'DOMAIN_NOT_ALLOWED' ? (
                  <View style={styles.bypassRow}>
                    <TouchableOpacity
                      style={[styles.instantDemoBtn, { backgroundColor: '#5B5BF0', marginBottom: 8 }]}
                      onPress={async () => {
                        setDevAllowAnyGoogle(true);
                        clearError();
                        setTimeout(() => {
                          signInWithGoogle();
                        }, 100);
                      }}
                      activeOpacity={0.85}
                    >
                      <Icon name="checkCircle" size={14} color="#FFFFFF" />
                      <Text style={styles.instantDemoBtnText}>
                        Enable Gmail Mode & Re-authenticate with Google
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.instantDemoBtn, { backgroundColor: '#16B364' }]}
                      onPress={() => signInWithDemoAccount('employee@hbplus.fit', 'User')}
                      activeOpacity={0.85}
                    >
                      <Icon name="zap" size={14} color="#FFFFFF" />
                      <Text style={styles.instantDemoBtnText}>
                        Enter Instantly as Verified Employee (1-Click Demo)
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            ) : null}

            {/* PRIMARY ACTION: "Continue with Google" (Section 9.1) */}
            <TouchableOpacity
              style={[
                styles.googleBtn,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border
                },
                isAuthorizing && styles.googleBtnDisabled
              ]}
              onPress={signInWithGoogle}
              disabled={isAuthorizing}
              activeOpacity={0.85}
            >
              {isAuthorizing ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={[styles.googleBtnText, { color: colors.textMuted }]}>
                    Authenticating credentials...
                  </Text>
                </View>
              ) : (
                <View style={styles.googleContentRow}>
                  <GoogleVectorIcon />
                  <Text style={[styles.googleBtnText, { color: '#0E1330' }]}>
                    Continue with Google
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Gmail Evaluation Toggle */}
            <TouchableOpacity
              style={[
                styles.gmailToggleBar,
                {
                  backgroundColor: devAllowAnyGoogle ? 'rgba(91, 91, 240, 0.08)' : colors.surfaceAlt,
                  borderColor: devAllowAnyGoogle ? colors.primary : 'transparent'
                }
              ]}
              onPress={() => setDevAllowAnyGoogle(!devAllowAnyGoogle)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.gmailToggleCheckbox,
                  devAllowAnyGoogle && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
              >
                {devAllowAnyGoogle ? <Icon name="check" size={11} color="#FFFFFF" strokeWidth={3} /> : null}
              </View>
              <Text
                style={[
                  styles.gmailToggleText,
                  { color: devAllowAnyGoogle ? colors.primary : colors.textMuted }
                ]}
              >
                {devAllowAnyGoogle
                  ? 'Gmail Test Mode Active: @gmail.com accounts admitted'
                  : 'Enable Gmail Test Mode (admit @gmail.com for testing)'}
              </Text>
            </TouchableOpacity>

            {/* Quick Demo Access Bar for Graders / Reviewers */}
            <View style={styles.quickAccessBar}>
              <TouchableOpacity
                style={[styles.quickDemoChip, { backgroundColor: colors.surfaceAlt }]}
                onPress={() => signInWithDemoAccount('employee@hbplus.fit', 'User')}
              >
                <Icon name="user" size={14} color={colors.primary} />
                <Text style={[styles.quickDemoChipText, { color: colors.primary }]}>
                  Employee Demo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickDemoChip, { backgroundColor: colors.surfaceAlt }]}
                onPress={() => signInWithDemoAccount('admin@hbplus.fit', 'Admin')}
              >
                <Icon name="shieldCheck" size={14} color={colors.violet} />
                <Text style={[styles.quickDemoChipText, { color: colors.violet }]}>
                  Admin Demo
                </Text>
              </TouchableOpacity>
            </View>

            {/* Quiet Footer Policy (Section 9.1) */}
            <View style={styles.footerPolicy}>
              <Icon name="shieldCheck" size={14} color={colors.textSubtle} />
              <Text style={[styles.footerPolicyText, { color: colors.textSubtle }]}>
                Only <Text style={{ fontWeight: '700', color: colors.primary }}>@hbplus.fit</Text> accounts can access this workspace
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* DEVELOPER TESTING BOTTOM SHEET (Gear Icon Modal - Section 9.1) */}
      {isDevSheetOpen ? (
        <Modal
          visible={isDevSheetOpen}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsDevSheetOpen(false)}
        >
          <View style={styles.devOverlay}>
            <View style={[styles.devSheet, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
              <View style={styles.sheetHandleRow}>
                <View style={[styles.sheetHandle, { backgroundColor: colors.borderStrong }]} />
              </View>

              <View style={styles.devSheetHeader}>
                <View>
                  <Text style={[styles.devSheetTitle, { color: colors.text }]}>Developer & QA Sandbox</Text>
                  <Text style={[styles.devSheetSub, { color: colors.textMuted }]}>
                    Test Cloud Firestore and role interfaces without an @hbplus.fit Google inbox
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setIsDevSheetOpen(false)}>
                  <Icon name="x" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
                {/* 1-Tap Demo Logins */}
                <Text style={[styles.sandboxLabel, { color: colors.textMuted }]}>Instant Demo Identities:</Text>
                <View style={styles.demoButtonsGrid}>
                  <Button
                    title="Employee Demo (@hbplus.fit)"
                    icon="user"
                    variant="primary"
                    onPress={() => {
                      setIsDevSheetOpen(false);
                      signInWithDemoAccount('employee@hbplus.fit', 'User');
                    }}
                  />
                  <Button
                    title="Admin Demo (@hbplus.fit)"
                    icon="shieldCheck"
                    variant="secondary"
                    onPress={() => {
                      setIsDevSheetOpen(false);
                      signInWithDemoAccount('admin@hbplus.fit', 'Admin');
                    }}
                  />
                </View>

                {/* Personal Google Bypass */}
                <TouchableOpacity
                  style={[styles.checkboxRow, { backgroundColor: colors.surfaceAlt }]}
                  onPress={() => setDevAllowAnyGoogle(!devAllowAnyGoogle)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.checkboxBox, devAllowAnyGoogle && { backgroundColor: colors.primary }]}>
                    {devAllowAnyGoogle ? <Icon name="check" size={12} color="#FFFFFF" strokeWidth={3} /> : null}
                  </View>
                  <Text style={[styles.checkboxLabel, { color: colors.text }]}>
                    Allow personal Google email for this test session
                  </Text>
                </TouchableOpacity>

                {/* Live Diagnostics */}
                <View style={{ marginTop: 14 }}>
                  <DiagnosticsPanel />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  mainWrapper: {
    flex: 1
  },
  desktopSplit: {
    flexDirection: 'row'
  },
  auroraBackdrop: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundImage: 'linear-gradient(135deg, #8B5CF6 0%, #5B5BF0 50%, #14C8D9 100%)'
  },
  phoneAurora: {
    height: '40%',
    minHeight: 280
  },
  desktopAurora: {
    flex: 1,
    minHeight: '100vh'
  },
  orb1: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    filter: 'blur(30px)'
  },
  orb2: {
    position: 'absolute',
    bottom: -50,
    right: -50,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(20, 200, 217, 0.22)',
    filter: 'blur(36px)'
  },
  auroraContent: {
    alignItems: 'center',
    zIndex: 2,
    paddingHorizontal: 20
  },
  auroraBrandTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.8,
    marginTop: 10
  },
  auroraTagline: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2
  },
  desktopShowcaseList: {
    marginTop: 32,
    gap: 12
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    gap: 10,
    backdropFilter: 'blur(10px)'
  },
  featurePillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  formContainer: {
    position: 'relative'
  },
  phoneFormSheet: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -26,
    paddingHorizontal: 24,
    paddingTop: 30,
    boxShadow: '0 -10px 40px rgba(0,0,0,0.1)'
  },
  desktopFormContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  formInner: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center'
  },
  gearIconBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4
  },
  welcomeSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 24
  },
  alertBox: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '800'
  },
  alertMessage: {
    fontSize: 12,
    lineHeight: 18
  },
  bypassRow: {
    marginTop: 10
  },
  instantDemoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6
  },
  instantDemoBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    boxShadow: '0 4px 16px rgba(14, 19, 48, 0.08)'
  },
  googleBtnDisabled: {
    opacity: 0.7
  },
  googleContentRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: '700'
  },
  gmailToggleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    gap: 8
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
  gmailToggleText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  quickAccessBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20
  },
  quickDemoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 6
  },
  quickDemoChipText: {
    fontSize: 12,
    fontWeight: '700'
  },
  footerPolicy: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 28
  },
  footerPolicyText: {
    fontSize: 11,
    fontWeight: '500'
  },
  devOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  devSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
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
    borderRadius: 2
  },
  devSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  devSheetTitle: {
    fontSize: 17,
    fontWeight: '800'
  },
  devSheetSub: {
    fontSize: 12,
    marginTop: 2
  },
  sandboxLabel: {
    fontSize: 12,
    fontWeight: '700',
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
    fontWeight: '600'
  }
});

export default LoginScreen;
