import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useTasksStore } from '../../stores/tasks.store';
import { Row } from '../../components/Row';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../stores/auth.store';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/routes';

type Filter = 'ALL' | 'OPEN' | 'COMPLETED';

export function TasksScreen() {
  const user = useAuthStore((s) => s.user);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { tasks, loading, refresh, complete } = useTasksStore();
  const [filter, setFilter] = useState<Filter>('ALL');

  useEffect(() => {
    refresh(filter === 'ALL' ? undefined : { status: filter });
  }, [refresh, filter]);

  const handleRefresh = useCallback(() => {
    refresh(filter === 'ALL' ? undefined : { status: filter });
  }, [refresh, filter]);

  const handleComplete = useCallback((taskId: string, e: any) => {
    e.stopPropagation();
    complete(taskId);
  }, [complete]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        {user?.role === 'LEADER' && <Button title="Assign" onPress={() => navigation.navigate('CreateTask')} />}
      </View>

      <View style={styles.filters}>
        {(['ALL', 'OPEN', 'COMPLETED'] as Filter[]).map((f) => (
          <Pressable key={f} onPress={() => setFilter(f)} style={[styles.f, filter === f && styles.fActive]}>
            <Text style={[styles.fTxt, filter === f && styles.fTxtActive]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(t) => t.id}
        refreshing={loading}
        onRefresh={handleRefresh}
        renderItem={({ item }) => {
          const canComplete = item.status === 'OPEN' && (user?.role === 'MEMBER' || user?.id === item.assignedToUserId);
          const parts = [item.status];
          if (item.assignedTo?.name) parts.push(item.assignedTo.name);
          if (item.description) parts.push('Has description');
          const subtitle = parts.join(' • ');
          
          return (
            <Pressable onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}>
              <Row
                title={item.title}
                subtitle={subtitle}
                right={
                  canComplete ? (
                    <Button
                      title="Done"
                      onPress={(e) => handleComplete(item.id, e)}
                      style={{ paddingVertical: 8, paddingHorizontal: 10 }}
                    />
                  ) : null
                }
              />
            </Pressable>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No tasks.</Text>}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '900' },
  empty: { padding: 16, color: '#666' },
  filters: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 10 },
  f: { borderWidth: 1, borderColor: '#ddd', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10 },
  fActive: { backgroundColor: '#111', borderColor: '#111' },
  fTxt: { fontWeight: '800', fontSize: 12 },
  fTxtActive: { color: '#fff' },
});
