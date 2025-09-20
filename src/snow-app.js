import { View, ScrollView, Platform } from 'react-native'
import { StyleContextProvider, useStyleContext } from './context/snow-style-context'
import { FocusContextProvider } from './context/snow-focus-context'

const fill = { flex: 1 }

export function SnowApp(props) {
    const { SnowStyle } = useStyleContext(props)
    let rootInnerStyle = []
    if (Platform.OS === 'web') {
        rootInnerStyle.push(fill)
    }
    return (
        <ScrollView style={fill} contentContainerStyle={rootInnerStyle}>
            <StyleContextProvider snowStyle={props.snowStyle} snowConfig={props.snowConfig}>
                <FocusContextProvider>
                    <View style={{ flex: 1, marginBottom: 50 }}>
                        {props.children}
                    </View>
                </FocusContextProvider>
            </StyleContextProvider>
        </ScrollView>
    )
}

export default SnowApp