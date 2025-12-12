import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';

export function useAuthBootstrap() {
  const bootstrap = useAuthStore((s) => s.bootstrap);
  useEffect(() => {
    bootstrap();
  }, [bootstrap]);
}
