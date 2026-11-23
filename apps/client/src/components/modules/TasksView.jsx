import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import { initialTasks } from '../../services/dataStore.js';

export function TasksView() {
  const { colors, borderRadius } = useTheme();
  const [tasks, setTasks] = useState(initialTasks);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form
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
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Projects & Task Board</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {tasks.length} active initiatives across sprint cycles
          </Text>
        </View>

        <Button
          title="+ New Task"
          variant="primary"
          onPress={() => setIsAddModalOpen(true)}
        />
      </View>

      {/* Kanban Columns (Horizontal Scrollable) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.boardScroll}>
        <View style={styles.boardColumns}>
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col);
            return (
              <View
                key={col}
                style={[
                  styles.columnWrapper,
                  { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }
                ]}
              >
                {/* Column Header */}
                <View style={styles.columnHeader}>
                  <Text style={[styles.columnTitle, { color: colors.textPrimary }]}>
                    {col}
                  </Text>
                  <View style={[styles.countBadge, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.countText, { color: colors.textSecondary }]}>
                      {colTasks.length}
                    </Text>
                  </View>
                </View>

                {/* Task Cards in Column */}
                <ScrollView style={styles.taskCardsScroll} showsVerticalScrollIndicator={false}>
                  {colTasks.map((t) => (
                    <GlassCard key={t.id} style={styles.taskCard}>
                      <View style={styles.cardTopRow}>
                        <Badge label={t.priority} variant={t.priority} size="small" />
                        <Text style={[styles.deptText, { color: colors.textMuted }]}>
                          {t.department}
                        </Text>
                      </View>

                      <Text style={[styles.taskTitle, { color: colors.textPrimary }]}>
                        {t.title}
                      </Text>

                      <View style={styles.taskFooter}>
                        <View style={styles.assigneeRow}>
                          <View style={styles.miniAvatar}>
                            <Text style={styles.avatarLetter}>{t.assignee[0]}</Text>
                          </View>
                          <Text style={[styles.assigneeName, { color: colors.textSecondary }]}>
                            {t.assignee}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={[styles.moveBtn, { backgroundColor: colors.primarySubtle }]}
                          onPress={() => moveTask(t.id)}
                        >
                          <Text style={[styles.moveBtnText, { color: colors.primary }]}>
                            Advance →
                          </Text>
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
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Create New Project Task
              </Text>

              <View style={styles.formGap}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Task Title:</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceSubtle, color: colors.textPrimary, borderColor: colors.border }]}
                  placeholder="e.g. Implement OAuth biometric session persistence"
                  placeholderTextColor={colors.textMuted}
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                />

                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Assignee:</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceSubtle, color: colors.textPrimary, borderColor: colors.border }]}
                  value={taskAssignee}
                  onChangeText={setTaskAssignee}
                />

                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Priority:</Text>
                <View style={styles.pillsRow}>
                  {['High', 'Medium', 'Low'].map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.priorityPill,
                        {
                          backgroundColor: taskPriority === p ? colors.primary : colors.surfaceSubtle,
                          borderColor: taskPriority === p ? colors.primary : colors.border
                        }
                      ]}
                      onPress={() => setTaskPriority(p)}
                    >
                      <Text
                        style={[
                          styles.priorityPillText,
                          { color: taskPriority === p ? '#FFFFFF' : colors.textSecondary }
                        ]}
                      >
                        {p}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.modalFooter}>
                  <Button
                    title="Cancel"
                    variant="secondary"
                    onPress={() => setIsAddModalOpen(false)}
                    style={{ marginRight: 8 }}
                  />
                  <Button
                    title="Add Task"
                    variant="primary"
                    onPress={handleAddTask}
                  />
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
  container: {
    width: '100%'
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 20,
    fontWeight: '800'
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2
  },
  boardScroll: {
    flexDirection: 'row'
  },
  boardColumns: {
    flexDirection: 'row',
    gap: 14,
    paddingBottom: 20
  },
  columnWrapper: {
    width: 280,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    maxHeight: 600
  },
  columnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: '800'
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999
  },
  countText: {
    fontSize: 12,
    fontWeight: '700'
  },
  taskCardsScroll: {
    flex: 1
  },
  taskCard: {
    marginVertical: 4
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  deptText: {
    fontSize: 11,
    fontWeight: '600'
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 12
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 8
  },
  assigneeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  miniAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  assigneeName: {
    fontSize: 11,
    fontWeight: '600'
  },
  moveBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  moveBtnText: {
    fontSize: 11,
    fontWeight: '700'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  modalCard: {
    width: '100%',
    maxWidth: 480
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16
  },
  formGap: {
    gap: 12
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700'
  },
  input: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8
  },
  priorityPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1
  },
  priorityPillText: {
    fontSize: 12,
    fontWeight: '700'
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 14
  }
});

export default TasksView;
