import { Text } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'

export function SnowHeader(props) {
    const { SnowStyle } = useStyleContext(props)
    return <Text style={SnowStyle.component.header}>{props.children}</Text>
}

export default SnowHeader