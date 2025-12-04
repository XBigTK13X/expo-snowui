import { Pressable, View } from 'react-native';
import { useFocusContext } from '../../context/snow-focus-context'
import { useStyleContext } from '../../context/snow-style-context'
import SnowText from '../snow-text'

const SnowTextButtonW = (props) => {
    const { SnowStyle } = useStyleContext(props)
    const { focusEnabled, isFocused, focusPress, focusLongPress, useFocusWiring, tvRemoteProps } = useFocusContext()
    const elementRef = useFocusWiring(props)

    const wrapperStyle = [SnowStyle.component.textButton.wrapper]
    if (props.disabled) {
        wrapperStyle.push(SnowStyle.component.textButton.disabled)
    }
    else {
        if (props.selected) {
            wrapperStyle.push(SnowStyle.component.textButton.selected)
        }
        if (isFocused(props.focusKey)) {
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

    if (props.fade) {
        textStyle.push(SnowStyle.component.textButton.fadeText)
    }

    if (props.short) {
        wrapperStyle.push(SnowStyle.component.textButton.shortWrapper)
        textStyle.push(SnowStyle.component.textButton.smallText)
    }

    let onPress = props.onPress
    let onLongPress = props.onLongPress
    if (focusEnabled) {
        onPress = focusPress(elementRef, props.focusKey)
        onLongPress = focusLongPress(elementRef, props.focusKey)
    }

    return (
        <Pressable
            ref={elementRef}
            {...tvRemoteProps(props)}
            style={wrapperStyle}
            onPress={onPress}
            onLongPress={onLongPress}
            disabled={props.disabled}

        >
            <View style={SnowStyle.component.textButton.textContainer}>
                <SnowText noSelect style={textStyle}>{title}</SnowText>
            </View>
        </Pressable >
    )
}

SnowTextButtonW.isSnowFocusWired = true

export const SnowTextButton = SnowTextButtonW

export default SnowTextButton