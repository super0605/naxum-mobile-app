import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, Alert } from 'react-native';
import { useTeamStore } from '../../stores/team.store';
import { useTasksStore } from '../../stores/tasks.store';
import { Button } from '../../components/Button';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/routes';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateTask'>;

export function CreateTaskScreen({ navigation }: Props) {
  const { members, refreshMembers } = useTeamStore();
  const createTask = useTasksStore((s) => s.create);

  const [selected, setSelected] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    refreshMembers();
  }, [refreshMembers]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return members;
    return members.filter((m) => m.name.toLowerCase().includes(query) || m.email.toLowerCase().includes(query));
  }, [members, q]);

  const submit = async () => {
    if (!selected) return Alert.alert('Select member', 'Please choose a team member.');
    if (!title.trim()) return Alert.alert('Title required', 'Enter a task title.');
    try {
      await createTask({ assignedToUserId: selected, title: title.trim(), description: description.trim() || undefined });
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Duplicate Task', error?.message || 'A task with the same title already exists for this user');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.form}>
        <Text style={styles.label}>Task Title</Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="e.g. Follow up with lead" />
        <Text style={styles.label}>Description (optional)</Text>
        <TextInput value={description} onChangeText={setDescription} style={styles.input} placeholder="Notes..." />

        <Button title="Create Task" onPress={submit} style={{ marginTop: 10 }} />
      </View>

      <View style={styles.pickHeader}>
        <Text style={styles.title}>Assign to</Text>
        <TextInput value={q} onChangeText={setQ} style={styles.search} placeholder="Search members" />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => {
          const active = selected === item.id;
          return (
            <Pressable onPress={() => setSelected(item.id)} style={[styles.memberRow, active && styles.memberRowActive]}>
              <Text style={[styles.memberName, active && styles.memberNameActive]}>{item.name}</Text>
              <Text style={[styles.memberEmail, active && styles.memberNameActive]}>{item.email}</Text>
            </Pressable>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No members.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  label: { fontWeight: '800', marginTop: 10, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10 },
  pickHeader: { padding: 16 },
  title: { fontSize: 16, fontWeight: '900', marginBottom: 8 },
  search: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10 },
  memberRow: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#eee' },
  memberRowActive: { backgroundColor: '#111' },
  memberName: { fontWeight: '900' },
  memberEmail: { color: '#666', marginTop: 4, fontSize: 12 },
  memberNameActive: { color: '#fff' },
  empty: { padding: 16, color: '#666' },
});
