import { Switch, Pressable } from 'react-native'
import { useStyleContext } from '../../context/snow-style-context'
import { useFocusContext } from '../../context/snow-focus-context'
import { SnowLabel } from '../snow-label'

const SnowToggleW = (props) => {
    const { SnowStyle } = useStyleContext(props)
    const { useFocusWiring, isFocused } = useFocusContext()
    const elementRef = useFocusWiring(props)

    const toggleValue = () => {
        props.onValueChange(!props.value)
    }

    let thumbColor = SnowStyle.component.toggle.color.thumb
    if (isFocused(props.focusKey)) {
        thumbColor = SnowStyle.color.hover
    } else {
        if (props.value) {
            thumbColor = SnowStyle.component.toggle.color.true
        } else {
            thumbColor = SnowStyle.component.toggle.color.false
        }
    }



    return (
        <Pressable
            ref={elementRef}
            style={SnowStyle.component.toggle.center}
            onPress={toggleValue}
        >
            <SnowLabel>{props.title}</SnowLabel>
            <Switch
                thumbColor={thumbColor}
                trackColor={
                    {
                        true: SnowStyle.component.toggle.color.true,
                        false: SnowStyle.component.toggle.color.false
                    }}
                style={{ marginLeft: 'auto', marginRight: 'auto' }}
                value={props.value}
                onValueChange={toggleValue} />
        </Pressable>
    )
}

SnowToggleW.isSnowFocusWired = true

export const SnowToggle = SnowToggleW

export default SnowToggle