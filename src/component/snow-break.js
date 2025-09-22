import { View } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'

import SnowNoFocus from './snow-no-focus'

export function SnowBreak(props) {
    const { SnowStyle } = useStyleContext(props)
    return <SnowNoFocus style={SnowStyle.component.break} />
}

export default SnowBreak