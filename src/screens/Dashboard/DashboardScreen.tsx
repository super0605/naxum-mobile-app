import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { useAuthStore } from '../../stores/auth.store';
import * as api from '../../services/api/endpoints';

export function DashboardScreen() {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{ totalTeamSize: number; activeMembers: number; completionRate: number } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getTeamStats();
      setStats(res.stats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'LEADER') load();
  }, [user?.role]);

  if (user?.role !== 'LEADER') {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.sub}>Available for leaders only.</Text>
      </View>
    );
  }

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Team Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.k}>Total team size</Text>
        <Text style={styles.v}>{stats?.totalTeamSize ?? 0}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.k}>Active members</Text>
        <Text style={styles.v}>{stats?.activeMembers ?? 0}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.k}>Completion rate</Text>
        <Text style={styles.v}>{stats?.completionRate ?? 0}%</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 18, fontWeight: '900' },
  sub: { color: '#666', marginTop: 8 },
  card: { borderWidth: 1, borderColor: '#eee', borderRadius: 16, padding: 16, marginTop: 12 },
  k: { color: '#666', fontWeight: '700' },
  v: { fontSize: 28, fontWeight: '900', marginTop: 8 },
});
