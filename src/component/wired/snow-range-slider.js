import React from "react";
import {
    PanResponder,
    Platform,
    Pressable,
    View
} from "react-native";
import { useDebouncedCallback } from 'use-debounce'
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
    const { setRemoteCallbacks, useFocusWiring, isFocused } = useFocusContext()
    const isDraggingRef = React.useRef(false)
    const [percent, setPercent] = React.useState(0)
    const percentRef = React.useRef(percent)
    const [applyStepInterval, setApplyStepInterval] = React.useState(null)
    const elementRef = useFocusWiring(props)

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

    if (Platform.isTV) {
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
        }, [])
    }

    if (Platform.OS === 'web') {
        React.useEffect(() => {
            const rangeSliderKeyboardHandler = (event) => {
                switch (event.key) {
                    case 'ArrowLeft':
                        applyStep(-step)
                        break
                    case 'ArrowRight':
                        applyStep(step)
                        break
                    default:
                        break
                }
            };
            window.addEventListener('keydown', rangeSliderKeyboardHandler);
            return () => {
                window.removeEventListener('keydown', rangeSliderKeyboardHandler);
            };
        }, []);
    }

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
        if (isFocused(props.focusKey)) {
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
        }
    }

    const handleLayout = (kind) => {
        return (event) => {
            let widths = { ...layoutsRef.current }
            widths[kind] = event.nativeEvent.layout
            layoutsRef.current = widths
        };
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
    if (isFocused(props.focusKey)) {
        thumbStyle.push({
            backgroundColor: SnowStyle.color.hover
        })
    }

    return (
        <View onLayout={handleLayout('slider')} style={SnowStyle.component.rangeSlider.wrapper}>
            <View {...panRef.current.panHandlers} onLayout={handleLayout('track')} style={trackWrapperStyle}>
                <View onLayout={handleLayout('leftTrack')} style={leftTrackStyle} />
                <View onLayout={handleLayout('rightTrack')} style={SnowStyle.component.rangeSlider.rightTrack} />
                <Pressable
                    ref={elementRef}
                    style={thumbStyle}
                    onLayout={handleLayout('thumb')}
                    focusStart={props.focusStart}
                    focusKey={props.focusKey}
                    focusUp={props.focusUp}
                    focusDown={props.focusDown}
                />
            </View>
        </View>
    );
}

SnowRangeSliderW.isSnowFocusWired = true

export const SnowRangeSlider = SnowRangeSliderW

export default SnowRangeSlider