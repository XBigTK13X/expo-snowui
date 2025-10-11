import { View } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'

export function SnowBreak(props) {
    const { SnowStyle } = useStyleContext(props)

    let style = [SnowStyle.component.break.horizontal]
    if (props.vertical) {
        style = [SnowStyle.component.break.vertical]
    }

    if (props.style) {
        style.push(props.style)
    }

    return (
        <View
            style={style}
        />
    )
}

export default SnowBreak