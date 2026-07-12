import React from 'react'
import { View, Pressable } from 'react-native'

import { Image } from 'expo-image'

import { useStyleContext } from '../../context/snow-style-context'
import { useFocusContext } from '../../context/snow-focus-context'

import SnowText from '../snow-text'

export const SnowImageButton = (props) => {
    const { SnowStyle } = useStyleContext(props)
    const {
        focusWrap,
        isFocused
    } = useFocusContext('image-button', { ...props, canFocus: true })

    const [pressing, setPressing] = React.useState(false)

    let fontStyle = [SnowStyle.component.imageButton.text]
    let title = props.title
    if (title && title.length > 60) {
        fontStyle.push(SnowStyle.component.imageButton.smallText)
    }
    if (title && title.length > 120) {
        title = title.substring(0, 120) + '...'
    }

    const wrapperStyle = [SnowStyle.component.imageButton.wrapper]
    const imageStyle = [SnowStyle.component.imageButton.image]

    if (props.overlayTitle) {
        if (props.wide) {
            imageStyle.push(SnowStyle.component.imageButton.imageWide)
            wrapperStyle.push(SnowStyle.imageButton.noTitle.wide)
        } else if (props.square) {
            imageStyle.push(SnowStyle.component.imageButton.imageSquare)
            wrapperStyle.push(SnowStyle.imageButton.noTitle.square)
        } else {
            wrapperStyle.push({
                width: SnowStyle.imageButton.wrapper.normal.width,
                height: SnowStyle.imageButton.image.normal.height + 10
            })
            imageStyle.push({ marginTop: 0, justifyContent: 'center', alignSelf: 'center' })
        }
    } else {
        if (!title) {
            wrapperStyle.push(SnowStyle.imageButton.noTitle.normal)
        }
        if (props.wide) {
            imageStyle.push(SnowStyle.component.imageButton.imageWide)
            if (title) {
                wrapperStyle.push(SnowStyle.component.imageButton.wrapperWide)
            } else {
                wrapperStyle.push(SnowStyle.imageButton.noTitle.wide)
            }
        }
        if (props.square) {
            imageStyle.push(SnowStyle.component.imageButton.imageSquare)
            if (title) {
                wrapperStyle.push(SnowStyle.component.imageButton.wrapperSquare)
            } else {
                wrapperStyle.push(SnowStyle.imageButton.noTitle.square)
            }
        }
    }

    let textWrapperStyle = [SnowStyle.component.imageButton.textWrapper]
    if (props.dull) {
        textWrapperStyle.push(SnowStyle.component.imageButton.dull)
    }
    if (props.selected) {
        wrapperStyle.push(SnowStyle.component.imageButton.selected)
        textWrapperStyle.push(SnowStyle.component.imageButton.selected)
    }
    if (isFocused) {
        wrapperStyle.push(SnowStyle.component.imageButton.focused)
        textWrapperStyle.push(SnowStyle.component.imageButton.focused)
    }
    let imageSource = null
    if (props.imageUrl) {
        imageSource = { uri: props.imageUrl }
    }
    else {
        if (props.imageSource) {
            imageSource = props.imageSource
        }
    }

    if (pressing && SnowStyle.isHandheld) {
        wrapperStyle.push(SnowStyle.pressing)
    }

    let textElement = null
    let dullOverlayElement = null

    if (props.overlayTitle) {
        if (isFocused && title) {
            textElement = (
                <View style={SnowStyle.component.imageButton.overlayBack}>
                    <SnowText style={[fontStyle, SnowStyle.component.imageButton.overlayFront]}>{title}</SnowText>
                </View>
            )
        } else if (!isFocused && props.dull) {
            const dullOverlayStyle = {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.66)',
                borderRadius: SnowStyle.button.borderRadius
            }
            dullOverlayElement = <View style={dullOverlayStyle} />
        }
    } else if (title) {
        textElement = (
            <View style={textWrapperStyle}>
                <SnowText style={fontStyle}>{title}</SnowText>
            </View>
        )
    }

    if (props.wrapperStyle) {
        wrapperStyle.push(props.wrapperStyle)
    }
    if (props.imageStyle) {
        imageStyle.push(props.imageStyle)
    }

    return focusWrap(
        <Pressable
            style={wrapperStyle}
            onPressIn={() => { setPressing(true) }}
            onPressOut={() => { setPressing(false) }}
        >
            <View style={imageStyle}>
                <Image
                    style={{ width: '100%', height: '100%' }}
                    contentFit="contain"
                    source={imageSource}
                    placeholder={props.placeholder}
                />
                {dullOverlayElement}
                {textElement}
            </View>
        </Pressable>
    )
}
export default SnowImageButton