import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuthStore } from '../../stores/auth.store';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/routes';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1, 'Phone number is required'),
  password: z.string().min(8),
  inviteToken: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const register = useAuthStore((s) => s.register);
  const [role, setRole] = useState<'LEADER' | 'MEMBER'>('LEADER');

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { name: '', email: '', phone: '', password: '', inviteToken: '' } });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role,
        inviteToken: role === 'MEMBER' ? (data.inviteToken || undefined) : undefined,
      });
    } catch (error: any) {
      // Error is already set in the store, but we'll show an alert for better UX
      const errorMessage = error?.response?.data?.message || error?.message || 'Registration failed';
      Alert.alert('Registration Failed', errorMessage);
    }
  });

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Register</Text>

      <View style={styles.roleRow}>
        <Pressable onPress={() => setRole('LEADER')} style={[styles.pill, role === 'LEADER' && styles.pillActive]}>
          <Text style={[styles.pillTxt, role === 'LEADER' && styles.pillTxtActive]}>LEADER</Text>
        </Pressable>
        <Pressable onPress={() => setRole('MEMBER')} style={[styles.pill, role === 'MEMBER' && styles.pillActive]}>
          <Text style={[styles.pillTxt, role === 'MEMBER' && styles.pillTxtActive]}>MEMBER</Text>
        </Pressable>
      </View>

      <Input label="Name" value={watch('name')} onChangeText={(v) => setValue('name', v)} error={errors.name?.message} />
      <Input
        label="Email"
        value={watch('email')}
        onChangeText={(v) => setValue('email', v)}
        placeholder="you@example.com"
        error={errors.email?.message}
      />
      <Input
        label="Phone"
        value={watch('phone')}
        onChangeText={(v) => setValue('phone', v)}
        placeholder="+1234567890"
        error={errors.phone?.message}
      />
      <Input
        label="Password"
        value={watch('password')}
        onChangeText={(v) => setValue('password', v)}
        secureTextEntry
        error={errors.password?.message}
      />

      {role === 'MEMBER' && (
        <Input
          label="Invite Token (optional)"
          value={watch('inviteToken') || ''}
          onChangeText={(v) => setValue('inviteToken', v)}
          placeholder="Paste token from invite link"
          error={errors.inviteToken?.message}
        />
      )}

      <Button title="Create Account" onPress={onSubmit} loading={isSubmitting} />
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Back to login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '900', marginBottom: 16 },
  link: { marginTop: 16, color: '#1a73e8', fontWeight: '700', textAlign: 'center' },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  pill: { borderWidth: 1, borderColor: '#ddd', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999 },
  pillActive: { backgroundColor: '#111', borderColor: '#111' },
  pillTxt: { fontWeight: '800', fontSize: 12 },
  pillTxtActive: { color: '#fff' },
});
