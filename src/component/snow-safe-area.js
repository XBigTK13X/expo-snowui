import { ScrollView, View } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'
import { useLayerContext } from '../context/snow-layer-context'
import util from '../util'

export function SnowSafeArea(props) {
    const { SnowStyle } = useStyleContext(props)
    const { currentModal, currentOverlay } = useLayerContext()
    return (
        <View style={util.blankStyle}>
            <ScrollView
                showsVerticalScrollIndicator={!currentModal}
                snowStyle={SnowStyle}
                style={SnowStyle.component.safeArea}>
                {props.children}
            </ScrollView>
            {currentModal}
            {currentOverlay}
        </View>
    )
}

export default SnowSafeArea