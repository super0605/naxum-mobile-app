import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/routes';
import { useTeamStore } from '../../stores/team.store';
import { useAuthStore } from '../../stores/auth.store';
import { Button } from '../../components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'MemberProfile'>;

export function MemberProfileScreen({ route, navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const members = useTeamStore((s) => s.members);
  const member = useMemo(() => members.find((m) => m.id === route.params.memberId), [members, route.params.memberId]);

  if (!member) {
    return (
      <View style={styles.wrap}>
        <Text>Member not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.name}>{member.name}</Text>
      <Text style={styles.meta}>{member.email}</Text>
      <Text style={styles.meta}>Joined: {new Date(member.createdAt).toLocaleString()}</Text>

      {user?.role === 'LEADER' && (
        <Button title="Assign Task" onPress={() => navigation.navigate('CreateTask')} style={{ marginTop: 16 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16 },
  name: { fontSize: 20, fontWeight: '900' },
  meta: { marginTop: 8, color: '#666' },
});
