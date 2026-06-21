import React from 'react'
import { View, Text, Animated, Easing } from 'react-native'
import { useStyleContext } from '../context/snow-style-context'

export function SnowText(props) {
    const { SnowStyle } = useStyleContext(props)
    const animatedValue = React.useRef(new Animated.Value(0)).current
    const [textWidth, setTextWidth] = React.useState(0)
    const [containerWidth, setContainerWidth] = React.useState(0)

    React.useEffect(() => {
        if (props.marquee && textWidth > containerWidth && containerWidth > 0) {
            animatedValue.setValue(0)

            const marqueeAnimation = Animated.loop(
                Animated.sequence([
                    Animated.delay(1500),
                    Animated.timing(animatedValue, {
                        toValue: -(textWidth - containerWidth + 20),
                        duration: (textWidth - containerWidth) * 30,
                        easing: Easing.linear,
                        useNativeDriver: true
                    }),
                    Animated.delay(1500)
                ])
            )

            marqueeAnimation.start()

            return () => marqueeAnimation.stop()
        }
    }, [props.marquee, textWidth, containerWidth])

    let style = [SnowStyle.component.text.text]
    if (!props.shrink && !props.skipDefault) {
        style.push(SnowStyle.component.text.normal)
    }
    if (props.noSelect) {
        style.push(SnowStyle.component.text.noSelect)
    }
    if (props.style) {
        style.push(props.style)
    }
    let wrapperStyle = null
    if (props.center) {
        wrapperStyle = SnowStyle.component.text.center
    }

    if (props.marquee) {
        return (
            <View
                style={[wrapperStyle, { overflow: 'hidden', width: '100%' }]}
                onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}>
                <Animated.View style={{ transform: [{ translateX: animatedValue }], flexDirection: 'row' }}>
                    <Text
                        testID={props.testID}
                        style={[style, { whiteSpace: 'nowrap' }]}
                        selectable={!props.noSelect}
                        numberOfLines={1}
                        onLayout={(event) => setTextWidth(event.nativeEvent.layout.width)}
                        children={props.children} />
                </Animated.View>
            </View>
        )
    }

    return (
        <View
            style={wrapperStyle}>
            <Text
                testID={props.testID}
                style={style}
                selectable={!props.noSelect}
                numberOfLines={props.numberOfLines ?? 1}
                ellipsizeMode="tail"
                children={props.children} />
        </View>
    )
}

export default SnowText