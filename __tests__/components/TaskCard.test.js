import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskCard from '../../src/components/TaskCard';

const sampleTask = {
  id: '42',
  title: 'Finish Lab Report',
  subject: 'Chemistry',
  dueDate: 'Dec 5, 2025',
  priority: 'High',
  notes: '',
  completed: false,
};

describe('TaskCard', () => {
  const noop = () => {};

  it('renders without crashing', () => {
    expect(() => {
      render(
        <TaskCard
          task={sampleTask}
          index={0}
          onToggle={noop}
          onDelete={noop}
          onPress={noop}
        />
      );
    }).not.toThrow();
  });

  it('displays the task title', () => {
    const { getByText } = render(
      <TaskCard task={sampleTask} index={0} onToggle={noop} onDelete={noop} onPress={noop} />
    );
    expect(getByText('Finish Lab Report')).toBeTruthy();
  });

  it('displays the subject', () => {
    const { getByText } = render(
      <TaskCard task={sampleTask} index={0} onToggle={noop} onDelete={noop} onPress={noop} />
    );
    expect(getByText('Chemistry')).toBeTruthy();
  });

  it('displays the due date', () => {
    const { getByText } = render(
      <TaskCard task={sampleTask} index={0} onToggle={noop} onDelete={noop} onPress={noop} />
    );
    expect(getByText(/ Dec 5, 2025/)).toBeTruthy();
  });

  it('displays the priority badge', () => {
    const { getByText } = render(
      <TaskCard task={sampleTask} index={0} onToggle={noop} onDelete={noop} onPress={noop} />
    );
    expect(getByText('High')).toBeTruthy();
  });

  it('calls onToggle when checkbox is pressed', () => {
    const mockToggle = jest.fn();
    const { getAllByRole } = render(
      <TaskCard task={sampleTask} index={0} onToggle={mockToggle} onDelete={noop} onPress={noop} />
    );
    const buttons = getAllByRole('button');
    // Checkbox is the first interactive button inside the card
    fireEvent.press(buttons[1]);
    expect(mockToggle).toHaveBeenCalledWith('42');
  });

  it('calls onPress when the card is pressed', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <TaskCard task={sampleTask} index={0} onToggle={noop} onDelete={noop} onPress={mockPress} />
    );
    fireEvent.press(getByText('Finish Lab Report'));
    expect(mockPress).toHaveBeenCalledWith(sampleTask);
  });

  it('renders a completed task with different style indicator', () => {
    const completedTask = { ...sampleTask, completed: true };
    const { getByText } = render(
      <TaskCard task={completedTask} index={0} onToggle={noop} onDelete={noop} onPress={noop} />
    );
    const title = getByText('Finish Lab Report');
    expect(title.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ textDecorationLine: 'line-through' }),
      ])
    );
  });

  it('does not crash with missing optional fields', () => {
    const minimalTask = { id: '99', title: 'Minimal Task', completed: false };
    expect(() => {
      render(
        <TaskCard task={minimalTask} index={0} onToggle={noop} onDelete={noop} onPress={noop} />
      );
    }).not.toThrow();
  });

  it('renders correctly at different list indices (stagger)', () => {
    [0, 1, 5, 10].forEach(idx => {
      expect(() => {
        render(
          <TaskCard task={sampleTask} index={idx} onToggle={noop} onDelete={noop} onPress={noop} />
        );
      }).not.toThrow();
    });
  });

  it('matches snapshot', () => {
    const tree = render(
      <TaskCard task={sampleTask} index={0} onToggle={noop} onDelete={noop} onPress={noop} />
    );
    expect(tree).toMatchSnapshot();
  });
});
