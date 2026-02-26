import React from 'react'
import { View } from 'react-native'
import { useFocusContext } from '../../context/snow-focus-context'

// Sometimes when building, say a Tabs element, a single tab entry will need multiple children.
// These children are usually wrapped in a <View>
// However, the View would strip out props used by snowui
// Instead this component can be used to make sure props properly propogate.
// Focus props goto the first child
// Style props goto all children

export const SnowView = (props) => {
    const { focusWrap, focusPath } = useFocusContext('view', props)
    let styleProps = {}

    if (props.snowStyle) {
        styleProps.snowStyle = props.snowStyle
    }
    if (props.snowConfig) {
        styleProps.snowConfig = props.snowConfig
    }

    const children = React.Children.toArray(props.children).map((child, childIndex) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                parentPath: focusPath,
                xx: 0,
                yy: childIndex,
                ...styleProps
            })
        }
        return child;
    }).filter(child => child !== null);

    return focusWrap(<View
        {...styleProps}
        style={props.style}
        children={children}
    />)
}

export default SnowView