import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import { initialHelpdeskTickets } from '../../services/dataStore.js';

export function HelpdeskView() {
  const { colors } = useTheme();
  const [tickets, setTickets] = useState(initialHelpdeskTickets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Hardware');
  const [priority, setPriority] = useState('Medium');

  const handleCreate = () => {
    if (!subject.trim()) return;
    const newTkt = {
      id: `tkt-${Date.now()}`,
      subject: subject.trim(),
      category,
      priority,
      status: 'Open',
      createdAt: new Date().toISOString().split('T')[0],
      requester: 'Aarav Mehta',
      responses: 0
    };
    setTickets([newTkt, ...tickets]);
    setSubject('');
    setIsModalOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.title, { color: colors.text }]}>IT & HR Helpdesk</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Submit hardware, account access, and corporate support tickets
          </Text>
        </View>

        <Button title="New Ticket" icon="plus" variant="primary" onPress={() => setIsModalOpen(true)} />
      </View>

      <View style={styles.list}>
        {tickets.map((t) => (
          <GlassCard key={t.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.badgeRow}>
                <Badge label={t.status} variant={t.status} size="small" />
                <Badge label={t.priority} variant={t.priority} size="small" />
                <Badge label={t.category} variant="primary" size="small" showDot={false} />
              </View>
              <Text style={[styles.ticketId, { color: colors.textSubtle }]}>#{t.id}</Text>
            </View>

            <Text style={[styles.subject, { color: colors.text }]}>{t.subject}</Text>

            <View style={[styles.footerRow, { borderTopColor: colors.borderSubtle }]}>
              <Text style={[styles.metaText, { color: colors.textSubtle }]}>
                Opened {t.createdAt} by {t.requester}
              </Text>
              <Text style={[styles.responseCount, { color: colors.primary }]}>
                {t.responses} {t.responses === 1 ? 'reply' : 'replies'}
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
              <Text style={[styles.modalTitle, { color: colors.text }]}>Open Support Ticket</Text>

              <View style={{ gap: 10, marginVertical: 12 }}>
                <Text style={[styles.label, { color: colors.textMuted }]}>Issue Subject:</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border }]}
                  placeholder="e.g. Need VPN configuration profile for workstation"
                  placeholderTextColor={colors.textSubtle}
                  value={subject}
                  onChangeText={setSubject}
                />

                <View style={styles.modalFooter}>
                  <Button title="Cancel" variant="secondary" onPress={() => setIsModalOpen(false)} style={{ marginRight: 8 }} />
                  <Button title="Submit Ticket" variant="primary" onPress={handleCreate} />
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
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  subtitle: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  list: { gap: 10 },
  card: { marginVertical: 0 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badgeRow: { flexDirection: 'row', gap: 6 },
  ticketId: { fontSize: 11, fontWeight: '700', fontFamily: "'JetBrains Mono', monospace" },
  subject: { fontSize: 14, fontWeight: '700', lineHeight: 20, marginBottom: 8 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, paddingTop: 8 },
  metaText: { fontSize: 11 },
  responseCount: { fontSize: 11, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { width: '100%', maxWidth: 460 },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  label: { fontSize: 12, fontWeight: '700' },
  input: { height: 40, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, fontSize: 14 },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }
});

export default HelpdeskView;
