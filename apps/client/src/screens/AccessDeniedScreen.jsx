import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions
} from 'react-native';
import { useAuth } from '../hooks/useAuth.js';
import Icon from '../components/ui/Icon.jsx';
import { ROUTES } from '../navigation/navigationConfig.js';
import { CARD_RADIUS } from '../theme/shape.js';

export function AccessDeniedScreen() {
  const { rejectedEmail, denialReason, navigate } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const defaultMessage = 'Access restricted. Please login using your official domain email.';
  const displayMessage = denialReason || defaultMessage;

  return (
    <View style={styles.root}>
      {/* Background Soft Gradient */}
      <View style={styles.gradientBg} pointerEvents="none" />

      <View style={[styles.mainWrapper, isWide && styles.mainWrapperWide]}>
        <View style={styles.card}>
          {/* Red Shield Circle */}
          <View style={styles.iconCircle}>
            <Icon name="shieldCheck" size={32} color="#EF4444" strokeWidth={2.2} />
          </View>

          {/* Title and Exact Message */}
          <View style={styles.messageBlock}>
            <Text style={styles.title}>Access restricted</Text>
            <Text style={styles.messageText}>{displayMessage}</Text>
          </View>

          {/* Masked Rejected Email Box if available */}
          {rejectedEmail ? (
            <View style={styles.rejectedEmailBox}>
              <Text style={styles.rejectedEmailValue}>{rejectedEmail}</Text>
            </View>
          ) : null}

          {/* Action Buttons */}
          <View style={styles.actionGroup}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigate(ROUTES.LOGIN_USER)}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Try another account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigate(ROUTES.ROLE_SELECT)}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryBtnText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  mainWrapper: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    zIndex: 10
  },
  mainWrapperWide: {
    maxWidth: 400
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(12px)' } : {}),
    borderRadius: CARD_RADIUS,
    padding: 28,
    alignItems: 'center',
    borderWidth: 0,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 0,
    gap: 20
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: CARD_RADIUS,
    backgroundColor: '#FEF2F2',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  messageBlock: {
    alignItems: 'center',
    gap: 8
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center'
  },
  messageText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20
  },
  rejectedEmailBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: CARD_RADIUS,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 0
  },
  rejectedEmailValue: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600'
  },
  actionGroup: {
    width: '100%',
    gap: 10,
    marginTop: 4
  },
  primaryBtn: {
    width: '100%',
    height: 48,
    borderRadius: CARD_RADIUS,
    backgroundColor: '#00B386',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    shadowColor: '#00B386',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 0
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600'
  },
  secondaryBtn: {
    width: '100%',
    height: 44,
    borderRadius: CARD_RADIUS,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    elevation: 0
  },
  secondaryBtnText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600'
  }
});

export default AccessDeniedScreen;
