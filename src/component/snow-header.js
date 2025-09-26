import { Text, View } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'
import SnowText from './snow-text'

export function SnowHeader(props) {
    const { SnowStyle } = useStyleContext(props)
    return (
        <SnowText
            skipDefault
            center={props.center}
            noSelect={props.noSelect}
            style={SnowStyle.component.header}
            children={props.children}
        />
    )
}

export default SnowHeader