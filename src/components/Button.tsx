import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';

export function Button(props: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}) {
  const { title, onPress, disabled, loading, style } = props;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.btn, (disabled || loading) && styles.btnDisabled, style]}
    >
      {loading ? <ActivityIndicator /> : <Text style={styles.txt}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 12, borderRadius: 10, backgroundColor: '#111', alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },
  txt: { color: '#fff', fontWeight: '700' },
});
