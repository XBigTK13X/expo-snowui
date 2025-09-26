import { TextInput } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'
import { useStyleContext } from '../context/snow-style-context'

/* spreadble props
secureTextEntry
nextFocusLeft
nextFocusRight
nextFocusUp
nextFocusDown
*/

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
        {...props}
        style={textStyle}
        autoFocus={props.shouldFocus}
        focusable={true}
        editable={true}
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