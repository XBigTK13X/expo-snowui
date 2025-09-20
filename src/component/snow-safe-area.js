import { Platform, View } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'

function AppView(props) {
    return (
        <View style={props.style.component.safeArea}>
            {props.children}
        </View>
    )
}

function TvFocusView(props) {
    return (
        <TVFocusGuideView
            style={props.style.component.safeArea}>
            {props.children}
        </TVFocusGuideView>
    )
}

export function SnowSafeArea(props) {
    const { SnowStyle } = useStyleContext(props)
    const allowFocusing = Platform.isTV
    if (allowFocusing) {
        return <TvFocusView style={SnowStyle} {...props} />
    }
    return <AppView style={SnowStyle} {...props} />
}

export default SnowSafeArea