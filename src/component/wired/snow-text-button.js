import { Pressable } from 'react-native';
import { useFocusContext } from '../../context/snow-focus-context'
import { useStyleContext } from '../../context/snow-style-context'
import SnowText from '../snow-text'

const SnowTextButtonW = (props) => {
    const { SnowStyle } = useStyleContext(props)
    const { isFocused, focusPress, focusLongPress, useFocusWiring, tvRemoteProps } = useFocusContext()
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
    if (props.title.length > 18) {
        textStyle.push(SnowStyle.component.textButton.smallText)
    }

    if (props.fade) {
        textStyle.push(SnowStyle.component.textButton.fadeText)
    }

    if (props.short) {
        wrapperStyle.push(SnowStyle.component.textButton.shortWrapper)
        textStyle.push(SnowStyle.component.textButton.smallText)
    }

    return (
        <Pressable
            ref={elementRef}
            {...tvRemoteProps(props)}
            style={wrapperStyle}
            onPress={focusPress(elementRef, props.focusKey)}
            onLongPress={focusLongPress(elementRef, props.focusKey)}
            disabled={props.disabled}

        >
            <SnowText noSelect style={textStyle}>{props.title}</SnowText>
        </Pressable >
    )
}

SnowTextButtonW.isSnowFocusWired = true

export const SnowTextButton = SnowTextButtonW

export default SnowTextButton