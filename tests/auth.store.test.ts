import { useAuthStore } from '../src/stores/auth.store';
import * as api from '../src/services/api/endpoints';
import { tokenStorage } from '../src/services/auth/tokenStorage';

// Mock dependencies
jest.mock('../src/services/api/endpoints');
jest.mock('../src/services/auth/tokenStorage');

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      user: null,
      token: null,
      isBootstrapping: false,
      error: null,
    });
    
    // Clear mocks
    jest.clearAllMocks();
  });

  it('initializes with null user and token', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isBootstrapping).toBe(false);
    expect(state.error).toBeNull();
  });

  it('has all required functions', () => {
    const state = useAuthStore.getState();
    expect(typeof state.login).toBe('function');
    expect(typeof state.register).toBe('function');
    expect(typeof state.bootstrap).toBe('function');
    expect(typeof state.logout).toBe('function');
  });

  describe('login', () => {
    it('sets user and token on successful login', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        phone: '1234567890',
        name: 'Test User',
        role: 'LEADER' as const,
      };
      const mockToken = 'jwt-token-123';

      (api.login as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });
      (tokenStorage.setToken as jest.Mock).mockResolvedValue(undefined);

      await useAuthStore.getState().login('test@example.com', 'password123');

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(state.error).toBeNull();
      expect(tokenStorage.setToken).toHaveBeenCalledWith(mockToken);
    });

    it('handles login errors', async () => {
      const error = {
        response: {
          data: { message: 'Invalid credentials' },
        },
        message: 'Invalid credentials',
      };

      (api.login as jest.Mock).mockRejectedValue(error);

      await expect(
        useAuthStore.getState().login('test@example.com', 'wrong')
      ).rejects.toEqual(error);

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.error).toBe('Invalid credentials');
    });
  });

  describe('register', () => {
    it('sets user and token on successful registration', async () => {
      const mockUser = {
        id: '1',
        email: 'new@example.com',
        phone: '1234567890',
        name: 'New User',
        role: 'MEMBER' as const,
      };
      const mockToken = 'jwt-token-456';

      (api.register as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });
      (tokenStorage.setToken as jest.Mock).mockResolvedValue(undefined);

      await useAuthStore.getState().register({
        email: 'new@example.com',
        phone: '1234567890',
        password: 'password123',
        name: 'New User',
        role: 'MEMBER',
      });

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(state.error).toBeNull();
    });
  });

  describe('bootstrap', () => {
    it('restores session when token exists', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        phone: '1234567890',
        name: 'Test User',
        role: 'LEADER' as const,
      };
      const mockToken = 'existing-token';

      (tokenStorage.getToken as jest.Mock).mockResolvedValue(mockToken);
      (api.me as jest.Mock).mockResolvedValue({ user: mockUser });

      await useAuthStore.getState().bootstrap();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(state.isBootstrapping).toBe(false);
    });

    it('clears session when token is invalid', async () => {
      (tokenStorage.getToken as jest.Mock).mockResolvedValue('invalid-token');
      (api.me as jest.Mock).mockRejectedValue(new Error('Unauthorized'));
      (tokenStorage.clearToken as jest.Mock).mockResolvedValue(undefined);

      await useAuthStore.getState().bootstrap();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isBootstrapping).toBe(false);
      expect(tokenStorage.clearToken).toHaveBeenCalled();
    });

    it('does nothing when no token exists', async () => {
      (tokenStorage.getToken as jest.Mock).mockResolvedValue(null);

      await useAuthStore.getState().bootstrap();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isBootstrapping).toBe(false);
    });
  });

  describe('logout', () => {
    it('clears user and token', async () => {
      useAuthStore.setState({
        user: { id: '1', email: 'test@example.com', phone: '123', name: 'Test', role: 'LEADER' },
        token: 'token-123',
      });
      (tokenStorage.clearToken as jest.Mock).mockResolvedValue(undefined);

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(tokenStorage.clearToken).toHaveBeenCalled();
    });
  });
});
