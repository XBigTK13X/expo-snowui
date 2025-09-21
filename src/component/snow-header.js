import { Text } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'

export function SnowHeader(props) {
    const { SnowStyle } = useStyleContext(props)
    return <Text focusable={false} style={SnowStyle.component.header}>{props.children}</Text>
}

export default SnowHeader