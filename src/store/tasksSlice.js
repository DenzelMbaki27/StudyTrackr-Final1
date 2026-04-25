import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    taskList: [],
    motivationalQuote: '',
  },
  reducers: {
    addTask: (state, action) => {
      state.taskList.push(action.payload);
    },
    deleteTask: (state, action) => {
      state.taskList = state.taskList.filter(task => task.id !== action.payload);
    },
    toggleTask: (state, action) => {
      const task = state.taskList.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    updateTask: (state, action) => {
      const index = state.taskList.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.taskList[index] = action.payload;
      }
    },
    setMotivationalQuote: (state, action) => {
      state.motivationalQuote = action.payload;
    },
  },
});

export const { addTask, deleteTask, toggleTask, updateTask, setMotivationalQuote } = tasksSlice.actions;

export default tasksSlice.reducer;
