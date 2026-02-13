import React from 'react';
import renderer from 'react-test-renderer';

import App from '../App';

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
    const React = require('react');
    const { View } = require('react-native'); // Use View to ensure non-null return
    return {
      SafeAreaProvider: ({ children }) => <View>{children}</View>,
      SafeAreaConsumer: ({ children }) => children({ top: 0, right: 0, bottom: 0, left: 0 }),
      useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
      useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
    };
});

jest.mock('../src/navigation/AppNavigator', () => {
    const React = require('react');
    const { View } = require('react-native');
    return () => <View testID="AppNavigator" />;
});

// Mock react-native-paper
jest.mock('react-native-paper', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        Provider: ({ children }) => <View>{children}</View>,
        DefaultTheme: {},
    };
});

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(() => Promise.resolve(null)),
    setItemAsync: jest.fn(() => Promise.resolve()),
    deleteItemAsync: jest.fn(() => Promise.resolve()),
}));
  
// Mock AuthService
jest.mock('../src/services/auth.service', () => ({
    login: jest.fn(),
    logout: jest.fn(),
}));
  
describe('<App />', () => {
  it('renders correctly', async () => {
    let tree;
    await renderer.act(async () => {
      tree = renderer.create(<App />);
    });
    const json = tree.toJSON();
    expect(json).toBeTruthy();
    expect(json.children.length).toBe(1);
  });
});
