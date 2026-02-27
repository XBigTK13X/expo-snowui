import { View } from 'react-native'

import { useFocusContext } from '../../context/snow-focus-context'
import { useStyleContext } from '../../context/snow-style-context'

import SnowView from './snow-view'

export const SnowTarget = (props) => {
    const { SnowStyle } = useStyleContext(props)
    const { isFocused, focusWrap } = useFocusContext('target', { ...props, canFocus: true })

    let outerStyle = [SnowStyle.component.target.outer]

    if (props.outerStyle) {
        outerStyle.push(props.outerStyle)
    }

    let innerStyle = [SnowStyle.component.target.inner]
    if (isFocused) {
        innerStyle.push(SnowStyle.component.target.focused)
    }

    if (props.innerStyle) {
        innerStyle.push(props.innerStyle)
    }

    return focusWrap(
        <SnowView style={outerStyle}>
            <View style={innerStyle} />
        </SnowView>
    )
}

export default SnowTarget