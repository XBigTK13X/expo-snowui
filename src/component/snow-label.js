import { View, Text } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'

export function SnowLabel(props) {
    const { SnowStyle } = useStyleContext(props)
    if (props.center) {
        return (
            <View style={SnowStyle.component.label.center}>
                <Text style={SnowStyle.component.label.default} children={props.children} />
            </View>
        )
    }
    return <Text style={SnowStyle.component.label.default} children={props.children} />
}

export default SnowLabel