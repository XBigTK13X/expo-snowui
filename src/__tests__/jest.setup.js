import * as RN from 'react-native';

Object.defineProperty(RN.Platform, 'OS', {
    get: () => 'web',
    configurable: true
});

Object.defineProperty(RN.Platform, 'isTV', {
    get: () => false,
    configurable: true
});

process.env.EXPO_OS = 'web';

global.requestAnimationFrame = (callback) => {
    callback();
};

const mockDOMMethods = {
    getBoundingClientRect: {
        configurable: true,
        writable: true,
        value: () => ({
            top: 0,
            left: 0,
            width: 100,
            height: 100,
            bottom: 100,
            right: 100,
            x: 0,
            y: 0,
        }),
    },
    scrollTo: {
        configurable: true,
        writable: true,
        value: jest.fn(),
    }
};

Object.defineProperties(Object.prototype, mockDOMMethods);

jest.mock('@sentry/react-native', () => {
    return {
        init: jest.fn(),
        captureException: jest.fn(),
        setUser: jest.fn(),
        setTag: jest.fn(),
        wrap: (Component) => Component,
        ErrorBoundary: ({ children }) => children,
    };
});

jest.mock('expo-navigation-bar', () => ({
    setVisibilityAsync: jest.fn(),
}));

jest.mock('expo-constants', () => ({
    manifest: {
        android: { versionCode: 1 }
    },
}));