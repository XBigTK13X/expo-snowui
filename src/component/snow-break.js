import { View } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'
import { noFocusProps } from '../context/snow-focus-context'

export function SnowBreak(props) {
    const { SnowStyle } = useStyleContext(props)

    return (<View
        {...noFocusProps}
        style={SnowStyle.component.break}
    />)
}

export default SnowBreak