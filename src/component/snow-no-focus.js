import { View } from 'react-native'

export const noFocusProps = {
    focusable: false,
    isTVSelectable: false,
    tvParallaxProperties: false,
    importantForAccessibility: "no-hide-descendants",
    pointerEvents: "none"
}

export function SnowNoFocus(props) {
    return (
        <View
            {...noFocusProps}
            style={props.style}
            children={props.children}
        />
    )
}

export default SnowNoFocus