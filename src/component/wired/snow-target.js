import { View } from 'react-native'
import { useFocusContext } from '../../context/snow-focus-context'
import { useStyleContext } from '../../context/snow-style-context'

const SnowTargetW = (props) => {
    const { SnowStyle } = useStyleContext(props)
    const { isFocused, useFocusWiring } = useFocusContext()
    const { elementRef } = useFocusWiring(props)

    let outerStyle = [SnowStyle.component.target.outer]

    if (props.outerStyle) {
        outerStyle.push(props.outerStyle)
    }

    let innerStyle = [SnowStyle.component.target.inner]
    if (isFocused(props.focusKey)) {
        innerStyle.push(SnowStyle.component.target.focused)
    }

    if (props.innerStyle) {
        innerStyle.push(props.innerStyle)
    }

    return (
        <View style={outerStyle}>
            <View ref={elementRef} style={innerStyle} />
        </View>
    )
}

SnowTargetW.isSnowFocusWired = true

export const SnowTarget = SnowTargetW

export default SnowTarget