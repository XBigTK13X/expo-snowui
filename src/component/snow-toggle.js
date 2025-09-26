import { Switch, Pressable } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'
import { SnowLabel } from './snow-label'

/* spread props
nextFocusLeft
nextFocusRight
nextFocusUp
nextFocusDown
*/

export function SnowToggle(props) {
    const { SnowStyle } = useStyleContext(props)

    const toggleValue = () => {
        props.onValueChange(!props.value)
    }
    return (
        <Pressable
            {...props}
            onPress={toggleValue}
            style={SnowStyle.component.toggle.center}>
            <SnowLabel>{props.title}</SnowLabel>
            <Switch
                style={{ marginLeft: 'auto', marginRight: 'auto' }}
                value={props.value}
                onValueChange={toggleValue} />
        </Pressable>
    )
}

export default SnowToggle