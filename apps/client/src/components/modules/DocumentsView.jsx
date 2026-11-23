import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import Icon from '../ui/Icon.jsx';
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
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.title, { color: colors.text }]}>Policies & Handbook</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Downloadable guidelines, security standards, and benefit manuals
          </Text>
        </View>
        <Badge label="4 Documents Available" variant="info" showDot={false} />
      </View>

      <View style={styles.grid}>
        {docs.map((doc) => (
          <GlassCard key={doc.id} style={styles.docCard}>
            <View style={styles.docTop}>
              <View style={[styles.docIconBox, { backgroundColor: colors.surfaceAlt }]}>
                <Icon name="documents" size={18} color={colors.primary} />
              </View>
              <Badge label={doc.category} variant="primary" size="small" showDot={false} />
            </View>

            <Text style={[styles.docTitle, { color: colors.text }]}>{doc.title}</Text>
            <Text style={[styles.docMeta, { color: colors.textSubtle }]}>
              {doc.format} • {doc.size} • Updated {doc.updatedAt}
            </Text>

            <TouchableOpacity
              style={[styles.downloadBtn, { backgroundColor: colors.primarySoft }]}
              onPress={() => handleDownload(doc.id)}
              activeOpacity={0.8}
            >
              <Icon name="download" size={14} color={colors.primary} />
              <Text style={[styles.downloadBtnText, { color: colors.primary }]}>
                {downloadedId === doc.id ? 'Downloaded' : 'Download Document'}
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
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  subtitle: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  docCard: { flex: 1, minWidth: 260, maxWidth: 540, marginVertical: 0 },
  docTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  docIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  docTitle: { fontSize: 15, fontWeight: '800', lineHeight: 20, marginBottom: 4 },
  docMeta: { fontSize: 11, marginBottom: 12 },
  downloadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 10, gap: 6 },
  downloadBtnText: { fontSize: 12, fontWeight: '700' }
});

export default DocumentsView;
