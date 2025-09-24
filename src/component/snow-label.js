import { View, Text } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'
import SnowText from './snow-text'
import SnowNoFocus from './snow-no-focus'

export function SnowLabel(props) {
    const { SnowStyle } = useStyleContext(props)
    return (<SnowText
        {...SnowNoFocus.noFocusElement}
        skipDefault
        center={props.center}
        noSelect={props.noSelect}
        style={SnowStyle.component.header}
        children={props.children}
    />
    )
}

export default SnowLabel