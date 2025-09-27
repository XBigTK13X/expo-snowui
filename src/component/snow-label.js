import { View, Text } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'
import SnowText from './snow-text'

export function SnowLabel(props) {
    const { SnowStyle } = useStyleContext(props)

    let style = [SnowStyle.component.label]
    if (props.style) {
        style.push(props.style)
    }
    return (
        <SnowText
            skipDefault
            center={props.center}
            noSelect={props.noSelect}
            style={style}
            children={props.children}
        />
    )
}

export default SnowLabel