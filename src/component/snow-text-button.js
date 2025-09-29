import React from 'react'
import { Pressable, Keyboard } from 'react-native';
import { useFocusContext } from '../context/snow-focus-context'
import { useStyleContext } from '../context/snow-style-context'
import SnowText from './snow-text'

/* spread props
nextFocusLeft
nextFocusRight
nextFocusUp
nextFocusDown
*/


export function SnowTextButton(props) {
    const { SnowStyle } = useStyleContext(props)
    const { isFocused, addFocusMap, setFocusedKey } = useFocusContext()
    const touchRef = React.useRef(null)

    const onPressUnlessTyping = () => {
        if (props.onPress && !Keyboard.isVisible()) {
            return props.onPress()
        }
    }

    const onLongPressUnlessTyping = () => {
        if (props.onLongPress && !Keyboard.isVisible()) {
            return props.onLongPress()
        }
    }

    React.useEffect(() => {
        addFocusMap(touchRef, props, onPressUnlessTyping, onLongPressUnlessTyping)
        if (props.focusStart) {
            setFocusedKey(props.focusKey)
        }
    }, [props.focusKey])

    const wrapperStyle = [SnowStyle.component.textButton.wrapper]
    if (props.disabled) {
        wrapperStyle.push(SnowStyle.component.textButton.disabled)
    }
    else {
        if (props.selected) {
            wrapperStyle.push(SnowStyle.component.textButton.selected)
        }
        if (isFocused(props.focusKey)) {
            wrapperStyle.push(SnowStyle.component.textButton.focused)
        }
    }

    if (props.fade) {
        wrapperStyle.push(SnowStyle.component.textButton.fade)
    }

    if (props.tall && SnowStyle.isWeb) {
        wrapperStyle.push(SnowStyle.component.textButton.tallWrapper)
    }

    if (props.style) {
        wrapperStyle.push(props.style)
    }

    let textStyle = [SnowStyle.component.textButton.text]
    if (props.title.length > 18) {
        textStyle.push(SnowStyle.component.textButton.smallText)
    }

    if (props.fade) {
        textStyle.push(SnowStyle.component.textButton.fadeText)
    }

    if (props.short) {
        wrapperStyle.push(SnowStyle.component.textButton.shortWrapper)
        textStyle.push(SnowStyle.component.textButton.smallText)
    }

    return (
        <Pressable
            {...props}
            ref={touchRef}
            style={wrapperStyle}
            onPress={onPressUnlessTyping}
            onLongPress={onLongPressUnlessTyping}
            disabled={props.disabled}>
            <SnowText noSelect style={textStyle}>{props.title}</SnowText>
        </Pressable >
    )
}

export default SnowTextButton