import React from 'react'
import { ScrollView, Platform, Dimensions } from 'react-native'

import util from './util'

import { StyleContextProvider, useStyleContext } from './context/snow-style-context'
import { FocusContextProvider } from './context/snow-focus-context'
import { NavigationContextProvider } from './context/snow-navigation-context'
import { LayerContextProvider } from './context/snow-layer-context'
import { SnowContextProvider } from './context/snow-context'

import { SnowSafeArea } from './component/snow-safe-area'

export function SnowApp(props) {
    const scrollViewRef = React.useRef(null)

    return (
        <StyleContextProvider
            style={util.blankStyle}
            snowStyle={props.snowStyle}
            snowConfig={props.snowConfig} >

            <FocusContextProvider
                style={util.blankStyle}
                scrollViewRef={scrollViewRef}
                DEBUG_FOCUS={props?.DEBUG_FOCUS ?? props?.DEBUG_SNOW} >

                <NavigationContextProvider
                    routePaths={props.routePaths}
                    routePages={props.routePages}
                    initialRoutePath={props.initialRoutePath}
                    resetRoutePath={props.resetRoutePath}
                    style={util.blankStyle}
                    DEBUG_NAVIGATION={props?.DEBUG_NAVIGATION ?? props?.DEBUG_SNOW} >

                    <LayerContextProvider
                        style={util.blankStyle}
                        DEBUG_LAYERS={props?.DEBUG_LAYERS ?? props?.DEBUG_SNOW}>

                        <SnowContextProvider style={util.blankStyle}>
                            <SnowSafeArea style={util.blankStyle} >
                                {props.children}
                            </SnowSafeArea>
                        </SnowContextProvider>

                    </LayerContextProvider>
                </NavigationContextProvider>
            </FocusContextProvider>
        </StyleContextProvider>
    )
}

export default SnowApp