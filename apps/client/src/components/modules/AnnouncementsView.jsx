import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import { initialAnnouncements } from '../../services/dataStore.js';

export function AnnouncementsView({ role = 'User' }) {
  const { colors } = useTheme();
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newDept, setNewDept] = useState('Company-Wide');

  const handlePost = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const newAnn = {
      id: `ann-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      priority: 'Normal',
      department: newDept,
      author: 'You (Current User)',
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements([newAnn, ...announcements]);
    setNewTitle('');
    setNewContent('');
    setIsModalOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Corporate Announcements</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Official company news, leadership updates, and notices
          </Text>
        </View>

        <Button
          title="+ Post Notice"
          variant="primary"
          onPress={() => setIsModalOpen(true)}
        />
      </View>

      <View style={styles.list}>
        {announcements.map((item) => (
          <GlassCard key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.badgeRow}>
                <Badge label={item.priority} variant={item.priority === 'Pinned' ? 'info' : 'neutral'} size="small" />
                <Badge label={item.department} variant="purple" size="small" />
              </View>
              <Text style={[styles.dateText, { color: colors.textMuted }]}>{item.date}</Text>
            </View>

            <Text style={[styles.annTitle, { color: colors.textPrimary }]}>{item.title}</Text>
            <Text style={[styles.annContent, { color: colors.textSecondary }]}>{item.content}</Text>

            <View style={styles.cardFooter}>
              <Text style={[styles.authorText, { color: colors.textMuted }]}>
                Posted by <Text style={{ fontWeight: '700', color: colors.textPrimary }}>{item.author}</Text>
              </Text>
            </View>
          </GlassCard>
        ))}
      </View>

      {isModalOpen ? (
        <Modal
          visible={isModalOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <GlassCard style={styles.modalCard}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Post Announcement</Text>

              <View style={{ gap: 10 }}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceSubtle, color: colors.textPrimary, borderColor: colors.border }]}
                  placeholder="Announcement Title"
                  placeholderTextColor={colors.textMuted}
                  value={newTitle}
                  onChangeText={setNewTitle}
                />
                <TextInput
                  style={[styles.textArea, { backgroundColor: colors.surfaceSubtle, color: colors.textPrimary, borderColor: colors.border }]}
                  placeholder="Content details..."
                  placeholderTextColor={colors.textMuted}
                  multiline={true}
                  numberOfLines={4}
                  value={newContent}
                  onChangeText={setNewContent}
                />

                <View style={styles.modalFooter}>
                  <Button title="Cancel" variant="secondary" onPress={() => setIsModalOpen(false)} style={{ marginRight: 8 }} />
                  <Button title="Publish" variant="primary" onPress={handlePost} />
                </View>
              </View>
            </GlassCard>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  list: { gap: 12 },
  card: { marginVertical: 0 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badgeRow: { flexDirection: 'row', gap: 6 },
  dateText: { fontSize: 12, fontWeight: '500' },
  annTitle: { fontSize: 16, fontWeight: '800', lineHeight: 22, marginBottom: 8 },
  annContent: { fontSize: 14, lineHeight: 20 },
  cardFooter: { marginTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 8 },
  authorText: { fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { width: '100%', maxWidth: 460 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 14 },
  input: { height: 40, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, fontSize: 14 },
  textArea: { borderRadius: 10, borderWidth: 1, padding: 12, fontSize: 14, minHeight: 90 },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 14 }
});

export default AnnouncementsView;
