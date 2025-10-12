import React from 'react'
import { ScrollView, View } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'
import { useFocusContext } from '../context/snow-focus-context'
import { useLayerContext } from '../context/snow-layer-context'
import util from '../util'

export function SnowSafeArea(props) {
    const { SnowStyle } = useStyleContext(props)
    const { currentModal, currentOverlay } = useLayerContext()
    const { setScrollViewRef } = useFocusContext()
    const scrollViewRef = React.useRef(null)

    React.useEffect(() => {
        if (scrollViewRef.current) {
            setScrollViewRef(scrollViewRef)
        }
    }, [scrollViewRef])

    return (
        <View style={util.blankStyle}>
            <ScrollView
                ref={scrollViewRef}
                style={SnowStyle.component.safeArea}
                snowStyle={SnowStyle}
                showsVerticalScrollIndicator={!currentModal}
            >
                {props.children}
            </ScrollView>
            {currentModal}
            {currentOverlay}
        </View>
    )
}

export default SnowSafeArea