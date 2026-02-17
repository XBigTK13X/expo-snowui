// test-utils.tsx
import { render } from '@testing-library/react-native';
import { createSnowApp } from '../snow-app';

const SnowApp = createSnowApp({
    sentryUrl: null,
    appName: 'snowui-test',
    appversion: '1.0.0'
})

const styleOverrides = {
    color: {
        hover: 'rgba(44, 219, 175, 1)',
        hoverDark: 'rgba(23, 116, 92, 1)',
        core: 'rgba(91, 34, 184, 1)',
        coreDark: 'rgba(62, 32, 110, 1)',
    }
}


const TestPage = (props: any) => {
    return props.children
}

const routes = {
    testPage: '/test/page'
}

const pages = {
    [routes.testPage]: TestPage
}

const TestApp = (props) => {
    return (
        <SnowApp
            DEBUG_SNOW={false}
            ENABLE_FOCUS={true}
            snowStyle={styleOverrides}
            routePaths={routes}
            routePages={pages}
            initialRoutePath={routes.testPage}
        >
            <TestPage children={props.children} />
        </SnowApp>
    )
}

const customRender = (ui, options) =>
    render(ui, { wrapper: TestApp, ...options });

export * from '@testing-library/react-native';

export { customRender as render };