import React from 'react'
import { ScrollView, Platform, Dimensions } from 'react-native'

import { FocusContextProvider } from './context/snow-focus-context'
import { NavigationContextProvider } from './context/snow-navigation-context'
import { StyleContextProvider, useStyleContext } from './context/snow-style-context'
import { SnowContextProvider } from './context/snow-context'

import { SnowSafeArea } from './component/snow-safe-area'

const styles = {
    fill: {
        flex: 1,
        backgroundColor: 'black'
    },
    fillWithGap: {
        flex: 1,
        backgroundColor: 'black',
        marginBottom: 50
    }
}

export function SnowApp(props) {
    const scrollViewRef = React.useRef(null)
    let rootInnerStyle = []

    // Otherwise on web, sometimes the full viewport isn't used
    if (Platform.OS === 'web') {
        rootInnerStyle.push({
            height: Dimensions.get('window').height,
            backgroundColor: 'black'
        })
    }
    return (
        <ScrollView
            ref={scrollViewRef}
            style={styles.fill}
            contentContainerStyle={rootInnerStyle} >

            <StyleContextProvider
                style={styles.fill}
                snowStyle={props.snowStyle}
                snowConfig={props.snowConfig} >

                <FocusContextProvider
                    style={styles.fill}
                    scrollViewRef={scrollViewRef}
                    DEBUG_FOCUS={props.DEBUG_FOCUS} >

                    <NavigationContextProvider
                        routePaths={props.routePaths}
                        routePages={props.routePages}
                        initialRoutePath={props.initialRoutePath}
                        resetRoutePath={props.resetRoutePath}
                        style={styles.fill}
                        DEBUG_NAVIGATION={props.DEBUG_NAVIGATION} >

                        <SnowContextProvider
                            style={styles.fill} >
                            <SnowSafeArea style={styles.fillWithGap} >
                                {props.children}
                            </SnowSafeArea>
                        </SnowContextProvider>

                    </NavigationContextProvider>
                </FocusContextProvider>
            </StyleContextProvider>
        </ScrollView>
    )
}

export default SnowApp