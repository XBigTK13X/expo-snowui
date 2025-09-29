import React from "react";
import {
    PanResponder,
    Pressable,
    View,
    findNodeHandle
} from "react-native";
import { useDebouncedCallback } from 'use-debounce'
import { useFocusContext } from '../context/snow-focus-context'
import { useStyleContext } from '../context/snow-style-context'

const min = 0.0
const max = 1.0
const step = 0.01

/* spread props
nextFocusLeft
nextFocusRight
nextFocusUp
nextFocusDown
*/

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
export function SnowRangeSlider(props) {
    const { SnowStyle, SnowConfig } = useStyleContext(props)
    const { setRemoteCallbacks } = useFocusContext()

    const isDraggingRef = React.useRef(false)
    const [percent, setPercent] = React.useState(0)
    const percentRef = React.useRef(percent)
    const [thumbFocus, setThumbFocus] = React.useState(false)
    const elementRef = React.useRef(null)
    const [applyStepInterval, setApplyStepInterval] = React.useState(null)

    let sliderWidth = SnowStyle.component.rangeSlider.trackWrapper.width
    if (props.width) {
        sliderWidth = props.width
    }

    const layoutsRef = React.useRef({
        slider: sliderWidth,
        track: 0,
        thumb: 0,
        leftTrack: 0,
        rightTrack: sliderWidth
    })

    let onValueChange = props.onValueChange
    if (props.debounce) {
        onValueChange = useDebouncedCallback(props.onValueChange, SnowConfig.inputDebounceMilliseconds)
    }

    const thumbPositionToPercent = (positionX) => {
        let actionPositionX = positionX - layoutsRef.current.track.x - (layoutsRef.current.thumb.width / 2)
        if (actionPositionX < 0) {
            actionPositionX = 0
        }
        if (actionPositionX > sliderWidth) {
            actionPositionX = sliderWidth
        }
        let newPercent = actionPositionX / sliderWidth
        if (newPercent < 0) {
            newPercent = 0
        }
        if (newPercent > 1) {
            newPercent = 1
        }
        setPercent(newPercent)
        percentRef.current = newPercent
    }

    const panRef = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderEnd: () => {
                isDraggingRef.current = false
                onValueChange(percentRef.current)
            },
            onPanResponderRelease: () => {
                isDraggingRef.current = false
                onValueChange(percentRef.current)
            },
            onPanResponderMove: (pressEvent, gestureState) => {
                isDraggingRef.current = true
                let positionX = gestureState.moveX
                if (!positionX) {
                    positionX = gestureState.x0
                }
                thumbPositionToPercent(positionX)
            },
            onPanResponderGrant: (pressEvent, gestureState) => {
                isDraggingRef.current = true
                let positionX = gestureState.moveX
                if (!positionX) {
                    positionX = gestureState.x0
                }
                thumbPositionToPercent(positionX)
            }
        })
    );

    React.useEffect(() => {
        if (!isDraggingRef.current) {
            setPercent(props.percent)
        }
    }, [props.percent])

    React.useEffect(() => {
        percentRef.current = percent
    }, [percent])

    React.useEffect(() => {
        setRemoteCallbacks((callbacks) => {
            callbacks['slider'] = sliderHandleRemote
            return callbacks
        })
        return () => {
            setRemoteCallbacks((callbacks) => {
                callbacks['slider'] = null
                return callbacks
            })
        }
    })

    const applyStep = (amount) => {
        let result = percentRef.current + amount
        if (result < min) {
            result = min
        }
        if (result > max) {
            result = max
        }
        percentRef.current = result
        setPercent(result)
        onValueChange(result)
    }

    const longPress = (amount, action) => {
        if (action === 0) {
            applyStep(amount)
            setApplyStepInterval(setInterval(() => { applyStep(amount) }, 100))
        }
        if (action === 1) {
            clearInterval(applyStepInterval)
        }
    }

    const sliderHandleRemote = (kind, action) => {
        if (lockedElement) {
            if (kind === 'right') {
                applyStep(step)
                clearInterval(applyStepInterval)
            }
            else if (kind === 'longRight') {
                longPress(step * 2, action)
            }
            else if (kind === 'left') {
                applyStep(-step)
                clearInterval(applyStepInterval)
            }
            else if (kind === 'longLeft') {
                longPress(-step * 2, action)
            }
            else if (kind === 'down') {
                focusThumb(false)
            }
        }
    }

    const focusThumb = (focus) => {
        if (allowFocusing) {
            if (focus !== thumbFocus) {
                if (focus) {
                    setLockedElement(findNodeHandle(elementRef.current))
                } else {
                    setLockedElement(null)
                }
                setThumbFocus(focus)
            }
        }
    }

    const trackWrapperStyle = [
        SnowStyle.component.rangeSlider.trackWrapper,
        {
            width: sliderWidth
        }
    ]

    let thumbX = 0
    if (isDraggingRef.current) {
        thumbX = percent * sliderWidth
    }
    else {
        thumbX = percentRef.current * sliderWidth
    }

    const leftTrackStyle = [
        SnowStyle.component.rangeSlider.leftTrack,
        {
            width: thumbX
        }
    ]

    let thumbStyle = [
        SnowStyle.component.rangeSlider.thumb,
        {
            left: thumbX - SnowStyle.component.rangeSlider.thumb.width / 2
        }
    ]
    if (thumbFocus) {
        thumbStyle.push({
            backgroundColor: 'white'
        })
    }

    const handleLayout = (kind) => {
        return (event) => {
            let widths = { ...layoutsRef.current }
            widths[kind] = event.nativeEvent.layout
            layoutsRef.current = widths
        };
    }

    return (
        <View onLayout={handleLayout('slider')} style={SnowStyle.component.rangeSlider.wrapper}>
            <View {...panRef.current.panHandlers} onLayout={handleLayout('track')} style={trackWrapperStyle}>
                <View onLayout={handleLayout('leftTrack')} style={leftTrackStyle} />
                <View onLayout={handleLayout('rightTrack')} style={SnowStyle.component.rangeSlider.rightTrack} />
                <Pressable
                    {...props}
                    onLayout={handleLayout('thumb')}
                    ref={elementRef}
                    onPress={() => { focusThumb(true) }}
                    onFocus={() => { focusThumb(true) }}
                    style={thumbStyle} />
            </View>
        </View>
    );
}

export default SnowRangeSlider