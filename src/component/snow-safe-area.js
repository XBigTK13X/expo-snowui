import React from 'react'
import { ScrollView, View } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'
import { useFocusAppContext } from '../context/snow-focus-context'
import { useLayerContext } from '../context/snow-layer-context'
import util from '../util'
import { SnowView } from './wired/snow-view'
import { SnowModal } from './wired/snow-modal'
import { SnowOverlay } from './wired/snow-overlay'

export function SnowSafeArea(props) {
    const { SnowStyle } = useStyleContext(props)
    const { modalPayloads, overlayPayload, DEBUG_LAYERS } = useLayerContext()
    const { setScrollViewRef, setScrollOffset, setScrollViewHeight } = useFocusAppContext()
    const scrollViewRef = React.useRef(null)

    // This allows modals and overlays to draw on top of the regular app
    // Enabling things like fullscreen video
    // It requires a rendering function instead of computed JSX
    // Otherwise controlled forms inside a modal would not update their state
    let modals = null
    if (modalPayloads?.length) {
        modals = (
            <>
                {modalPayloads.map((modalPayload, modalIndex) => {
                    return <SnowModal
                        key={modalIndex}
                        depth={modalIndex + 1}
                        {...modalPayload.props}
                        render={modalPayload.render} />
                })}
            </>
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

    if (DEBUG_LAYERS === 'verbose') {
        util.prettyLog({ component: 'safe-area', action: 'render', modalPayloads, overlayPayload })
    }

    return (
        <>
            <ScrollView
                ref={(ref) => {
                    if (ref) {
                        scrollViewRef.current = ref;
                        setScrollViewRef(ref);
                    }
                }}
                onLayout={(e) => {
                    setScrollViewHeight(e.nativeEvent.layout.height);
                }}
                onScroll={(event) => {
                    setScrollOffset(event.nativeEvent.contentOffset.y);
                }}
                scrollEventThrottle={16}
                style={SnowStyle.component.safeArea}
                snowStyle={SnowStyle}
                showsVerticalScrollIndicator={!modals} >
                {props.children}
            </ScrollView>
            {modals}
            {overlay}
        </>
    )
}

export default SnowSafeArea