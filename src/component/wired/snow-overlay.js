import React from 'react'
import { TouchableOpacity } from 'react-native'
import { useStyleContext } from '../../context/snow-style-context'
import { useFocusContext } from '../../context/snow-focus-context'
import SnowText from '../snow-text'
import SnowFillView from '../snow-fill-view'

const SnowOverlayW = (props) => {
    const { SnowStyle } = useStyleContext(props)
    const {
        focusLongPress,
        focusPress,
        tvRemoteProps,
        pushFocusLayer,
        popFocusLayer,
        focusedLayer,
        addFocusMap,
        readFocusProps,
        focusEnabled
    } = useFocusContext()

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

    let onPress = props.onPress
    let onLongPress = props.onLongPress
    if (focusEnabled) {
        onPress = focusPress(elementRef, props.focusKey)
        onLongPress = focusLongPress(elementRef, props.focusKey)
    }

    return (
        <TouchableOpacity
            ref={elementRef}
            {...tvRemoteProps}
            {...readFocusProps(props)}
            style={style}
            activeOpacity={1} // Without this, the overlay applies a white filter to anything underneath
            onPress={onPress}
            onLongPress={onLongPress}>
            <SnowFillView></SnowFillView>
        </TouchableOpacity>
    )
}

SnowOverlayW.isSnowFocusWired = true

export const SnowOverlay = SnowOverlayW

export default SnowOverlay