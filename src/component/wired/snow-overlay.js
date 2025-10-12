import React from 'react'
import { TouchableOpacity } from 'react-native'
import { useStyleContext } from '../../context/snow-style-context'
import { useFocusContext } from '../../context/snow-focus-context'
import { useLayerContext } from '../../context/snow-layer-context'
import SnowText from '../snow-text'

const SnowOverlayW = (props) => {
    const { SnowStyle } = useStyleContext(props)
    const {
        focusLongPress,
        focusPress,
        tvRemoteProps,
        pushFocusLayer,
        popFocusLayer,
        focusedLayer,
        addFocusMap
    } = useFocusContext()
    const { pushOverlay, popOverlay } = useLayerContext(props)

    if (!props.focusLayer) {
        return <SnowText>SnowOverlay requires a focusLayer prop</SnowText>
    }

    const [isReady, setIsReady] = React.useState(false)

    const elementRef = React.useRef(null);
    const focusLayerName = `snow-overlay-${props.focusLayer}`

    React.useEffect(() => {
        pushFocusLayer(focusLayerName, true)
        setIsReady(true)
        return () => {
            popFocusLayer()
        }
    }, [])

    React.useEffect(() => {
        if (isReady && elementRef.current) {
            addFocusMap(elementRef, props);
        }
    }, [
        props.focusStart,
        props.focusKey,
        props.focusDown,
        props.focusUp,
        props.focusRight,
        props.focusLeft,
        focusedLayer,
        elementRef,
        isReady
    ]);




    let style = [SnowStyle.component.overlay.touchable]
    if (props.transparent) {
        style.push(SnowStyle.component.overlay.transparent)
    }
    if (props.black) {
        style.push(SnowStyle.component.overlay.black)
    }

    const overlayView = (
        <TouchableOpacity
            ref={elementRef}
            {...tvRemoteProps}
            style={style}
            activeOpacity={1} // Without this, the overlay applies a white filter to anything underneath
            onPress={focusPress(elementRef, props.focusKey)}
            onLongPress={focusLongPress(elementRef, props.focusKey)}
            children={props.children}
        />
    )

    React.useEffect(() => {
        pushOverlay(overlayView)
        return () => {
            popOverlay()
        }
    }, [])

    return null
}

SnowOverlayW.isSnowFocusWired = true

export const SnowOverlay = SnowOverlayW

export default SnowOverlay