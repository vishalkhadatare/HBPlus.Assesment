import React from 'react';
import { View, StyleSheet, ScrollView, Text, SafeAreaView } from 'react-native';
import colors from '../../styles/colors.js';
import typography from '../../styles/typography.js';
import { spacing } from '../../styles/spacing.js';
import AppHeader from './AppHeader.jsx';

export function AppLayout({ children, showHeader = true }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        {showHeader ? <AppHeader /> : null}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContainer}>
            {children}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} HBPlus Fitness & Health Ltd. All rights reserved.
            </Text>
            <Text style={styles.footerSubText}>
              Authorized personnel only. All access attempts are cryptographically audited.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  root: {
    flex: 1,
    backgroundColor: colors.background
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  mainContainer: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    padding: spacing.md
  },
  footer: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface
  },
  footerText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    textAlign: 'center'
  },
  footerSubText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'center'
  }
});

export default AppLayout;
