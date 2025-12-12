import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { getLeaderInvitations } from '../../services/api/endpoints';
import { Invitation } from '../../domain/types';
import { Row } from '../../components/Row';

export function InvitationsScreen() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const data = await getLeaderInvitations();
      setInvitations(data);
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#ffa500';
      case 'ACCEPTED':
        return '#4caf50';
      case 'DECLINED':
        return '#f44336';
      default:
        return '#666';
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.title}>My Invitations</Text>
      </View>

      <FlatList
        data={invitations}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchInvitations} />}
        renderItem={({ item }) => (
          <Row
            title={item.inviteeName || 'Unknown'}
            subtitle={`${item.inviteePhone} • ${new Date(item.createdAt).toLocaleDateString()}`}
            right={
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            }
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No invitations sent yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '900' },
  empty: { padding: 16, color: '#666' },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusText: { color: '#fff', fontSize: 10, fontWeight: '700' },
});

