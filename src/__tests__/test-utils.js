import { render, waitFor } from '@testing-library/react-native';
import { createSnowApp } from '../snow-app';
import SnowStyle from '../snow-style';
import { useFocusContext } from '../context/snow-focus-context';

const SnowApp = createSnowApp({
    sentryUrl: null,
    appName: 'snowui-test',
    appversion: '1.0.0'
});

const styleOverrides = {
    color: {
        hover: 'rgba(44, 219, 175, 1)',
        hoverDark: 'rgba(23, 116, 92, 1)',
        core: 'rgba(91, 34, 184, 1)',
        coreDark: 'rgba(62, 32, 110, 1)',
    }
};

export const AppStyle = SnowStyle.createStyle(styleOverrides);

let capturedFocusMethods = null;

const FocusSpy = () => {
    capturedFocusMethods = useFocusContext();
    return null;
};

export const getFocusEngine = () => {
    if (!capturedFocusMethods) {
        throw new Error("Focus Engine not initialized. Ensure you have called 'await findByTestId' to allow the provider to mount.");
    }
    return capturedFocusMethods;
};

const TestPage = (props) => {
    return props.children;
};

const routes = {
    testPage: '/test/page'
};

const pages = {
    [routes.testPage]: TestPage
};

const TestApp = (props) => {
    return (
        <SnowApp
            DEBUG_SNOW={false}
            DEBUG_FOCUS={false}
            ENABLE_FOCUS={true}
            snowStyle={styleOverrides}
            routePaths={routes}
            routePages={pages}
            initialRoutePath={routes.testPage}
        >
            <FocusSpy />
            {props.children}
        </SnowApp>
    );
};

const customRender = (ui, options) =>
    render(ui, { wrapper: TestApp, ...options });

if (typeof afterEach === 'function') {
    afterEach(() => {
        capturedFocusMethods = null;
    });
}


export * from '@testing-library/react-native';
export { customRender as render };