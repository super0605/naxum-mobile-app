import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Row(props: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{props.title}</Text>
        {!!props.subtitle && <Text style={styles.sub}>{props.subtitle}</Text>}
      </View>
      {props.right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  title: { fontWeight: '700' },
  sub: { color: '#666', marginTop: 2, fontSize: 12 },
});
