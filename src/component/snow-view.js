import { View } from 'react-native'
import { useFocusContext } from '../context/snow-focus-context'

// Sometimes when building, say a Tabs element, a single tab entry will need multiple children.
// These children are usually wrapped in a <View>
// However, the View would strip out props used by snowui
// Instead this component can be used to make sure props properly propogate.

export function SnowView(props) {
    let styleProps = {}
    if (props.snowStyle) {
        styleProps.snowStyle = props.snowStyle
    }
    if (props.snowConfig) {
        styleProps.snowConfig = props.snowConfig
    }
    const { readFocusProps } = useFocusContext()

    return (<View
        {...readFocusProps(props)}
        {...styleProps}
        children={props.children}
    />)
}

export default SnowView