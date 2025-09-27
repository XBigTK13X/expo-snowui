import { View, Text } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'

export function SnowText(props) {
    const { SnowStyle } = useStyleContext(props)

    let style = [SnowStyle.component.text.text]
    if (!props.shrink && !props.skipDefault) {
        style.push(SnowStyle.component.text.normal)
    }
    if (props.noSelect) {
        style.push(SnowStyle.component.text.noSelect)
    }
    if (props.style) {
        style.push(props.style)
    }
    let wrapperStyle = null
    if (props.center) {
        wrapperStyle = SnowStyle.component.text.center
    }
    return (
        <View
            style={wrapperStyle}>
            <Text
                {...noFocusProps}
                style={style}
                selectable={!props.noSelect}
                children={props.children} />
        </View>
    )
}

export default SnowText