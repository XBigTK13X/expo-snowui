import React from 'react';

jest.mock('@sentry/react-native', () => {
    return {
        init: jest.fn(),
        captureException: jest.fn(),
        setUser: jest.fn(),
        setTag: jest.fn(),
        // Sentry.wrap is a Higher Order Component.
        // It should return the component it wraps.
        wrap: (Component) => Component,
        // Sentry.ErrorBoundary is a component.
        // It should render its children.
        ErrorBoundary: ({ children }) => children,
    };
});

// Mock expo-navigation-bar to prevent it from crashing in Node
jest.mock('expo-navigation-bar', () => ({
    setVisibilityAsync: jest.fn(),
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
    manifest: {
        android: { versionCode: 1 }
    },
}));