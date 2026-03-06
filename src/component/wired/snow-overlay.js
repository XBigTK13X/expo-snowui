import { TouchableOpacity } from 'react-native'
import { useStyleContext } from '../../context/snow-style-context'
import { useFocusContext } from '../../context/snow-focus-context'

import SnowFillView from '../snow-fill-view'

export const SnowOverlay = (props) => {
    const { SnowStyle } = useStyleContext(props)
    const { focusWrap } = useFocusContext('overlay', {
        ...props,
        boundary: props.boundary ?? 'overlay'
    })

    let style = [SnowStyle.component.overlay.touchable]
    if (props.transparent) {
        style.push(SnowStyle.component.overlay.transparent)
    }
    if (props.black) {
        style.push(SnowStyle.component.overlay.black)
    }

    return focusWrap(
        <TouchableOpacity
            style={style}
            // Without this, the overlay applies a white filter to anything underneath
            activeOpacity={1}
        >
            <SnowFillView></SnowFillView>
        </TouchableOpacity>
    )
}

export default SnowOverlay