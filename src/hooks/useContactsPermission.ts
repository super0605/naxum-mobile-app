import { useCallback, useState } from 'react';
import * as Contacts from 'expo-contacts';

export function useContactsPermission() {
  const [status, setStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');

  const check = useCallback(async () => {
    const perm = await Contacts.getPermissionsAsync();
    setStatus(perm.status === 'granted' ? 'granted' : 'denied');
  }, []);

  const request = useCallback(async () => {
    const perm = await Contacts.requestPermissionsAsync();
    setStatus(perm.status === 'granted' ? 'granted' : 'denied');
  }, []);

  return { status, check, request };
}
