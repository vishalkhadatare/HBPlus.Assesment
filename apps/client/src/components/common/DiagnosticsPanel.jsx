import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { runFirebaseDiagnostics } from '../../services/diagnosticsService.js';
import colors from '../../styles/colors.js';
import { borderRadius, shadows } from '../../styles/spacing.js';

export function DiagnosticsPanel({ currentUser = null }) {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);

  const handleRun = async (testUser = currentUser) => {
    setIsRunning(true);
    try {
      const data = await runFirebaseDiagnostics(testUser);
      setResults(data);
    } catch (err) {
      setResults([
        { id: 'fatal', name: 'Diagnostics Error', status: 'FAIL', message: err.message }
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    handleRun(currentUser);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>🔍 Live Firebase Diagnostic Suite</Text>
          <Text style={styles.subtitle}>
            Directly test Auth, Firestore Write/Read, REST API, & Config
          </Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.runButton}
            onPress={() => handleRun(currentUser)}
            disabled={isRunning}
            activeOpacity={0.8}
          >
            {isRunning ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.runButtonText}>Run Test Suite</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.runButton, { backgroundColor: '#5B5BF0' }]}
            onPress={() =>
              handleRun({
                uid: 'gmail-evaluator-test',
                email: 'evaluator@gmail.com',
                getIdToken: async () => 'evaluator-mock-token'
              })
            }
            disabled={isRunning}
            activeOpacity={0.8}
          >
            <Text style={styles.runButtonText}>Test with Gmail</Text>
          </TouchableOpacity>
        </View>
      </View>

      {results ? (
        <View style={styles.resultsList}>
          {results.map((item) => {
            const isPass = item.status === 'PASS';
            const isWarn = item.status === 'WARN';
            return (
              <View key={item.id} style={styles.resultItem}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultName}>{item.name}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      isPass ? styles.badgePass : isWarn ? styles.badgeWarn : styles.badgeFail
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        isPass ? styles.badgeTextPass : isWarn ? styles.badgeTextWarn : styles.badgeTextFail
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.resultMessage}>{item.message}</Text>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap'
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap'
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2
  },
  subtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2
  },
  runButton: {
    backgroundColor: '#10B981',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100
  },
  runButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  resultsList: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
    gap: 8
  },
  resultItem: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  resultName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B'
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: borderRadius.full
  },
  badgePass: {
    backgroundColor: '#ECFDF5'
  },
  badgeTextPass: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '800'
  },
  badgeWarn: {
    backgroundColor: '#FFFBEB'
  },
  badgeTextWarn: {
    color: '#D97706',
    fontSize: 10,
    fontWeight: '800'
  },
  badgeFail: {
    backgroundColor: '#FEF2F2'
  },
  badgeTextFail: {
    color: '#DC2626',
    fontSize: 10,
    fontWeight: '800'
  },
  resultMessage: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16
  }
});

export default DiagnosticsPanel;
