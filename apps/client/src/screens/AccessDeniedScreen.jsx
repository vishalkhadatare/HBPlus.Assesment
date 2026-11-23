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

export function AccessDeniedScreen() {
  const { rejectedEmail, denialReason, navigate } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  const defaultMessage = 'Access restricted. Please login using your official domain email.';
  const displayMessage = denialReason || defaultMessage;

  return (
    <View style={styles.root}>
      {/* Aurora Ambient Background */}
      <View style={styles.gradientBg} pointerEvents="none" />

      <View style={[styles.mainWrapper, isWide && styles.mainWrapperWide]}>
        <View style={styles.card}>
          {/* Red Shield with Soft Pulsing Ring */}
          <View style={styles.shieldWrapper}>
            <View style={styles.shieldRing} />
            <View style={styles.shieldCenter}>
              <Icon name="shieldAlert" size={36} color="#F04438" strokeWidth={2.2} />
            </View>
          </View>

          {/* Title and Exact Message */}
          <View style={styles.messageBlock}>
            <Text style={styles.title}>Login denied</Text>
            <Text style={styles.messageText}>{displayMessage}</Text>
          </View>

          {/* Masked Rejected Email Box */}
          {rejectedEmail ? (
            <View style={styles.rejectedEmailBox}>
              <Text style={styles.rejectedEmailLabel}>Rejected Identity</Text>
              <Text style={styles.rejectedEmailValue}>{rejectedEmail}</Text>
            </View>
          ) : null}

          {/* Security Notice Note */}
          <View style={styles.noteBox}>
            <Icon name="info" size={16} color="#7E918C" />
            <Text style={styles.noteText}>
              Security Policy: Only authenticated Google Workspace or employee accounts ending with{' '}
              <Text style={{ fontWeight: '700', color: '#00B386' }}>@hbplus.fit</Text> are permitted access to corporate resources.
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actionGroup}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigate(ROUTES.LOGIN_USER)}
              activeOpacity={0.88}
            >
              <Icon name="refreshCw" size={16} color="#FFFFFF" />
              <Text style={styles.primaryBtnText}>Try another account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigate(ROUTES.ROLE_SELECT)}
              activeOpacity={0.88}
            >
              <Text style={styles.secondaryBtnText}>Back to start</Text>
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
    alignItems: 'center',
    padding: 20
  },
  mainWrapperWide: {
    maxWidth: 520,
    alignSelf: 'center',
    width: '100%'
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    gap: 18,
    boxShadow: '0 24px 56px rgba(4, 16, 14, 0.45)',
    elevation: 8
  },
  shieldWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 96,
    height: 96,
    marginBottom: 4
  },
  shieldRing: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FEE4E2',
    opacity: 0.7
  },
  shieldCenter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FECDCA',
    alignItems: 'center',
    justifyContent: 'center'
  },
  messageBlock: {
    alignItems: 'center',
    gap: 8
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0A1A17',
    letterSpacing: -0.6
  },
  messageText: {
    fontSize: 15,
    color: '#B42318',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 22,
    paddingHorizontal: 8
  },
  rejectedEmailBox: {
    backgroundColor: '#F4F8F7',
    borderWidth: 1,
    borderColor: '#DDE8E5',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    width: '100%'
  },
  rejectedEmailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7E918C',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  rejectedEmailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A1A17'
  },
  noteBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%'
  },
  noteText: {
    fontSize: 12.5,
    color: '#51635E',
    lineHeight: 18,
    flex: 1
  },
  actionGroup: {
    width: '100%',
    gap: 10,
    marginTop: 6
  },
  primaryBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#00B386',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 8px 20px rgba(0, 179, 134, 0.3)',
    elevation: 3
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },
  secondaryBtn: {
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDE8E5',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  secondaryBtnText: {
    color: '#51635E',
    fontSize: 14,
    fontWeight: '700'
  }
});

export default AccessDeniedScreen;
