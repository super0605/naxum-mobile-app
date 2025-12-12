import React, { useEffect, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTeamStore } from '../../stores/team.store';
import { flattenHierarchy } from '../../domain/hierarchy';

export function HierarchyScreen() {
  const { hierarchy, loadHierarchy, loading, error } = useTeamStore();

  useEffect(() => {
    loadHierarchy();
  }, [loadHierarchy]);

  const flat = useMemo(() => (hierarchy ? flattenHierarchy(hierarchy) : []), [hierarchy]);

  return (
    <View style={{ flex: 1 }}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={flat}
        keyExtractor={(i) => i.id}
        refreshing={loading}
        onRefresh={loadHierarchy}
        renderItem={({ item }) => (
          <View style={[styles.row, { paddingLeft: 16 + item.depth * 16 }]}>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.txt}>{item.name}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hierarchy data.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dot: { marginRight: 8, fontSize: 16 },
  txt: { fontWeight: '800' },
  empty: { padding: 16, color: '#666' },
  error: { padding: 16, color: '#d33' },
});
