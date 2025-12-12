import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export function Input(props: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        secureTextEntry={props.secureTextEntry}
        style={[styles.input, props.error ? styles.inputError : null]}
        autoCapitalize="none"
      />
      {!!props.error && <Text style={styles.error}>{props.error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10 },
  inputError: { borderColor: '#d33' },
  error: { color: '#d33', marginTop: 4 },
});
