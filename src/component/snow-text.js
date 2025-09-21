import { View, Text } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'

export function SnowText(props) {
    const { SnowStyle } = useStyleContext(props)

    let style = [SnowStyle.component.text.text]
    if (!props.shrink) {
        style.push(SnowStyle.component.text.normal)
    }
    if (props.noSelect) {
        style.push(SnowStyle.component.text.noSelect)
    }
    if (props.style) {
        style.push(props.style)
    }
    if (props.center) {
        return (
            <View focusable={false} style={SnowStyle.component.text.center}>
                <Text focusable={false} style={style} selectable={!props.noSelect} children={props.children} />
            </View>
        )
    }
    return <Text style={style} selectable={!props.noSelect} children={props.children} />
}

export default SnowText