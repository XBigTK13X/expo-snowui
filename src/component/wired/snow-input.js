import React from 'react'
import { TextInput, Pressable } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'
import { useStyleContext } from '../../context/snow-style-context'
import { useFocusContext } from '../../context/snow-focus-context'

const SnowInputW = (props) => {
    const { SnowStyle, SnowConfig } = useStyleContext(props)
    const { isFocused, useFocusWiring, tvRemoteProps } = useFocusContext()
    const containerRef = useFocusWiring(props)
    const inputRef = React.useRef(null)

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

    const onChangeText = (val) => {
        if (props.onValueChange) {
            props.onValueChange(val)
        }
        if (onDebounce) {
            onDebounce(val)
        }
    }

    const onSubmit = (evt) => {
        if (props.onSubmit) {
            props.onSubmit(evt.nativeEvent.text)
        }
        if (onDebounce) {
            onDebounce.cancel()
        }
        inputRef.current?.blur()
    }

    const onContainerPress = () => {
        inputRef.current?.focus()
    }

    return (
        <Pressable
            ref={containerRef}
            {...tvRemoteProps(props)}
            onPress={onContainerPress}
            style={textStyle} >
            <TextInput
                ref={inputRef}
                secureTextEntry={props.secureTextEntry}
                style={[textStyle, {
                    flex: 1,
                    width: '100%',
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    margin: 0,
                    padding: 0
                }]}
                editable={true}
                focusable={false}
                onChangeText={onChangeText}
                onSubmitEditing={onSubmit}
                onEndEditing={onSubmit}
                value={props.value}
            />
        </Pressable>
    )
}

SnowInputW.isSnowFocusWired = true

export const SnowInput = SnowInputW

export default SnowInput