import React from 'react'
import { ScrollView, View } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'
import { useFocusContext } from '../context/snow-focus-context'
import { useLayerContext } from '../context/snow-layer-context'
import util from '../util'
import { SnowModal } from './wired/snow-modal'
import { SnowOverlay } from './wired/snow-overlay'

export function SnowSafeArea(props) {
    const { SnowStyle } = useStyleContext(props)
    const { modalPayloads, overlayPayload, DEBUG_LAYERS } = useLayerContext()
    const { setScrollViewRef } = useFocusContext()
    const scrollViewRef = React.useRef(null)

    // This allows modals and overlays to draw on top of the regular app
    // Enabling things like fullscreen video
    // It requires a rendering function instead of computed JSX
    // Otherwise controlled forms inside a modal would not update their state
    let modals = null
    console.log({ modalPayloads })
    if (modalPayloads?.length) {
        modals = (
            <View style={{ flex: 1, position: 'absolute', right: 0, left: 0, top: 0, bottom: 0 }}>
                {modalPayloads.map((modalPayload, modalIndex) => {
                    return <SnowModal key={modalIndex} {...modalPayload.props} render={modalPayload.render} />
                })}
            </View>
        )
    }

    let overlay = null
    if (overlayPayload) {
        overlay = <SnowOverlay {...overlayPayload.props} />
    }

    React.useEffect(() => {
        if (scrollViewRef.current) {
            setScrollViewRef(scrollViewRef)
        }
    }, [scrollViewRef])

    if (DEBUG_LAYERS) {
        util.prettyLog({ component: 'safe-area', action: 'render', modalPayloads, overlayPayload })
    }

    return (
        <View style={util.blankStyle}>
            <ScrollView
                ref={scrollViewRef}
                style={SnowStyle.component.safeArea}
                snowStyle={SnowStyle}
                showsVerticalScrollIndicator={!modals} >
                {props.children}
            </ScrollView>
            {modals}
            {overlay}
        </View>
    )
}

export default SnowSafeArea