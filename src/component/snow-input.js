import React from 'react'
import { TextInput } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'
import { useStyleContext } from '../context/snow-style-context'
import { useFocusContext } from '../context/snow-focus-context'

const SnowInputComponent = (props) => {
    const { SnowStyle, SnowConfig } = useStyleContext(props)
    const { isFocused, addFocusMap, focusOn, focusPress, focusLongPress } = useFocusContext()
    const elementRef = React.useRef(null)

    React.useEffect(() => {
        if (elementRef.current) {
            addFocusMap(elementRef, props)
            if (props.focusStart) {
                focusOn(elementRef, props.focusKey)
            }
        }
    }, [props.focusKey, props.focusDown, props.focusUp, props.focusRight, props.focusLeft])

    let textStyle = [SnowStyle.component.input.text]
    if (props.short) {
        textStyle.push(SnowStyle.component.input.small)
    }
    if (isFocused(props.focusKey)) {
        textStyle.push(SnowStyle.component.input.focused)
    }

    let onDebounce = null
    if (props.onDebounce) {
        onDebounce = useDebouncedCallback(props.onDebounce, SnowConfig.inputDebounceMilliseconds)
    }
    return <TextInput
        ref={elementRef}
        secureTextEntry={props.secureTextEntry}
        style={textStyle}
        editable={true}
        onChangeText={(val) => {
            if (props.onValueChange) {
                props.onValueChange(val)
            }
            if (onDebounce) {
                onDebounce(val)
            }
        }}
        onSubmitEditing={() => {
            if (props.onSubmit) {
                props.onSubmit()
            }
        }}
        value={props.value}
    />
}

SnowInputComponent.isSnowFocusWired = true

export const SnowInput = SnowInputComponent

export default SnowInput