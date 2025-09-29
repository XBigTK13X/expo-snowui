import React from 'react'
import { TouchableOpacity, View, Platform } from 'react-native';
import SnowText from './snow-text'
import { Image } from 'expo-image'
import { useStyleContext } from '../context/snow-style-context'

/* spread props
nextFocusLeft
nextFocusRight
nextFocusUp
nextFocusDown
onPress
onLongPress
*/

export function SnowImageButton(props) {
    const { SnowStyle } = useStyleContext(props)

    const [focused, setFocused] = React.useState(false)
    const touchRef = React.useRef(null)

    React.useEffect(() => {
        if (props.shouldFocus) {
            touchRef.current.focus()
        }
    }, [])

    let fontStyle = [SnowStyle.component.imageButton.text]
    let title = props.title
    if (title && title.length > 20) {
        fontStyle.push(SnowStyle.component.imageButton.smallText)
    }

    if (title && title.length > 40) {
        title = title.substring(0, 40) + '...'
    }

    const wrapperStyle = [SnowStyle.component.imageButton.wrapper]
    const imageStyle = [SnowStyle.component.imageButton.image]
    if (props.wide) {
        wrapperStyle.push(SnowStyle.component.imageButton.wrapperWide)
        imageStyle.push(SnowStyle.component.imageButton.imageWide)
    }
    if (props.square) {
        wrapperStyle.push(SnowStyle.component.imageButton.wrapperSquare)
        imageStyle.push(SnowStyle.component.imageButton.imageSquare)
    }

    let textWrapperStyle = [SnowStyle.component.imageButton.textWrapper]

    if (props.dull) {
        textWrapperStyle.push(SnowStyle.component.imageButton.dull)
    }
    if (props.selected) {
        wrapperStyle.push(SnowStyle.component.imageButton.selected)
        textWrapperStyle.push(SnowStyle.component.imageButton.selected)
    }
    if (focused && Platform.isTV) {
        wrapperStyle.push(SnowStyle.component.imageButton.focused)
        textWrapperStyle.push(SnowStyle.component.imageButton.focused)
    }

    let imageSource = null
    if (props.imageUrl) {
        imageSource = { uri: props.imageUrl }
    }
    if (props.imageSource) {
        imageSource = props.imageSource
    }

    return (
        <View>
            <TouchableOpacity
                {...props}
                ref={touchRef}
                activeOpacity={1.0}
                onFocus={() => { setFocused(true) }}
                onBlur={() => { setFocused(false) }}
                style={wrapperStyle}
                hasTVPreferredFocus={props.shouldFocus}
            >
                <Image
                    style={imageStyle}
                    contentFit="contain"
                    source={imageSource}
                    placeholder={props.placeholder}
                />
                <View style={textWrapperStyle}>
                    <SnowText style={fontStyle}>{title}</SnowText>
                </View>

            </TouchableOpacity>
        </View>
    )
}

export default SnowImageButton