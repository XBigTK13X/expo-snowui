import { ScrollView } from 'react-native'
import { StyleContextProvider, useStyleContext } from './context/snow-style-context'
import { FocusContextProvider } from './context/snow-focus-context'

function SnowWrapper(props) {
    const { SnowStyle } = useStyleContext(props)
    return (
        <ScrollView style={SnowStyle.page}>
            {props.children}
        </ScrollView>
    )
}

export function SnowApp(props) {
    return (
        <StyleContextProvider snowStyle={props.snowStyle} snowConfig={props.snowConfig}>
            <FocusContextProvider>
                <SnowWrapper children={props.children} />
            </FocusContextProvider>
        </StyleContextProvider>
    )
}

export default SnowApp