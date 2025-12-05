import React from 'react'
import { Platform } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';

import { InputContextProvider } from './context/snow-input-context'
import { StyleContextProvider } from './context/snow-style-context'
import { FocusContextProvider } from './context/snow-focus-context'
import { NavigationContextProvider } from './context/snow-navigation-context'
import { LayerContextProvider } from './context/snow-layer-context'
import { SnowContextProvider } from './context/snow-context'

import { SnowSafeArea } from './component/snow-safe-area'

export function SnowApp(props) {
    if (Platform.OS !== 'web' && !Platform.isTV) {
        // Hide the system UI on app load
        React.useEffect(() => {
            const enableImmersive = async () => {
                try {
                    await NavigationBar.setVisibilityAsync('hidden');
                } catch { }
            };

            enableImmersive();
        }, []);

        // Hide the system UI after a user returns to the app
        React.useEffect(() => {
            NavigationBar.setVisibilityAsync('hidden');
        });
    }

    return (<>
        <StatusBar hidden />
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



                            <SnowContextProvider >
                                <SnowSafeArea >
                                    {props.children}
                                </SnowSafeArea>
                            </SnowContextProvider>


                        </NavigationContextProvider>
                    </FocusContextProvider>
                </LayerContextProvider>
            </InputContextProvider>
        </StyleContextProvider >
    </>
    )
}

export default SnowApp