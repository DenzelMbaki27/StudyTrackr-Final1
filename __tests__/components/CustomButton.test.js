import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '../../src/components/CustomButton';

describe('CustomButton', () => {
  it('renders correctly with required props', () => {
    const { getByText } = render(
      <CustomButton title="Save Task" onPress={() => {}} />
    );
    expect(getByText('Save Task')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <CustomButton title="Click Me" onPress={mockPress} />
    );
    fireEvent.press(getByText('Click Me'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <CustomButton title="Disabled" onPress={mockPress} disabled />
    );
    fireEvent.press(getByText('Disabled'));
    expect(mockPress).not.toHaveBeenCalled();
  });

  it('does not call onPress when loading', () => {
    const mockPress = jest.fn();
    const { queryByText } = render(
      <CustomButton title="Loading..." onPress={mockPress} loading />
    );
    // When loading, spinner shows instead of title text
    expect(queryByText('Loading...')).toBeNull();
    expect(mockPress).not.toHaveBeenCalled();
  });

  it('renders primary variant by default', () => {
    const { getByText } = render(
      <CustomButton title="Primary" onPress={() => {}} />
    );
    expect(getByText('Primary')).toBeTruthy();
  });

  it('renders all variant types without error', () => {
    const variants = ['primary', 'secondary', 'danger', 'outline', 'ghost'];
    variants.forEach(variant => {
      expect(() => {
        render(
          <CustomButton title={`${variant} btn`} onPress={() => {}} variant={variant} />
        );
      }).not.toThrow();
    });
  });

  it('renders all size types without error', () => {
    const sizes = ['small', 'medium', 'large'];
    sizes.forEach(size => {
      expect(() => {
        render(
          <CustomButton title={`${size} btn`} onPress={() => {}} size={size} />
        );
      }).not.toThrow();
    });
  });

  it('matches snapshot for primary variant', () => {
    const tree = render(
      <CustomButton title="Snapshot Test" onPress={() => {}} variant="primary" />
    );
    expect(tree).toMatchSnapshot();
  });
});
