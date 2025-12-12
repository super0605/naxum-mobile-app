import * as SecureStore from 'expo-secure-store';

const KEY = 'naxum_access_token';

export const tokenStorage = {
  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEY);
  },
  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(KEY, token);
  },
  async clearToken(): Promise<void> {
    await SecureStore.deleteItemAsync(KEY);
  },
};
