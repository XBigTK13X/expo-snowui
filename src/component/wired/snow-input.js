import { TextInput } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'
import { useStyleContext } from '../../context/snow-style-context'
import { useFocusContext } from '../../context/snow-focus-context'

const SnowInputW = (props) => {
    const { SnowStyle, SnowConfig } = useStyleContext(props)
    const { isFocused, useFocusWiring, tvRemoteProps } = useFocusContext()
    const elementRef = useFocusWiring(props)

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
        {...tvRemoteProps(props)}
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
        onSubmitEditing={(val) => {
            if (props.onSubmit) {
                props.onSubmit(val)
            }
            if (!props.onSubmit && onDebounce) {
                onDebounce(val)
            }
        }}
        value={props.value}
    />
}

SnowInputW.isSnowFocusWired = true

export const SnowInput = SnowInputW

export default SnowInput