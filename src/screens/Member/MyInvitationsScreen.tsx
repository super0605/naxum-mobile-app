import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, Alert } from 'react-native';
import { getMyInvitations, acceptInvitation, declineInvitation } from '../../services/api/endpoints';
import { Invitation } from '../../domain/types';
import { Row } from '../../components/Row';
import { Button } from '../../components/Button';

export function MyInvitationsScreen() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const data = await getMyInvitations();
      setInvitations(data);
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
      Alert.alert('Error', 'Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await acceptInvitation(id);
      Alert.alert('Success', 'Invitation accepted!');
      await fetchInvitations();
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      Alert.alert('Error', 'Failed to accept invitation');
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await declineInvitation(id);
      Alert.alert('Success', 'Invitation declined');
      await fetchInvitations();
    } catch (error) {
      console.error('Failed to decline invitation:', error);
      Alert.alert('Error', 'Failed to decline invitation');
    }
  };

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
          <View style={styles.item}>
            <Row
              title={item.inviteeName || 'Team Invitation'}
              subtitle={`Phone: ${item.inviteePhone} • ${new Date(item.createdAt).toLocaleDateString()}`}
              right={
                item.status === 'PENDING' ? (
                  <View style={styles.actions}>
                    <Button
                      title="Accept"
                      onPress={() => handleAccept(item.id)}
                      style={[styles.actionBtn, styles.acceptBtn]}
                    />
                    <Button
                      title="Decline"
                      onPress={() => handleDecline(item.id)}
                      style={[styles.actionBtn, styles.declineBtn]}
                    />
                  </View>
                ) : (
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                )
              }
            />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No invitations received.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '900' },
  empty: { padding: 16, color: '#666' },
  item: { marginBottom: 8 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  acceptBtn: { backgroundColor: '#4caf50' },
  declineBtn: { backgroundColor: '#f44336' },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusText: { color: '#fff', fontSize: 10, fontWeight: '700' },
});

