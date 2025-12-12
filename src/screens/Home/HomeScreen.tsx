import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useAuthStore } from '../../stores/auth.store';
import { ContactsScreen } from '../Contacts/ContactsScreen';
import { TeamScreen } from '../Team/TeamScreen';
import { TasksScreen } from '../Tasks/TasksScreen';
import { DashboardScreen } from '../Dashboard/DashboardScreen';
import { InvitationsScreen } from '../Leader/InvitationsScreen';
import { MyInvitationsScreen } from '../Member/MyInvitationsScreen';

type Tab = 'contacts' | 'team' | 'tasks' | 'dashboard' | 'invitations';

export function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const tabs = useMemo(() => {
    if (user?.role === 'LEADER') return (['contacts', 'team', 'tasks', 'dashboard', 'invitations'] as Tab[]);
    return (['tasks', 'team', 'invitations'] as Tab[]);
  }, [user?.role]);

  const [tab, setTab] = useState<Tab>(tabs[0]);

  useEffect(() => {
    setTab(tabs[0]);
  }, [tabs]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.top}>
        <View>
          <Text style={styles.hi}>Hi, {user?.name}</Text>
          <Text style={styles.sub}>Role: {user?.role}</Text>
        </View>
        <Pressable onPress={logout} style={styles.logout}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Logout</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBar}
        style={styles.tabBarContainer}
      >
        {tabs.map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
            <Text style={[styles.tabTxt, tab === t && styles.tabTxtActive]}>{t.toUpperCase()}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ flex: 1 }}>
        {tab === 'contacts' && <ContactsScreen />}
        {tab === 'team' && <TeamScreen />}
        {tab === 'tasks' && <TasksScreen />}
        {tab === 'dashboard' && <DashboardScreen />}
        {tab === 'invitations' && (user?.role === 'LEADER' ? <InvitationsScreen /> : <MyInvitationsScreen />)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hi: { fontSize: 18, fontWeight: '800' },
  sub: { color: '#666', marginTop: 4 },
  logout: { backgroundColor: '#111', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  tabBarContainer: { maxHeight: 55 },
  tabBar: { flexDirection: 'row', paddingHorizontal: 10, gap: 8, paddingBottom: 10, paddingTop: 10 },
  tab: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', minWidth: 80, alignItems: 'center', justifyContent: 'center' },
  tabActive: { backgroundColor: '#111', borderColor: '#111' },
  tabTxt: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
  tabTxtActive: { color: '#fff' },
});
