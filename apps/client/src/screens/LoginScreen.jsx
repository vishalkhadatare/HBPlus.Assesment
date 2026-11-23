import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import colors from '../styles/colors.js';
import typography from '../styles/typography.js';
import { spacing, borderRadius, shadows } from '../styles/spacing.js';
import { useAuth } from '../hooks/useAuth.js';
import GoogleSignInButton from '../components/auth/GoogleSignInButton.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import DiagnosticsPanel from '../components/common/DiagnosticsPanel.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';

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

  const [devToolsOpen, setDevToolsOpen] = useState(false);

  return (
    <AppLayout showHeader={false}>
      <View style={styles.centerWrapper}>
        <View style={styles.card}>
          {/* Fitness-Tech Brand Logo & Status Indicator */}
          <View style={styles.logoSection}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>HB+</Text>
            </View>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusPillText}>SECURE PORTAL</Text>
            </View>
          </View>

          {/* Typography */}
          <Text style={styles.title}>HBPlus Access</Text>
          <Text style={styles.subtitle}>
            Sign in with your @hbplus.fit Google account
          </Text>

          {/* Sleek Alert Banner for Domain Restriction & Errors */}
          {error ? (
            <ErrorMessage
              message={error}
              code={errorCode}
              onRetry={clearError}
              retryLabel="Dismiss"
            />
          ) : null}

          {/* Google OAuth Action */}
          <View style={styles.actionContainer}>
            <GoogleSignInButton
              onPress={signInWithGoogle}
              isLoading={isAuthorizing}
              disabled={isAuthorizing}
            />
          </View>

          {/* Domain Enforcement Notice */}
          <View style={styles.securityNotice}>
            <Text style={styles.securityIcon}>🔒</Text>
            <Text style={styles.securityText}>
              Restricted portal. Only authenticated{' '}
              <Text style={styles.domainHighlight}>@hbplus.fit</Text> accounts are granted access.
            </Text>
          </View>

          {/* Modern Developer / Live Testing Sandbox (Collapsible) */}
          <View style={styles.devSection}>
            <TouchableOpacity
              style={styles.devToggle}
              onPress={() => setDevToolsOpen(!devToolsOpen)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Toggle Developer Sandbox"
            >
              <Text style={styles.devToggleText}>
                {devToolsOpen ? '▾ Hide Testing Tools' : '⚡ Developer Testing Tools ▾'}
              </Text>
            </TouchableOpacity>

            {devToolsOpen ? (
              <View style={styles.devBox}>
                <Text style={styles.devSubtitle}>
                  Test Firestore storage & dashboard access without an active @hbplus.fit inbox:
                </Text>

                <View style={styles.devButtonsRow}>
                  <TouchableOpacity
                    style={[styles.devButton, styles.devButtonUser]}
                    onPress={() => signInWithDemoAccount('employee@hbplus.fit', 'User')}
                    disabled={isAuthorizing}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.devButtonTextUser}>👤 Employee Demo</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.devButton, styles.devButtonAdmin]}
                    onPress={() => signInWithDemoAccount('admin@hbplus.fit', 'Admin')}
                    disabled={isAuthorizing}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.devButtonTextAdmin}>🛡️ Admin Demo</Text>
                  </TouchableOpacity>
                </View>

                {/* Personal Google Bypass Toggle for live OAuth testing */}
                <TouchableOpacity
                  style={styles.toggleRow}
                  onPress={() => setDevAllowAnyGoogle(!devAllowAnyGoogle)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.checkbox, devAllowAnyGoogle && styles.checkboxActive]}>
                    {devAllowAnyGoogle ? <Text style={styles.checkmark}>✓</Text> : null}
                  </View>
                  <Text style={styles.toggleLabel}>
                    Allow personal Google email for this test session
                  </Text>
                </TouchableOpacity>

                {/* Live Diagnostic Runner */}
                <DiagnosticsPanel />
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 32,
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    ...shadows.card
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 16
  },
  logoBadge: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.glow
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 24,
    letterSpacing: -0.5
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: borderRadius.full,
    marginTop: 10
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
    marginRight: 6
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46',
    letterSpacing: 0.8
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 6
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20
  },
  actionContainer: {
    width: '100%',
    marginVertical: 4
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    width: '100%'
  },
  securityIcon: {
    fontSize: 12,
    marginRight: 6
  },
  securityText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
    flex: 1
  },
  domainHighlight: {
    fontWeight: '700',
    color: '#059669'
  },
  devSection: {
    marginTop: 18,
    width: '100%',
    alignItems: 'center'
  },
  devToggle: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  devToggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B'
  },
  devBox: {
    marginTop: 12,
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%'
  },
  devSubtitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginBottom: 10
  },
  devButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10
  },
  devButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1
  },
  devButtonUser: {
    backgroundColor: '#FFFFFF',
    borderColor: '#A7F3D0'
  },
  devButtonTextUser: {
    color: '#065F46',
    fontSize: 11,
    fontWeight: '600'
  },
  devButtonAdmin: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FDE68A'
  },
  devButtonTextAdmin: {
    color: '#92400E',
    fontSize: 11,
    fontWeight: '600'
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 12
  },
  toggleLabel: {
    fontSize: 11,
    color: '#64748B',
    flex: 1
  }
});

export default LoginScreen;