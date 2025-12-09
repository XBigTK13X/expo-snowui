import React from "react";
import {
    PanResponder,
    Platform,
    Pressable,
    View
} from "react-native";
import { useDebouncedCallback } from 'use-debounce'
import { useInputContext } from '../../context/snow-input-context'
import { useFocusContext } from '../../context/snow-focus-context'
import { useStyleContext } from '../../context/snow-style-context'

const min = 0.0
const max = 1.0
const step = 0.01

// This is a tricky component because props.value can be debounced
// The numerical value the component provides is `percent`
// This is a float between 0.0 and 1.0, to ease multiplication

// The slider has two primary components, the thumb and the track.
// The thumb's position within the track determines the `percent` used throughout the component
// However, that position can also be decided by the parent by passing in a percent
// When the component is being manually updated, then parent updates should be ignored
// Otherwise the parent should take priority

// I first tried @react-native-community/slider
// It did not offer enough customization of the track and thumb

// I then tried @react-native-assets/slider
// It completely breaks in Android or Web, depending on the version of react I override it to use

// After a handful of other libraries still had problems, I rolled my own
const SnowRangeSliderW = (props) => {
    const { SnowStyle, SnowConfig } = useStyleContext(props)
    const { addActionListener, removeActionListener } = useInputContext()
    const { useFocusWiring, isFocused } = useFocusContext()

    const isDraggingRef = React.useRef(false)
    const [percent, setPercent] = React.useState(0)
    const percentRef = React.useRef(percent)
    const [applyStepInterval, setApplyStepInterval] = React.useState(null)
    const applyIntervalRef = React.useRef(applyStepInterval)

    const dragStartXRef = React.useRef(0)
    const dragStartPercentRef = React.useRef(0)


    const elementRef = useFocusWiring(props)

    let sliderWidth = SnowStyle.component.rangeSlider.trackWrapper.width
    if (props.width) {
        sliderWidth = props.width
    }

    let onValueChange = props.onValueChange
    if (props.debounce) {
        onValueChange = useDebouncedCallback(props.onValueChange, SnowConfig.inputDebounceMilliseconds)
    }

    const panRef = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            onPanResponderGrant: () => {
                isDraggingRef.current = true
                dragStartPercentRef.current = percentRef.current
            },

            onPanResponderMove: (_, gestureState) => {
                if (!isDraggingRef.current) return

                let nextPercent =
                    dragStartPercentRef.current + (gestureState.dx / sliderWidth)

                if (nextPercent < 0) nextPercent = 0
                if (nextPercent > 1) nextPercent = 1

                percentRef.current = nextPercent
                setPercent(nextPercent)
            },

            onPanResponderRelease: () => {
                isDraggingRef.current = false
                onValueChange(percentRef.current)
            },

            onPanResponderEnd: () => {
                isDraggingRef.current = false
                onValueChange(percentRef.current)
            }
        })
    )



    React.useEffect(() => {
        if (!isDraggingRef.current) {
            percentRef.current = props.percent
            setPercent(props.percent)
        }
    }, [props.percent])

    React.useEffect(() => {
        percentRef.current = percent
    }, [percent])

    React.useEffect(() => {
        applyIntervalRef.current = applyStepInterval
    }, [applyStepInterval])

    const applyStep = (amount) => {
        let result = percentRef.current + amount
        if (result < min) result = min
        if (result > max) result = max
        percentRef.current = result
        setPercent(result)
        onValueChange(result)
    }

    const longPress = (amount) => {
        clearInterval(applyIntervalRef.current)
        applyStep(amount)
        setApplyStepInterval(setInterval(() => applyStep(amount), 100))
    }

    React.useEffect(() => {
        const actionListenerKey = addActionListener({
            onRight: () => {
                if (isFocused(props.focusKey)) {
                    applyStep(step)
                    clearInterval(applyIntervalRef.current)
                }
            },
            onLongRightStart: () => {
                if (isFocused(props.focusKey)) {
                    longPress(step * 2)
                }
            },
            onLongRightEnd: () => {
                clearInterval(applyIntervalRef.current)
            },
            onLeft: () => {
                if (isFocused(props.focusKey)) {
                    applyStep(-step)
                    clearInterval(applyIntervalRef.current)
                }
            },
            onLongLeftStart: () => {
                if (isFocused(props.focusKey)) {
                    longPress(-step * 2)
                }
            },
            onLongLeftEnd: () => {
                clearInterval(applyIntervalRef.current)
            },
        })
        return () => removeActionListener(actionListenerKey)
    }, [])

    let thumbX = percentRef.current * sliderWidth

    const trackWrapperStyle = [
        SnowStyle.component.rangeSlider.trackWrapper,
        { width: sliderWidth }
    ]

    const leftTrackStyle = [
        SnowStyle.component.rangeSlider.leftTrack,
        { width: thumbX }
    ]

    let thumbStyle = [
        SnowStyle.component.rangeSlider.thumb,
        { left: thumbX - SnowStyle.component.rangeSlider.thumb.width / 2 }
    ]

    if (isFocused(props.focusKey)) {
        thumbStyle.push({
            backgroundColor: SnowStyle.color.hover,
            borderColor: SnowStyle.color.hoverDark
        })
    }

    return (
        <View style={SnowStyle.component.rangeSlider.wrapper}>
            <View {...panRef.current.panHandlers} style={trackWrapperStyle}>
                <View style={leftTrackStyle} />
                <View style={SnowStyle.component.rangeSlider.rightTrack} />
                <Pressable
                    ref={elementRef}
                    style={thumbStyle}
                    focusKey={props.focusKey}
                    focusRight={props.focusKey}
                    focusLeft={props.focusKey}
                    focusUp={props.focusUp}
                    focusDown={props.focusDown}
                />
            </View>
        </View>
    )
}

SnowRangeSliderW.isSnowFocusWired = true

export const SnowRangeSlider = SnowRangeSliderW
export default SnowRangeSlider
