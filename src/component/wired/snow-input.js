import React from 'react'
import { TextInput, Pressable, Keyboard } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'
import { useStyleContext } from '../../context/snow-style-context'
import { useFocusContext } from '../../context/snow-focus-context'

export const SnowInput = (props) => {
    const { SnowStyle, SnowConfig } = useStyleContext(props)
    const { focusWrap, isFocused } = useFocusContext('text-input', { ...props, canFocus: true })
    const inputRef = React.useRef(null)

    let textStyle = [SnowStyle.component.input.text]
    if (props.short) {
        textStyle.push(SnowStyle.component.input.small)
    }
    if (isFocused) {
        textStyle.push(SnowStyle.component.input.focused)
    }

    React.useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isFocused])

    const onChangeText = (val) => {
        if (props.onValueChange) {
            props.onValueChange(val)
        }
    }

    const onSubmit = (evt) => {
        const text = evt?.nativeEvent?.text || props.value
        if (props.onSubmit) {
            props.onSubmit(text)
        }
        inputRef.current?.blur()
    }

    return focusWrap(
        <Pressable
            onPress={() => inputRef.current?.focus()}
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

export default SnowInput