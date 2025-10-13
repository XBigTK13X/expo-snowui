import React from 'react'
import { ScrollView, View } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'
import { useFocusContext } from '../context/snow-focus-context'
import { useLayerContext } from '../context/snow-layer-context'
import util from '../util'
import { SnowModal } from './wired/snow-modal'

export function SnowSafeArea(props) {
    const { SnowStyle } = useStyleContext(props)
    const { modalPayload, overlayPayload } = useLayerContext()
    const { setScrollViewRef } = useFocusContext()
    const scrollViewRef = React.useRef(null)

    let modal = null
    if (modalPayload) {
        modal = <SnowModal {...modalPayload.props} renderer={modalPayload.renderer} />
    }

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
                showsVerticalScrollIndicator={!modalPayload}
            >
                {props.children}
            </ScrollView>
            {modal}
            {overlayPayload?.()}
        </View>
    )
}

export default SnowSafeArea