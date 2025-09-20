import { Platform, View } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'
import { SnowFillView } from './snow-fill-view'

function AppView(props) {
    return (
        <View style={props.snowStyle.component.safeArea}>
            {props.children}
        </View>
    )
}

export function SnowSafeArea(props) {
    const { SnowStyle } = useStyleContext(props)
    const allowFocusing = Platform.isTV
    return <AppView snowStyle={SnowStyle} {...props} />
}

export default SnowSafeArea