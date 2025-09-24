import { View } from 'react-native'

export const noFocusContainer = {
    focusable: false,
    isTVSelectable: false,
    tvParallaxProperties: false,
    importantForAccessibility: "no-hide-descendants",
    pointerEvents: "none"
}

export const noFocusElement = {
    focusable: false,
    isTVSelectable: false,
    tvParallaxProperties: false,
    importantForAccessibility: "no",
    pointerEvents: "none"
}

export function SnowNoFocus(props) {
    return (
        <View
            {...noFocusContainer}
            style={props.style}
            children={props.children}
        />
    )
}

export default SnowNoFocus