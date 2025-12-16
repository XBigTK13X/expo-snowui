import React from 'react'
import { Platform, StatusBar } from 'react-native'
import * as NavigationBar from 'expo-navigation-bar';

import Constants from "expo-constants";

import * as Sentry from "@sentry/react-native";

import { ToastProvider } from 'expo-toast'

import { InputContextProvider } from './context/snow-input-context'
import { StyleContextProvider } from './context/snow-style-context'
import { FocusContextProvider } from './context/snow-focus-context'
import { NavigationContextProvider } from './context/snow-navigation-context'
import { LayerContextProvider } from './context/snow-layer-context'
import { SnowContextProvider } from './context/snow-context'

import { SnowSafeArea } from './component/snow-safe-area'

function CrashScreen(props) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 60, backgroundColor: 'black', color: 'white' }}>
            <Text style={{ textAlign: 'center', fontSize: 40, margin: 20, color: 'white' }}>{props.appName ?? 'App'} crashed due to an unhandled error.</Text>
            <Text style={{ fontSize: 40, margin: 20, color: 'white' }}>The problem has been logged.</Text>
            <View style={{ width: 400, margin: 20 }}>
                <Button title="Reload" onPress={props.reloadApp} />
            </View>
        </View>
    )
}

function SnowApp(props) {
    const [appKey, setAppKey] = React.useState(1)
    const reloadApp = () => {
        setAppKey(prev => { return prev + 1 })
    }

    if (Platform.OS !== 'web' && !Platform.isTV) {
        // Hide the system UI on app load
        React.useEffect(() => {
            try {
                NavigationBar.setVisibilityAsync('hidden');
                StatusBar.setHidden(true, 'none');
            } catch { }
        }, []);
    }

    return (
        <Sentry.ErrorBoundary
            fallback={<CrashScreen reloadApp={reloadApp} appName={props.appName} />}
            onError={(error, componentStack) => {
                console.error('Unhandled error:', error)
                if (componentStack) {
                    console.error('Component stack:', componentStack)
                }
                Sentry.captureException(error)
            }}>

            <StyleContextProvider
                snowStyle={props.snowStyle}
                snowConfig={props.snowConfig} >

                <InputContextProvider
                    DEBUG_INPUT={props?.DEBUG_INPUT ?? props?.DEBUG_SNOW} >

                    <LayerContextProvider
                        DEBUG_LAYERS={props?.DEBUG_LAYERS ?? props?.DEBUG_SNOW}>

                        <FocusContextProvider
                            DEBUG_FOCUS={props?.DEBUG_FOCUS ?? props?.DEBUG_SNOW}
                            ENABLE_FOCUS={props?.ENABLE_FOCUS}
                            focusVerticalOffset={props.focusVerticalOffset}
                        >

                            <NavigationContextProvider
                                routePaths={props.routePaths}
                                routePages={props.routePages}
                                initialRoutePath={props.initialRoutePath}
                                resetRoutePath={props.resetRoutePath}
                                DEBUG_NAVIGATION={props?.DEBUG_NAVIGATION ?? props?.DEBUG_SNOW} >
                                <ToastProvider>

                                    <SnowContextProvider >

                                        <SnowSafeArea key={appKey}>
                                            {props.children}
                                        </SnowSafeArea>

                                    </SnowContextProvider>
                                </ToastProvider>
                            </NavigationContextProvider>
                        </FocusContextProvider>
                    </LayerContextProvider>
                </InputContextProvider>
            </StyleContextProvider >
        </Sentry.ErrorBoundary>
    )
}

export function createSnowApp({
    sentryUrl,
    appName,
    appVersion,
}) {
    function SnowAppConfigured(props) {
        return <SnowApp {...props} />
    }

    if (!sentryUrl) {
        return SnowAppConfigured
    }

    Sentry.init({
        dsn: sentryUrl,
        release: `${appName}@${appVersion}`,
        dist: `${Constants.manifest?.android?.versionCode ?? 1}`,
        sendDefaultPii: true,
    })

    return Sentry.wrap(SnowAppConfigured)
}


export default createSnowApp