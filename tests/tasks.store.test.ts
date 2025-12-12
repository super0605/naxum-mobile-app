import { useTasksStore } from '../src/stores/tasks.store';
import * as api from '../src/services/api/endpoints';

// Mock the API module
jest.mock('../src/services/api/endpoints');

describe('TasksStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useTasksStore.setState({
      tasks: [],
      loading: false,
      error: null,
    });
  });

  it('initializes with empty tasks array', () => {
    const state = useTasksStore.getState();
    expect(Array.isArray(state.tasks)).toBe(true);
    expect(state.tasks.length).toBe(0);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('has refresh function', () => {
    const state = useTasksStore.getState();
    expect(typeof state.refresh).toBe('function');
  });

  it('has create function', () => {
    const state = useTasksStore.getState();
    expect(typeof state.create).toBe('function');
  });

  it('has complete function', () => {
    const state = useTasksStore.getState();
    expect(typeof state.complete).toBe('function');
  });

  describe('refresh', () => {
    it('sets loading to true during refresh', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', status: 'OPEN' as const, createdAt: '2024-01-01', assignedToUserId: 'user1' },
      ];
      
      (api.listTasks as jest.Mock).mockResolvedValue({ tasks: mockTasks });

      const promise = useTasksStore.getState().refresh();
      
      // Check loading state immediately
      expect(useTasksStore.getState().loading).toBe(true);
      
      await promise;
      
      expect(useTasksStore.getState().loading).toBe(false);
      expect(useTasksStore.getState().tasks).toEqual(mockTasks);
    });

    it('handles errors gracefully', async () => {
      (api.listTasks as jest.Mock).mockRejectedValue(new Error('Network error'));

      await useTasksStore.getState().refresh();

      expect(useTasksStore.getState().loading).toBe(false);
      expect(useTasksStore.getState().error).toBe('Failed to load tasks');
    });
  });

  describe('create', () => {
    it('adds new task to the list', async () => {
      const newTask = {
        id: '1',
        title: 'New Task',
        status: 'OPEN' as const,
        createdAt: '2024-01-01',
        assignedToUserId: 'user1',
      };

      (api.createTask as jest.Mock).mockResolvedValue({ task: newTask });

      await useTasksStore.getState().create({
        assignedToUserId: 'user1',
        title: 'New Task',
      });

      const state = useTasksStore.getState();
      expect(state.tasks).toContainEqual(newTask);
      expect(state.tasks.length).toBe(1);
    });

    it('throws error for duplicate tasks', async () => {
      const error = {
        response: {
          status: 409,
          data: { message: 'Duplicate task' },
        },
      };

      (api.createTask as jest.Mock).mockRejectedValue(error);

      await expect(
        useTasksStore.getState().create({
          assignedToUserId: 'user1',
          title: 'Duplicate Task',
        })
      ).rejects.toThrow('Duplicate task');
    });
  });

  describe('complete', () => {
    it('updates task status to completed', async () => {
      const task = {
        id: '1',
        title: 'Task 1',
        status: 'OPEN' as const,
        createdAt: '2024-01-01',
        assignedToUserId: 'user1',
      };

      const completedTask = {
        ...task,
        status: 'COMPLETED' as const,
        completedAt: '2024-01-02',
      };

      useTasksStore.setState({ tasks: [task] });
      (api.completeTask as jest.Mock).mockResolvedValue({ task: completedTask });

      await useTasksStore.getState().complete('1');

      const state = useTasksStore.getState();
      const updatedTask = state.tasks.find((t) => t.id === '1');
      expect(updatedTask?.status).toBe('COMPLETED');
      expect(updatedTask?.completedAt).toBe('2024-01-02');
    });
  });
});
