import React from 'react'
import { View, ScrollView, Platform, Dimensions } from 'react-native'
import { StyleContextProvider, useStyleContext } from './context/snow-style-context'
import { FocusContextProvider } from './context/snow-focus-context'

export function SnowApp(props) {
    const { SnowStyle } = useStyleContext(props)
    const scrollViewRef = React.useRef(null)
    let rootInnerStyle = []
    if (Platform.OS === 'web') {
        rootInnerStyle.push({
            height: Dimensions.get('window').height,
            backgroundColor: 'black'
        })
    }
    return (
        <ScrollView ref={scrollViewRef} style={{ flex: 1, backgroundColor: 'black' }} contentContainerStyle={rootInnerStyle}>
            <StyleContextProvider snowStyle={props.snowStyle} snowConfig={props.snowConfig}>
                <FocusContextProvider scrollViewRef={scrollViewRef} DEBUG_FOCUS={props.DEBUG_FOCUS}>
                    <View style={{ flex: 1, marginBottom: 50 }}>
                        {props.children}
                    </View>
                </FocusContextProvider>
            </StyleContextProvider>
        </ScrollView>
    )
}

export default SnowApp