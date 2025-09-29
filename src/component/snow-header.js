import { useStyleContext } from '../context/snow-style-context'
import SnowText from './snow-text'

export function SnowHeader(props) {
    const { SnowStyle } = useStyleContext(props)

    let style = [SnowStyle.component.header]
    if (props.style) {
        style.push(props.style)
    }
    return (
        <SnowText
            skipDefault
            center={props.center}
            noSelect={props.noSelect}
            style={style}
            children={props.children}
        />
    )
}

export default SnowHeader