import { View, Text } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'
import SnowText from './snow-text'

export function SnowLabel(props) {
    const { SnowStyle } = useStyleContext(props)
    return (
        <SnowText
            skipDefault
            center={props.center}
            noSelect={props.noSelect}
            style={SnowStyle.component.label}
            children={props.children}
        />
    )
}

export default SnowLabel