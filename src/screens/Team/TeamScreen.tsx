import React, { useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, Pressable } from 'react-native';
import { useTeamStore } from '../../stores/team.store';
import { Row } from '../../components/Row';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/routes';
import { useAuthStore } from '../../stores/auth.store';

export function TeamScreen() {
  const user = useAuthStore((s) => s.user);
  const { members, loading, refreshMembers } = useTeamStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    refreshMembers();
  }, [refreshMembers]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Team</Text>
        {user?.role === 'LEADER' && (
          <Pressable onPress={() => navigation.navigate('Hierarchy')} style={styles.linkBtn}>
            <Text style={styles.linkTxt}>View Hierarchy</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={members}
        keyExtractor={(m) => m.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshMembers} />}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('MemberProfile', { memberId: item.id })}>
            <Row title={item.name} subtitle={`Joined: ${new Date(item.createdAt).toLocaleDateString()}`} />
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No team members yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '900' },
  empty: { padding: 16, color: '#666' },
  linkBtn: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
  linkTxt: { fontWeight: '800', fontSize: 12 },
});
