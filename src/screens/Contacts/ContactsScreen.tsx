import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Share, Alert } from 'react-native';
import { useContactsPermission } from '../../hooks/useContactsPermission';
import { loadPhoneContacts, PhoneContact } from '../../services/contacts/contacts.service';
import { Button } from '../../components/Button';
import { Row } from '../../components/Row';
import { useInvitationsStore } from '../../stores/invitations.store';
import { checkInvitationStatus, InvitationStatus } from '../../services/api/endpoints';
import { findMatchingStatus, phonesMatch } from '../../utils/phoneUtils';

export function ContactsScreen() {
  const { status, check, request } = useContactsPermission();
  const invite = useInvitationsStore((s) => s.invite);

  const [contacts, setContacts] = useState<PhoneContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [invitationStatuses, setInvitationStatuses] = useState<Map<string, InvitationStatus>>(new Map());

  useEffect(() => {
    check();
  }, [check]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return contacts;
    return contacts.filter((c) => c.name.toLowerCase().includes(query) || (c.phone ?? '').includes(query));
  }, [contacts, q]);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await loadPhoneContacts();
      const contactsWithPhone = data.filter((c) => !!c.phone);
      setContacts(contactsWithPhone);

      // Check invitation statuses for all contacts
      if (contactsWithPhone.length > 0) {
        const phoneNumbers = contactsWithPhone.map((c) => c.phone!).filter(Boolean);
        try {
          const statusRes = await checkInvitationStatus(phoneNumbers);
          const statusMap = new Map<string, InvitationStatus>();
          
          // Match statuses back to contacts
          // Backend normalizes phone numbers, so we need to match the response back to original contacts
          statusRes.statuses.forEach((status) => {
            // Find matching contact - backend should return statuses in same order or match by normalized phone
            // We'll try to match by finding the contact whose phone (when normalized) matches the status phone
            // Since we don't normalize on frontend, we'll store by status phone and lookup by trying both
            const matchingContact = contactsWithPhone.find((c) => {
              // Try exact match first
              if (c.phone === status.phone) return true;
              // Backend normalizes, so we'll store by status phone and lookup will handle matching
              return false;
            });
            
            // Store using the status phone (normalized) as key
            // We'll need to lookup by trying the contact phone and status phone
            statusMap.set(status.phone, status);
            
            // Also store by original contact phone if we found a match
            if (matchingContact && matchingContact.phone && matchingContact.phone !== status.phone) {
              statusMap.set(matchingContact.phone, status);
            }
          });
          
          setInvitationStatuses(statusMap);
        } catch (error) {
          console.error('Failed to check invitation statuses:', error);
          // Don't block contact loading if status check fails
        }
      }
    } catch {
      Alert.alert('Error', 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }, []);

  const onInvite = useCallback(async (c: PhoneContact) => {
    if (!c.phone) return;
    const status = findMatchingStatus(c.phone, invitationStatuses);
    if (status && !status.canInvite) {
      return; // Should not happen if button is disabled, but safety check
    }

    try {
      const res = await invite({ inviteePhone: c.phone, inviteeName: c.name });
      const token = res.inviteUrl.split('token=')[1] || '';
      await Share.share({ 
        message: `Join my NaXum team: ${res.inviteUrl}${token ? `\n\nToken: ${token}` : ''}` 
      });

      // Refresh invitation status for this contact
      try {
        const statusRes = await checkInvitationStatus([c.phone]);
        if (statusRes.statuses.length > 0) {
          const newStatus = statusRes.statuses[0];
          setInvitationStatuses((prev) => {
            const updated = new Map(prev);
            // Store by both normalized and original phone
            updated.set(newStatus.phone, newStatus);
            updated.set(c.phone!, newStatus);
            return updated;
          });
        }
      } catch (error) {
        console.error('Failed to refresh invitation status:', error);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to send invitation';
      Alert.alert('Error', errorMessage);
    }
  }, [invite, invitationStatuses]);

  if (status === 'unknown') {
    return <View style={styles.center}><Text>Checking permission...</Text></View>;
  }

  if (status === 'denied') {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Contacts Permission Needed</Text>
        <Text style={styles.sub}>To import contacts, please allow access.</Text>
        <Button title="Grant Permission" onPress={request} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Import Contacts</Text>
        <Button title="Load" onPress={fetchContacts} loading={loading} />
      </View>

      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="Search by name or phone"
        style={styles.search}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const status = item.phone ? findMatchingStatus(item.phone, invitationStatuses) : undefined;
          const canInvite = !status || status.canInvite;
          const statusText = status && !status.canInvite
            ? status.status === 'MEMBER'
              ? 'Member'
              : 'Invited'
            : 'Invite';

          return (
            <Row
              title={item.name}
              subtitle={item.phone}
              right={
                <Button
                  title={statusText}
                  onPress={() => onInvite(item)}
                  disabled={!canInvite}
                  style={[
                    { paddingVertical: 8, paddingHorizontal: 10 },
                    !canInvite && { backgroundColor: '#999' },
                  ]}
                />
              }
            />
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No contacts loaded.</Text>}
        initialNumToRender={20}
        windowSize={7}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        getItemLayout={(data, index) => ({
          length: 60,
          offset: 60 * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '900' },
  sub: { color: '#666', marginTop: 8, textAlign: 'center' },
  search: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10, marginHorizontal: 16, marginBottom: 10 },
  empty: { padding: 16, color: '#666' },
});
