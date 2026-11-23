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
              © {new Date().getFullYear()} HBPlus. Corporate Access Portal.
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
    maxWidth: 960,
    alignSelf: 'center',
    padding: spacing.md
  },
  footer: {
    paddingVertical: 20,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    fontWeight: '500'
  }
});

export default AppLayout;
