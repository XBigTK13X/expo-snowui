import { View } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'

export function SnowBreak(props) {
    const { SnowStyle } = useStyleContext(props)
    return <View focusable={false} style={SnowStyle.component.break} />
}

export default SnowBreak