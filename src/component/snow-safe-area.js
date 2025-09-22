import { View, TVFocusGuideView } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'

export function SnowSafeArea(props) {
    const { SnowStyle } = useStyleContext(props)
    let Wrapper = View
    if (SnowStyle.isTV) {
        Wrapper = TVFocusGuideView
    }
    return (
        <Wrapper snowStyle={SnowStyle} style={SnowStyle.component.safeArea}>
            {props.children}
        </Wrapper>
    )
}

export default SnowSafeArea