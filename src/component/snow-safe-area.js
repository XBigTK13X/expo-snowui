import { View } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'
import { useInteractionLayerContext } from '../context/snow-interaction-layer-context'

export function SnowSafeArea(props) {
    const { SnowStyle } = useStyleContext(props)
    const { currentModal, currentOverlay } = useInteractionLayerContext()
    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <View snowStyle={SnowStyle} style={SnowStyle.component.safeArea}>
                {props.children}
            </View>
            {currentModal}
            {currentOverlay}
        </View>
    )
}

export default SnowSafeArea