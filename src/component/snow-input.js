import { TextInput } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'
import { useStyleContext } from '../context/snow-style-context'

export function SnowInput(props) {
    const { SnowStyle, SnowConfig } = useStyleContext(props)
    let textStyle = [SnowStyle.component.input.text]
    if (props.short) {
        textStyle.push(SnowStyle.component.input.small)
    }

    let onDebounce = null
    if (props.onDebounce) {
        onDebounce = useDebouncedCallback(props.onDebounce, SnowConfig.inputDebounceMilliseconds)
    }
    return <TextInput
        style={textStyle}
        secureTextEntry={props.secureTextEntry}
        focusable={props.shouldFocus}
        nextFocusLeft={props.nextFocusLeft}
        nextFocusRight={props.nextFocusRight}
        nextFocusUp={props.nextFocusUp}
        nextFocusDown={props.nextFocusDown}
        autoFocus={props.shouldFocus}
        onChangeText={(val) => {
            if (props.onValueChange) {
                props.onValueChange(val)
            }
            if (onDebounce) {
                onDebounce(val)
            }
        }}
        onSubmitEditing={props.onSubmit}
        value={props.value}
    />
}

export default SnowInput