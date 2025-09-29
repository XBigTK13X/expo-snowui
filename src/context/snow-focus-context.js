import React from 'react';
import _ from 'lodash'
import { Platform, useTVEventHandler, Keyboard, findNodeHandle } from 'react-native'
import { SnowSafeArea } from '../component/snow-safe-area'

const FocusContext = React.createContext({});

let DEBUG_FOCUS = false

export function useFocusContext() {
    const value = React.useContext(FocusContext);
    if (!value) {
        throw new Error('useFocusContext must be wrapped in a <FocusContextProvider />');
    }
    return value;
}

// TODO

// Handle props.shouldFocus && !Keyboard.isVisible()
// Always disallows focus changing when the Keyboard is showing on Android or TV

/* Relevant props
focusStart
    The element on the page that begins focused.
    Passing focusStart to multiple elements will not crash, but doesn't make sense.

focusUp,focusRight,focusDown,focusLeft
    A per-element optional prop.
    Setting this to a key tells the provider the relative position of an element.
    Not setting a specific direction tells the provider to ignore keypresses from that element in that direction.
*/


const oppositeDirections = {
    'up': 'down',
    'left': 'right',
    'down': 'up',
    'right': 'left'
}

export function FocusContextProvider(props) {
    const [mapKeys, setMapKeys] = React.useState({})
    const mapKeysRef = React.useRef(mapKeys)
    const [focusedKey, setFocusedKey] = React.useState(null)
    const focusedKeyRef = React.useRef(focusedKey)
    const [focusMaps, setFocusMaps] = React.useState([{ refs: {}, directions: {} }])
    const focusMapsRef = React.useRef(focusMaps)
    const [remoteCallbacks, setRemoteCallbacks] = React.useState({})
    const remoteCallbacksRef = React.useRef({});

    if (props.DEBUG_FOCUS) {
        DEBUG_FOCUS = props.DEBUG_FOCUS
    }

    React.useEffect(() => {
        mapKeysRef.current = mapKeys
    }, [mapKeys])

    React.useEffect(() => {
        focusedKeyRef.current = focusedKey
    }, [focusedKey])

    React.useEffect(() => {
        focusMapsRef.current = focusMaps
    }, [focusMaps])

    React.useEffect(() => {
        remoteCallbacksRef.current = remoteCallbacks
    }, [remoteCallbacks])

    const isFocused = (elementFocusKey) => {
        if (DEBUG_FOCUS) {
            console.log({ action: 'isFocused', elementFocusKey, focusedKey })
        }
        return elementFocusKey !== undefined && elementFocusKey === focusedKey
    }

    const addFocusLayer = (mapKey, refs, directions) => {
        if (DEBUG_FOCUS) {
            console.log({ action: 'addFocusLayer', mapKey, refs, directions })
        }
        setFocusMaps((prev) => {
            let result = [...prev]
            result.push({ refs, directions })
            return result
        })
        setMapKeys((prev) => {
            let result = { ...prev }
            result[mapKey] = true
            return result
        })
    }

    const popFocusLayer = () => {
        if (DEBUG_FOCUS) {
            console.log({ action: 'popFocusLayer', focusMaps })
        }
        setFocusMaps((prev) => {
            let result = { ...prev }
            result.pop()
            return result
        })
    }

    const addFocusMap = (elementRef, elementProps) => {
        const mapKey = elementProps.focusKey
        const refs = {
            [mapKey]: {
                element: elementRef,
                onPress: elementProps.onPress,
                onLongPress: elementProps.onLongPress
            }
        }
        const directions = {
            [mapKey]: {
                'up': elementProps.focusUp,
                'right': elementProps.focusRight,
                'down': elementProps.focusDown,
                'left': elementProps.focusLeft
            }
        }
        if (DEBUG_FOCUS) {
            console.log({ action: 'addFocusMap', elementRef, elementProps, mapKey, refs, directions })
        }
        setFocusMaps((prev) => {
            let result = [...prev]
            result[result.length - 1] = _.merge({}, result[result.length - 1], { refs, directions })
            return result
        })
        setMapKeys((prev) => {
            let result = { ...prev }
            result[mapKey] = true
            return result
        })
    }

    const clearFocusMaps = () => {
        if (DEBUG_FOCUS) {
            console.log({ action: 'clearFocusMaps' })
        }
        setFocusMaps([])
        setFocusedKey(null)
        setMapKeys({})
    }

    const focusOn = (elementRef, focusKey) => {
        elementRef.current.focus()
        setFocusedKey(focusKey)
    }

    const moveFocus = (direction) => {
        if (DEBUG_FOCUS) {
            console.log({ action: 'moveFocus', direction, focusedKey: focusedKeyRef.current, focusMaps: focusMapsRef.current })
        }
        if (!focusedKeyRef.current || !focusMapsRef.current.length) {
            return false
        }
        const focusMap = focusMapsRef.current[focusMapsRef.current.length - 1]
        if (
            !focusMap.directions ||
            !focusMap.directions[focusedKeyRef.current] ||
            !focusMap.directions[focusedKeyRef.current][direction] ||
            !focusMap.directions.hasOwnProperty(focusMap.directions[focusedKeyRef.current][direction])
        ) {
            return false
        }
        let nextFocusKey = focusMap.directions[focusedKeyRef.current][direction]
        const hasReverseMapping = focusMap.directions[nextFocusKey][oppositeDirections[direction]]
        const hasTransientMapping = focusMap.transient && focusMap.transient[nextFocusKey] && focusMap.transient[nextFocusKey][oppositeDirections[direction]]
        if (!hasReverseMapping || hasTransientMapping) {
            let transient = {
                [nextFocusKey]: {
                    [oppositeDirections[direction]]: focusedKeyRef.current
                }
            }
            setFocusMaps((prev) => {
                let result = [...prev]
                let directions = {
                    [nextFocusKey]: {
                        [oppositeDirections[direction]]: focusedKeyRef.current
                    }
                }
                result[result.length - 1] = _.merge({}, result[result.length - 1], { directions, transient })
                return result
            })
        }
        focusOn(focusMap.refs[nextFocusKey].element, nextFocusKey)
    }

    const moveFocusRight = () => {
        moveFocus('right')
    }

    const moveFocusLeft = () => {
        moveFocus('left')
    }

    const moveFocusUp = () => {
        moveFocus('up')
    }

    const moveFocusDown = () => {
        moveFocus('down')
    }

    const pressFocusedElement = (focusKey) => {
        if (!focusKey) {
            focusKey = focusedKeyRef.current
        }
        const focusMap = focusMapsRef.current[focusMapsRef.current.length - 1]
        if (Keyboard.isVisible() ||
            !focusMap.refs ||
            !focusMap.refs[focusKey] ||
            !focusMap.refs[focusKey].onPress) {
            return false
        }
        return focusMap.refs[focusKey].onPress()
    }

    const longPressFocusedElement = (focusKey) => {
        if (!focusKey) {
            focusKey = focusedKeyRef.current
        }
        const focusMap = focusMapsRef.current[focusMapsRef.current.length - 1]
        if (Keyboard.isVisible() ||
            !focusMap.refs ||
            !focusMap.refs[focusKey] ||
            !focusMap.refs[focusKey].onLongPress) {
            return false
        }
        return focusMap.refs[focusKey].onLongPress()
    }

    const focusPress = (elementRef, focusKey) => {
        return () => {
            focusOn(elementRef, focusKey)
            pressFocusedElement(focusKey)
        }
    }

    const focusLongPress = (elementRef, focusKey) => {
        return () => {
            focusOn(elementRef, focusKey)
            longPressFocusedElement(focusKey)
        }
    }

    if (Platform.isTV) {
        const remoteHandler = (remoteEvent) => {
            const callbacks = remoteCallbacksRef.current
            // action 0  = start, action 1 = end for longpresses
            const kind = remoteEvent.eventType
            const action = remoteEvent.eventKeyAction
            for (const [_, callback] of Object.entries(callbacks)) {
                if (callback == null) {
                    continue
                }
                callback(kind, action)
            }
            switch (kind) {
                case 'select':
                    pressFocusedElement()
                    break
                case 'longselect':
                    if (action === 1) {
                        longPressFocusedElement()
                    }
                    break
                case 'up':
                    moveFocusUp()
                    break
                case 'down':
                    moveFocusDown()
                    break
                case 'right':
                    moveFocusRight()
                    break
                case 'left':
                    moveFocusLeft()
                    break
                default:
                    break

            }

        }
        useTVEventHandler(remoteHandler);
    }

    if (Platform.OS === 'web') {
        React.useEffect(() => {
            const focusKeyboardHandler = (event) => {
                switch (event.key) {
                    case 'Enter':
                        if (event.code === 'NumpadEnter') {
                            longPressFocusedElement()
                        }
                        else {
                            pressFocusedElement()
                        }
                        break
                    case 'ArrowUp':
                        moveFocusUp()
                        break
                    case 'ArrowDown':
                        moveFocusDown()
                        break
                    case 'ArrowLeft':
                        moveFocusLeft()
                        break
                    case 'ArrowRight':
                        moveFocusRight()
                        break
                    default:
                        break
                }
            };
            window.addEventListener('keydown', focusKeyboardHandler);
            return () => {
                window.removeEventListener('keydown', focusKeyboardHandler);
            };
        }, []);
    }

    const focusContext = {
        focusedKey,
        isFocused,
        setRemoteCallbacks,
        focusOn,
        focusPress,
        focusLongPress,
        addFocusLayer,
        popFocusLayer,
        addFocusMap,
        clearFocusMaps,
        DEBUG_FOCUS
    }

    return (
        <FocusContext.Provider
            style={{ flex: 1 }}
            value={focusContext}>
            <SnowSafeArea style={{ flex: 1 }} >
                {props.children}
            </SnowSafeArea>
        </FocusContext.Provider>
    );
}

export default FocusContextProvider