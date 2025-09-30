import React from 'react'
import { Switch, Pressable } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'
import { useFocusContext } from '../context/snow-focus-context'
import { SnowLabel } from './snow-label'

export function SnowToggle(props) {
    const { SnowStyle } = useStyleContext(props)
    const { addFocusMap, focusOn, isFocused, focusedKey } = useFocusContext()
    const elementRef = React.useRef(null)

    React.useEffect(() => {
        if (elementRef.current) {
            addFocusMap(elementRef, props)
            if (props.focusStart) {
                focusOn(elementRef, props.focusKey)
            }
        }
    }, [props.focusKey, props.focusDown, props.focusUp, props.focusRight, props.focusLeft])

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

export default SnowToggle