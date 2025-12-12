import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { getTask } from '../../services/api/endpoints';
import { Task } from '../../domain/types';
import { Button } from '../../components/Button';
import { useTasksStore } from '../../stores/tasks.store';
import { useAuthStore } from '../../stores/auth.store';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/routes';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

export function TaskDetailScreen({ route, navigation }: Props) {
  const { taskId } = route.params;
  const user = useAuthStore((s) => s.user);
  const complete = useTasksStore((s) => s.complete);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    setLoading(true);
    try {
      const res = await getTask(taskId);
      setTask(res.task);
    } catch (error) {
      console.error('Failed to load task:', error);
      Alert.alert('Error', 'Failed to load task details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!task) return;
    try {
      await complete(task.id);
      await loadTask();
      Alert.alert('Success', 'Task marked as completed');
    } catch (error) {
      Alert.alert('Error', 'Failed to complete task');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.center}>
        <Text>Task not found</Text>
      </View>
    );
  }

  const canComplete = task.status === 'OPEN' && (user?.role === 'MEMBER' || user?.id === task.assignedToUserId);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{task.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: task.status === 'OPEN' ? '#ffa500' : '#4caf50' }]}>
          <Text style={styles.statusText}>{task.status}</Text>
        </View>
      </View>

      {task.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{task.description}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assigned To</Text>
        <Text style={styles.infoText}>
          {task.assignedTo?.name || 'Unknown'} {task.assignedTo?.email && `(${task.assignedTo.email})`}
        </Text>
      </View>

      {task.createdBy && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Created By</Text>
          <Text style={styles.infoText}>
            {task.createdBy.name} {task.createdBy.email && `(${task.createdBy.email})`}
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Created</Text>
        <Text style={styles.infoText}>{new Date(task.createdAt).toLocaleString()}</Text>
      </View>

      {task.completedAt && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completed</Text>
          <Text style={styles.infoText}>{new Date(task.completedAt).toLocaleString()}</Text>
        </View>
      )}

      {canComplete && (
        <View style={styles.actions}>
          <Button title="Mark as Completed" onPress={handleComplete} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 20, fontWeight: '900', flex: 1, marginRight: 12 },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  section: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  sectionTitle: { fontSize: 14, fontWeight: '800', marginBottom: 8, color: '#666' },
  description: { fontSize: 16, lineHeight: 24, color: '#333' },
  infoText: { fontSize: 16, color: '#333' },
  actions: { padding: 16 },
});

