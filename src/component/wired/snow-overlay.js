import React from 'react'
import { TouchableOpacity } from 'react-native'
import { useStyleContext } from '../../context/snow-style-context'
import { useFocusContext } from '../../context/snow-focus-context'
import SnowText from '../snow-text'

const SnowOverlayW = (props) => {
    const { SnowStyle } = useStyleContext(props)
    const {
        focusOn,
        focusLongPress,
        focusPress,
        isFocused,
        isFocusedLayer,
        tvRemoteProps,
        useFocusLayer,
        useFocusWiring,
    } = useFocusContext()
    const elementRef = useFocusWiring(props)

    useFocusLayer(props.focusLayer, true)

    React.useEffect(() => {
        if (isFocusedLayer(props.focusLayer) && !isFocused(props.focusKey) && props.stealFocus !== false) {
            focusOn(elementRef, props.focusKey)
        }
    })

    if (!isFocusedLayer(props.focusLayer)) {
        return null
    }

    if (!props.focusLayer) {
        return <SnowText>SnowOverlay requires a focusLayer prop</SnowText>
    }

    let style = [SnowStyle.component.overlay.touchable]
    if (props.transparent) {
        style.push(SnowStyle.component.overlay.transparent)
    }
    if (props.black) {
        style.push(SnowStyle.component.overlay.black)
    }

    return (
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
}

SnowOverlayW.isSnowFocusWired = true

export const SnowOverlay = SnowOverlayW

export default SnowOverlay