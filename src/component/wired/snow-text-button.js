import { Pressable, View } from 'react-native';
import { useFocusContext } from '../../context/snow-focus-context'
import { useStyleContext } from '../../context/snow-style-context'
import SnowText from '../snow-text'

export const SnowTextButton = (props) => {
    const { SnowStyle } = useStyleContext(props)
    const { focusWrap, isFocused } = useFocusContext('text-button', props)

    let wrapperStyle = [SnowStyle.component.textButton.wrapper]
    if (props.short) {
        wrapperStyle = [SnowStyle.component.textButton.shortWrapper]
    }
    if (props.disabled) {
        wrapperStyle.push(SnowStyle.component.textButton.disabled)
    }
    else {
        if (props.selected) {
            wrapperStyle.push(SnowStyle.component.textButton.selected)
        }
        if (isFocused) {
            wrapperStyle.push(SnowStyle.component.textButton.focused)
        }
    }

    if (props.fade) {
        wrapperStyle.push(SnowStyle.component.textButton.fade)
    }

    if (props.tall && SnowStyle.isWeb) {
        wrapperStyle.push(SnowStyle.component.textButton.tallWrapper)
    }

    if (props.style) {
        wrapperStyle.push(props.style)
    }

    let textStyle = [SnowStyle.component.textButton.text]
    let title = props.title
    if (props.title.length > 60) {
        textStyle.push(SnowStyle.component.textButton.smallText)
    }
    if (props.title.length > 120) {
        title = title.substring(0, 120) + '...'
    }

    if (props.short) {
        textStyle.push(SnowStyle.component.textButton.shortText)
    }

    if (props.fade) {
        textStyle.push(SnowStyle.component.textButton.fadeText)
    }

    let containerStyle = [SnowStyle.component.textButton.textContainer]
    if (props.short) {
        containerStyle = [SnowStyle.component.textButton.shortContainer]
    }

    return focusWrap(
        <Pressable
            style={wrapperStyle}
            disabled={props.disabled}
        >
            <View style={containerStyle}>
                <SnowText noSelect style={textStyle}>{title}</SnowText>
            </View>
        </Pressable >
    )
}

export default SnowTextButton