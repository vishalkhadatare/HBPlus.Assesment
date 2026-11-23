import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import { initialTasks } from '../../services/dataStore.js';

export function TasksView() {
  const { colors, borderRadius } = useTheme();
  const [tasks, setTasks] = useState(initialTasks);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('Marcus Vance');
  const [taskPriority, setTaskPriority] = useState('High');
  const [taskDept, setTaskDept] = useState('Engineering');

  const columns = ['Backlog', 'To Do', 'In Progress', 'In Review', 'Done'];

  const moveTask = (taskId) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          const currentIndex = columns.indexOf(t.status);
          const nextIndex = (currentIndex + 1) % columns.length;
          return { ...t, status: columns[nextIndex] };
        }
        return t;
      })
    );
  };

  const handleAddTask = () => {
    if (!taskTitle.trim()) return;
    const newTask = {
      id: `tsk-${Date.now()}`,
      title: taskTitle.trim(),
      department: taskDept,
      assignee: taskAssignee,
      priority: taskPriority,
      status: 'To Do',
      dueDate: '2026-12-01'
    };
    setTasks([newTask, ...tasks]);
    setTaskTitle('');
    setIsAddModalOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.title, { color: colors.text }]}>Projects & Sprint Board</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {tasks.length} active initiatives tracked across delivery pipelines
          </Text>
        </View>

        <Button
          title="New Task"
          icon="plus"
          variant="primary"
          onPress={() => setIsAddModalOpen(true)}
        />
      </View>

      {/* Kanban Board Columns */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.boardScroll}>
        <View style={styles.boardColumns}>
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col);
            return (
              <View
                key={col}
                style={[
                  styles.columnWrapper,
                  { backgroundColor: colors.surfaceAlt, borderColor: colors.border }
                ]}
              >
                {/* Column Header */}
                <View style={styles.columnHeader}>
                  <Text style={[styles.columnTitle, { color: colors.text }]}>
                    {col}
                  </Text>
                  <View style={[styles.countBadge, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.countText, { color: colors.textMuted }]}>
                      {colTasks.length}
                    </Text>
                  </View>
                </View>

                {/* Column Task List */}
                <ScrollView style={styles.taskCardsScroll} showsVerticalScrollIndicator={false}>
                  {colTasks.map((t) => (
                    <GlassCard key={t.id} style={styles.taskCard}>
                      <View style={styles.cardTopRow}>
                        <Badge label={t.priority} variant={t.priority} size="small" />
                        <Text style={[styles.deptText, { color: colors.textSubtle }]}>
                          {t.department}
                        </Text>
                      </View>

                      <Text style={[styles.taskTitle, { color: colors.text }]}>
                        {t.title}
                      </Text>

                      <View style={[styles.taskFooter, { borderTopColor: colors.borderSubtle }]}>
                        <View style={styles.assigneeRow}>
                          <View style={[styles.miniAvatar, { backgroundColor: colors.primary }]}>
                            <Text style={styles.avatarLetter}>{t.assignee[0]}</Text>
                          </View>
                          <Text style={[styles.assigneeName, { color: colors.textMuted }]}>
                            {t.assignee.split(' ')[0]}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={[styles.moveBtn, { backgroundColor: colors.primarySoft }]}
                          onPress={() => moveTask(t.id)}
                          activeOpacity={0.8}
                        >
                          <Text style={[styles.moveBtnText, { color: colors.primary }]}>
                            Advance
                          </Text>
                          <Icon name="arrowRight" size={12} color={colors.primary} />
                        </TouchableOpacity>
                      </View>
                    </GlassCard>
                  ))}
                </ScrollView>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Add Task Modal */}
      {isAddModalOpen ? (
        <Modal
          visible={isAddModalOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsAddModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <GlassCard style={styles.modalCard}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Create New Project Task
              </Text>

              <View style={{ gap: 10, marginVertical: 12 }}>
                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Task Title:</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border }]}
                  placeholder="e.g. Implement OAuth biometric session persistence"
                  placeholderTextColor={colors.textSubtle}
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                />

                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Assignee:</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border }]}
                  value={taskAssignee}
                  onChangeText={setTaskAssignee}
                />

                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Priority:</Text>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {['High', 'Medium', 'Low'].map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.priorityPill,
                        {
                          backgroundColor: taskPriority === p ? colors.primarySoft : colors.surfaceAlt,
                          borderColor: taskPriority === p ? colors.primary : colors.border
                        }
                      ]}
                      onPress={() => setTaskPriority(p)}
                    >
                      <Text
                        style={[
                          styles.priorityPillText,
                          { color: taskPriority === p ? colors.primary : colors.text }
                        ]}
                      >
                        {p}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.modalFooter}>
                  <Button title="Cancel" variant="secondary" onPress={() => setIsAddModalOpen(false)} style={{ marginRight: 8 }} />
                  <Button title="Add Task" variant="primary" onPress={handleAddTask} />
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
  boardScroll: { flexDirection: 'row', paddingBottom: 16 },
  boardColumns: { flexDirection: 'row', gap: 12 },
  columnWrapper: { width: 260, borderRadius: 16, borderWidth: 1, padding: 10, maxHeight: 580 },
  columnHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  columnTitle: { fontSize: 13, fontWeight: '800' },
  countBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999 },
  countText: { fontSize: 11, fontWeight: '700' },
  taskCardsScroll: { flex: 1 },
  taskCard: { marginVertical: 4 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  deptText: { fontSize: 11, fontWeight: '600' },
  taskTitle: { fontSize: 13, fontWeight: '700', lineHeight: 18, marginBottom: 10 },
  taskFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, paddingTop: 8 },
  assigneeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  miniAvatar: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  avatarLetter: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  assigneeName: { fontSize: 11, fontWeight: '600' },
  moveBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, gap: 3 },
  moveBtnText: { fontSize: 11, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { width: '100%', maxWidth: 460 },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  fieldLabel: { fontSize: 12, fontWeight: '700' },
  input: { height: 40, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, fontSize: 14 },
  priorityPill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
  priorityPillText: { fontSize: 12, fontWeight: '600' },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }
});

export default TasksView;
