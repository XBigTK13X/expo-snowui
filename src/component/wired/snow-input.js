import React from 'react'
import { TextInput, Pressable, Keyboard } from 'react-native'
import { useStyleContext } from '../../context/snow-style-context'
import { useFocusContext } from '../../context/snow-focus-context'

export const SnowInput = (props) => {
    const { SnowStyle } = useStyleContext(props)
    const { focusWrap, isFocused, focusHash } = useFocusContext('text-input', {
        ...props,
        canFocus: true,
        onPress: () => inputRef.current?.focus()
    })
    const inputRef = React.useRef(null)

    let textStyle = [SnowStyle.component.input.text]
    if (props.short) {
        textStyle.push(SnowStyle.component.input.small)
    }
    if (isFocused) {
        textStyle.push(SnowStyle.component.input.focused)
    }

    const onSubmit = (textValue) => {
        const text = textValue || props.value
        if (props.onSubmit) {
            props.onSubmit(text)
        }
        inputRef.current?.blur()
    }

    React.useEffect(() => {
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            if (isFocused) {
                onSubmit(props.value)
            }
        })

        return () => hideSubscription.remove()
    }, [isFocused, props.value])

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
                onSubmitEditing={(evt) => onSubmit(evt.nativeEvent.text)}
                onEndEditing={(evt) => onSubmit(evt.nativeEvent.text)}
                value={props.value}
            />
        </Pressable>
    )
}

export default SnowInput