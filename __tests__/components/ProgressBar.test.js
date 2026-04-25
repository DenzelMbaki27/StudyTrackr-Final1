import React from 'react';
import { render } from '@testing-library/react-native';
import ProgressBar from '../../src/components/ProgressBar';

describe('ProgressBar', () => {
  it('renders without crashing', () => {
    expect(() => {
      render(<ProgressBar completed={3} total={10} />);
    }).not.toThrow();
  });

  it('shows the correct percentage label', () => {
    const { getByText } = render(<ProgressBar completed={5} total={10} />);
    expect(getByText('50%')).toBeTruthy();
  });

  it('shows 0% when no tasks are completed', () => {
    const { getByText } = render(<ProgressBar completed={0} total={10} />);
    expect(getByText('0%')).toBeTruthy();
  });

  it('shows 100% when all tasks are completed', () => {
    const { getByText } = render(<ProgressBar completed={10} total={10} />);
    expect(getByText('100%')).toBeTruthy();
  });

  it('handles zero total tasks without crashing', () => {
    expect(() => {
      render(<ProgressBar completed={0} total={0} />);
    }).not.toThrow();
  });

  it('shows task count text', () => {
    const { getByText } = render(<ProgressBar completed={2} total={8} />);
    expect(getByText('2 of 8 tasks completed')).toBeTruthy();
  });

  it('does not show label when showLabel is false', () => {
    const { queryByText } = render(
      <ProgressBar completed={5} total={10} showLabel={false} />
    );
    expect(queryByText('50%')).toBeNull();
  });

  it('rounds percentage to nearest whole number', () => {
    const { getByText } = render(<ProgressBar completed={1} total={3} />);
    // 1/3 = 33.33... should round to 33%
    expect(getByText('33%')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const tree = render(<ProgressBar completed={6} total={10} />);
    expect(tree).toMatchSnapshot();
  });
});
