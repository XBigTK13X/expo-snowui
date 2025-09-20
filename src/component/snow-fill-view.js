import { ScrollView, View } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'

export function SnowFillView(props) {
    // FlatList often overflows outside of the viewport without enabling scrolling.
    // This commonly happens when any parent container is not set to flex: 1
    const { SnowStyle } = useStyleContext(props)
    if (props.scroll) {
        let viewStyle = []
        let scrollStyle = []
        if (!props.shrink) {
            viewStyle = [SnowStyle.component.fillView.default]
        }
        if (props.flexStart) {
            scrollStyle = [SnowStyle.component.fillView.flexStart]
        }
        if (props.style) {
            viewStyle.push(props.style)
        }
        return <ScrollView
            style={viewStyle}
            contentContainerStyle={scrollStyle}
            children={props.children}
        />
    }

    let style = []
    if (!props.shrink) {
        style = [SnowStyle.component.fillView.default]
    }
    if (props.flexStart) {
        style.push(SnowStyle.component.fillView.flexStart)
    }
    if (props.style) {
        style.push(props.style)
    }
    return (
        <View style={style} children={props.children} />
    )
}

export default SnowFillView