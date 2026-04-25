import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../../src/store/tasksSlice';
import HomeScreen from '../../src/screens/HomeScreen';
import AddTaskScreen from '../../src/screens/AddTaskScreen';
import TaskDetailsScreen from '../../src/screens/TaskDetailsScreen';
import ProgressScreen from '../../src/screens/ProgressScreen';
import SettingsScreen from '../../src/screens/SettingsScreen';

const Stack = createStackNavigator();

// Helper: create a fresh Redux store for each test
const makeStore = (preloadedState = {}) =>
  configureStore({
    reducer: { tasks: tasksReducer },
    preloadedState,
  });

// Helper: wrap component with navigation + redux
const renderWithProviders = (component, store = makeStore()) =>
  render(
    <Provider store={store}>
      <NavigationContainer>{component}</NavigationContainer>
    </Provider>
  );

// Helper: render the full navigation stack
const renderStack = (initialRouteName = 'Home', store = makeStore()) =>
  render(
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRouteName}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddTask" component={AddTaskScreen} />
          <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
          <Stack.Screen name="Progress" component={ProgressScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );

describe('Navigation', () => {
  describe('HomeScreen', () => {
    it('renders without crashing', () => {
      expect(() => renderStack('Home')).not.toThrow();
    });

    it('shows the header title', () => {
      const { getByText } = renderStack('Home');
      expect(getByText('My Study Tasks')).toBeTruthy();
    });

    it('shows empty state when no tasks exist', () => {
      const { getByText } = renderStack('Home');
      expect(getByText('No tasks yet')).toBeTruthy();
    });

    it('shows task cards when tasks exist in the store', () => {
      const store = makeStore({
        tasks: {
          taskList: [
            {
              id: '1',
              title: 'Study Redux',
              subject: 'CPAN 213',
              dueDate: '',
              priority: 'High',
              notes: '',
              completed: false,
              createdAt: new Date().toISOString(),
            },
          ],
          motivationalQuote: '',
        },
      });
      const { getByText } = renderStack('Home', store);
      expect(getByText('Study Redux')).toBeTruthy();
    });

    it('shows motivational quote banner when quote is set', () => {
      const store = makeStore({
        tasks: {
          taskList: [],
          motivationalQuote: 'Work hard and stay focused!',
        },
      });
      const { getByText } = renderStack('Home', store);
      expect(getByText('Work hard and stay focused!')).toBeTruthy();
    });
  });

  describe('AddTaskScreen', () => {
    it('renders without crashing', () => {
      expect(() => renderStack('AddTask')).not.toThrow();
    });

    it('shows the title input field', () => {
      const { getByPlaceholderText } = renderStack('AddTask');
      expect(getByPlaceholderText('e.g. Read Chapter 5')).toBeTruthy();
    });

    it('shows the subject input field', () => {
      const { getByPlaceholderText } = renderStack('AddTask');
      expect(getByPlaceholderText('e.g. Mathematics')).toBeTruthy();
    });

    it('shows Save Task and Cancel buttons', () => {
      const { getByText } = renderStack('AddTask');
      expect(getByText('Save Task')).toBeTruthy();
      expect(getByText('Cancel')).toBeTruthy();
    });

    it('shows validation alert when title is empty on save', async () => {
      const { getByText } = renderStack('AddTask');
      fireEvent.press(getByText('Save Task'));
      await waitFor(() => {
        expect(getByText('Missing Title')).toBeTruthy();
      });
    });

    it('allows typing in the title field', () => {
      const { getByPlaceholderText } = renderStack('AddTask');
      const input = getByPlaceholderText('e.g. Read Chapter 5');
      fireEvent.changeText(input, 'Complete Assignment 3');
      expect(input.props.value).toBe('Complete Assignment 3');
    });
  });

  describe('ProgressScreen', () => {
    it('renders without crashing', () => {
      expect(() => renderStack('Progress')).not.toThrow();
    });

    it('shows stat cards for Total, Done, and Pending', () => {
      const { getByText } = renderStack('Progress');
      expect(getByText('Total')).toBeTruthy();
      expect(getByText('Done')).toBeTruthy();
      expect(getByText('Pending')).toBeTruthy();
    });

    it('shows correct counts from store', () => {
      const store = makeStore({
        tasks: {
          taskList: [
            { id: '1', title: 'Task A', completed: true, priority: 'High' },
            { id: '2', title: 'Task B', completed: false, priority: 'Low' },
            { id: '3', title: 'Task C', completed: false, priority: 'Medium' },
          ],
          motivationalQuote: '',
        },
      });
      const { getByText } = renderStack('Progress', store);
      // Total = 3, Done = 1, Pending = 2
      expect(getByText('3')).toBeTruthy();
      expect(getByText('1')).toBeTruthy();
      expect(getByText('2')).toBeTruthy();
    });

    it('shows celebration message when all tasks are complete', () => {
      const store = makeStore({
        tasks: {
          taskList: [
            { id: '1', title: 'Done Task', completed: true, priority: 'Low' },
          ],
          motivationalQuote: '',
        },
      });
      const { getByText } = renderStack('Progress', store);
      expect(getByText('All tasks completed! Great work!')).toBeTruthy();
    });
  });

  describe('SettingsScreen', () => {
    it('renders without crashing', () => {
      expect(() => renderStack('Settings')).not.toThrow();
    });

    it('shows app name and version', () => {
      const { getByText } = renderStack('Settings');
      expect(getByText('StudyTrackr')).toBeTruthy();
      expect(getByText('Version 1.0.0')).toBeTruthy();
    });

    it('shows Preferences section', () => {
      const { getByText } = renderStack('Settings');
      expect(getByText('Preferences')).toBeTruthy();
    });

    it('shows Refresh Study Tip button', () => {
      const { getByText } = renderStack('Settings');
      expect(getByText('Refresh Study Tip')).toBeTruthy();
    });

    it('dispatches a motivational quote when Refresh Study Tip is pressed', async () => {
      const store = makeStore();
      const { getByText } = renderStack('Settings', store);
      fireEvent.press(getByText('Refresh Study Tip'));
      await waitFor(() => {
        const state = store.getState();
        expect(state.tasks.motivationalQuote.length).toBeGreaterThan(0);
      });
    });
  });

  describe('TaskDetailsScreen', () => {
    const taskRoute = {
      params: {
        task: {
          id: '10',
          title: 'Review Lecture Notes',
          subject: 'Physics',
          dueDate: 'Nov 30, 2025',
          priority: 'Medium',
          notes: 'Chapters 4 and 5',
          completed: false,
          createdAt: new Date().toISOString(),
        },
      },
    };

    it('renders without crashing', () => {
      expect(() => {
        renderWithProviders(
          <Stack.Navigator>
            <Stack.Screen
              name="TaskDetails"
              component={TaskDetailsScreen}
              initialParams={taskRoute.params}
            />
          </Stack.Navigator>
        );
      }).not.toThrow();
    });

    it('shows the task title', () => {
      const { getByText } = renderWithProviders(
        <Stack.Navigator>
          <Stack.Screen
            name="TaskDetails"
            component={TaskDetailsScreen}
            initialParams={taskRoute.params}
          />
        </Stack.Navigator>
      );
      expect(getByText('Review Lecture Notes')).toBeTruthy();
    });

    it('shows the subject', () => {
      const { getByText } = renderWithProviders(
        <Stack.Navigator>
          <Stack.Screen
            name="TaskDetails"
            component={TaskDetailsScreen}
            initialParams={taskRoute.params}
          />
        </Stack.Navigator>
      );
      expect(getByText('Physics')).toBeTruthy();
    });

    it('shows the due date', () => {
      const { getByText } = renderWithProviders(
        <Stack.Navigator>
          <Stack.Screen
            name="TaskDetails"
            component={TaskDetailsScreen}
            initialParams={taskRoute.params}
          />
        </Stack.Navigator>
      );
      expect(getByText('Nov 30, 2025')).toBeTruthy();
    });

    it('shows Delete Task and Back to Home buttons', () => {
      const { getByText } = renderWithProviders(
        <Stack.Navigator>
          <Stack.Screen
            name="TaskDetails"
            component={TaskDetailsScreen}
            initialParams={taskRoute.params}
          />
        </Stack.Navigator>
      );
      expect(getByText('Delete Task')).toBeTruthy();
      expect(getByText('Back to Home')).toBeTruthy();
    });
  });
});
