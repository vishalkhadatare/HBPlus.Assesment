import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import { initialDocuments } from '../../services/dataStore.js';

export function DocumentsView() {
  const { colors } = useTheme();
  const [docs] = useState(initialDocuments);
  const [downloadedId, setDownloadedId] = useState(null);

  const handleDownload = (id) => {
    setDownloadedId(id);
    setTimeout(() => setDownloadedId(null), 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Documents & Policies</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Official employee handbooks, security manuals, and compliance resources
          </Text>
        </View>
        <Badge label="4 Documents Available" variant="info" />
      </View>

      <View style={styles.grid}>
        {docs.map((doc) => (
          <GlassCard key={doc.id} style={styles.docCard}>
            <View style={styles.docTop}>
              <View style={styles.docIconBox}>
                <Text style={styles.docIcon}>📄</Text>
              </View>
              <Badge label={doc.category} variant="purple" size="small" />
            </View>

            <Text style={[styles.docTitle, { color: colors.textPrimary }]}>{doc.title}</Text>
            <Text style={[styles.docMeta, { color: colors.textMuted }]}>
              {doc.format} • {doc.size} • Updated {doc.updatedAt}
            </Text>

            <TouchableOpacity
              style={[styles.downloadBtn, { backgroundColor: colors.primarySubtle }]}
              onPress={() => handleDownload(doc.id)}
            >
              <Text style={[styles.downloadBtnText, { color: colors.primary }]}>
                {downloadedId === doc.id ? '✓ Downloaded' : 'Download Document ↓'}
              </Text>
            </TouchableOpacity>
          </GlassCard>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  docCard: { flex: 1, minWidth: 260, maxWidth: 440 },
  docTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  docIconBox: { width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.04)', alignItems: 'center', justifyContent: 'center' },
  docIcon: { fontSize: 18 },
  docTitle: { fontSize: 15, fontWeight: '800', lineHeight: 20, marginBottom: 6 },
  docMeta: { fontSize: 12, marginBottom: 14 },
  downloadBtn: { paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  downloadBtnText: { fontSize: 12, fontWeight: '700' }
});

export default DocumentsView;
