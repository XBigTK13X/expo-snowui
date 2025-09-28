import { View, TVFocusGuideView } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'

export function SnowSafeArea(props) {
    const { SnowStyle } = useStyleContext(props)
    return (
        <View snowStyle={SnowStyle} style={SnowStyle.component.safeArea}>
            {props.children}
        </View>
    )
}

export default SnowSafeArea