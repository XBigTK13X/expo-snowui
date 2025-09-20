import { Platform, View } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'

function AppView(props) {
    return (
        <View style={props.snowStyle.component.safeArea}>
            {props.children}
        </View>
    )
}

function TvFocusView(props) {
    return (
        <TVFocusGuideView
            style={props.snowStyle.component.safeArea}>
            {props.children}
        </TVFocusGuideView>
    )
}

export function SnowSafeArea(props) {
    const { SnowStyle } = useStyleContext(props)
    const allowFocusing = Platform.isTV
    if (allowFocusing) {
        return <TvFocusView snowStyle={SnowStyle} {...props} />
    }
    return <AppView snowStyle={SnowStyle} {...props} />
}

export default SnowSafeArea