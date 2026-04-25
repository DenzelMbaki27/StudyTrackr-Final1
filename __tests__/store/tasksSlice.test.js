import tasksReducer, {
  addTask,
  deleteTask,
  toggleTask,
  updateTask,
  setMotivationalQuote,
} from '../../src/store/tasksSlice';

const sampleTask = {
  id: '1001',
  title: 'Read Chapter 3',
  subject: 'Biology',
  dueDate: 'Dec 10, 2025',
  priority: 'High',
  notes: 'Focus on cell division',
  completed: false,
  createdAt: '2025-11-01T10:00:00.000Z',
};

const initialState = {
  taskList: [],
  motivationalQuote: '',
};

describe('tasksSlice reducer', () => {
  it('returns the initial state when no action is passed', () => {
    const state = tasksReducer(undefined, { type: undefined });
    expect(state).toEqual(initialState);
  });

  describe('addTask', () => {
    it('adds a task to the list', () => {
      const state = tasksReducer(initialState, addTask(sampleTask));
      expect(state.taskList).toHaveLength(1);
      expect(state.taskList[0]).toEqual(sampleTask);
    });

    it('adds multiple tasks correctly', () => {
      let state = tasksReducer(initialState, addTask(sampleTask));
      state = tasksReducer(state, addTask({ ...sampleTask, id: '1002', title: 'Write Essay' }));
      expect(state.taskList).toHaveLength(2);
    });

    it('preserves existing tasks when adding a new one', () => {
      let state = tasksReducer(initialState, addTask(sampleTask));
      state = tasksReducer(state, addTask({ ...sampleTask, id: '1002', title: 'Second Task' }));
      expect(state.taskList[0].title).toBe('Read Chapter 3');
      expect(state.taskList[1].title).toBe('Second Task');
    });
  });

  describe('deleteTask', () => {
    it('removes the task with the matching id', () => {
      let state = tasksReducer(initialState, addTask(sampleTask));
      state = tasksReducer(state, deleteTask('1001'));
      expect(state.taskList).toHaveLength(0);
    });

    it('only removes the task with the matching id', () => {
      let state = tasksReducer(initialState, addTask(sampleTask));
      state = tasksReducer(state, addTask({ ...sampleTask, id: '1002', title: 'Keep Me' }));
      state = tasksReducer(state, deleteTask('1001'));
      expect(state.taskList).toHaveLength(1);
      expect(state.taskList[0].id).toBe('1002');
    });

    it('does nothing when id does not exist', () => {
      let state = tasksReducer(initialState, addTask(sampleTask));
      state = tasksReducer(state, deleteTask('9999'));
      expect(state.taskList).toHaveLength(1);
    });
  });

  describe('toggleTask', () => {
    it('marks an incomplete task as completed', () => {
      let state = tasksReducer(initialState, addTask(sampleTask));
      state = tasksReducer(state, toggleTask('1001'));
      expect(state.taskList[0].completed).toBe(true);
    });

    it('marks a completed task back to incomplete', () => {
      let state = tasksReducer(initialState, addTask({ ...sampleTask, completed: true }));
      state = tasksReducer(state, toggleTask('1001'));
      expect(state.taskList[0].completed).toBe(false);
    });

    it('only toggles the matching task', () => {
      let state = tasksReducer(initialState, addTask(sampleTask));
      state = tasksReducer(state, addTask({ ...sampleTask, id: '1002', title: 'Other Task' }));
      state = tasksReducer(state, toggleTask('1001'));
      expect(state.taskList[0].completed).toBe(true);
      expect(state.taskList[1].completed).toBe(false);
    });
  });

  describe('updateTask', () => {
    it('updates the task fields', () => {
      let state = tasksReducer(initialState, addTask(sampleTask));
      const updatedTask = { ...sampleTask, title: 'Updated Title', notes: 'New notes' };
      state = tasksReducer(state, updateTask(updatedTask));
      expect(state.taskList[0].title).toBe('Updated Title');
      expect(state.taskList[0].notes).toBe('New notes');
    });

    it('does not add a new task if id does not match', () => {
      let state = tasksReducer(initialState, addTask(sampleTask));
      state = tasksReducer(state, updateTask({ ...sampleTask, id: '9999' }));
      expect(state.taskList).toHaveLength(1);
    });
  });

  describe('setMotivationalQuote', () => {
    it('sets the motivational quote', () => {
      const quote = 'Study hard and succeed!';
      const state = tasksReducer(initialState, setMotivationalQuote(quote));
      expect(state.motivationalQuote).toBe(quote);
    });

    it('replaces a previous quote', () => {
      let state = tasksReducer(initialState, setMotivationalQuote('Old quote'));
      state = tasksReducer(state, setMotivationalQuote('New quote'));
      expect(state.motivationalQuote).toBe('New quote');
    });

    it('can be cleared with an empty string', () => {
      let state = tasksReducer(initialState, setMotivationalQuote('Some quote'));
      state = tasksReducer(state, setMotivationalQuote(''));
      expect(state.motivationalQuote).toBe('');
    });
  });
});
