import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuthStore } from '../../stores/auth.store';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/routes';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
type FormData = z.infer<typeof schema>;

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const login = useAuthStore((s) => s.login);

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login(data.email, data.password);
    } catch (error: any) {
      // Error is already set in the store, but we'll show an alert for better UX
      const errorMessage = error?.response?.data?.message || error?.message || 'Invalid email or password';
      Alert.alert('Login Failed', errorMessage);
    }
  });

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Login</Text>

      <Input
        label="Email"
        value={watch('email')}
        onChangeText={(v) => setValue('email', v)}
        placeholder="you@example.com"
        error={errors.email?.message}
      />
      <Input
        label="Password"
        value={watch('password')}
        onChangeText={(v) => setValue('password', v)}
        secureTextEntry
        error={errors.password?.message}
      />

      <Button title="Login" onPress={onSubmit} loading={isSubmitting} />
      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        Create an account
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '900', marginBottom: 16 },
  link: { marginTop: 16, color: '#1a73e8', fontWeight: '700', textAlign: 'center' },
});
