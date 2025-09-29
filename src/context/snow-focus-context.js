import React from 'react';
import _ from 'lodash'
import { Platform, useTVEventHandler, Keyboard } from 'react-native'
import { SnowSafeArea } from '../component/snow-safe-area'

const FocusContext = React.createContext({});

let DEBUG_FOCUS = false

export const noFocusProps = Platform.isTV ? {
    focusable: false,
    importantForAccessibility: "no",
    accessible: false,
    pointerEvents: "none",
    collapsable: false,
    focusable: false,
    clickable: false
} : {}

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
        const refs = { mapKey: elementRef }
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
        setFocusedKey(focusMap.directions[focusedKeyRef.current][direction])
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

    if (Platform.isTV) {
        const remoteHandler = (remoteEvent) => {
            console.log({ remoteEvent })
            const callbacks = remoteCallbacksRef.current
            for (const [_, callback] of Object.entries(callbacks)) {
                if (callback == null) {
                    continue
                }
                // action 0  = start, action 1 = end for longpresses
                const kind = remoteEvent.eventType
                const action = remoteEvent.eventKeyAction
                if (kind === 'up') {
                    moveFocusUp()
                }
                if (kind === 'down') {
                    moveFocusDown()
                }
                if (kind === 'left') {
                    moveFocusLeft()
                }
                if (kind === 'right') {
                    moveFocusRight()
                }
                callback(kind, action)
            }

        }
        useTVEventHandler(remoteHandler);
    }
    if (Platform.OS === 'web') {
        React.useEffect(() => {
            const focusKeyboardHandler = (event) => {
                switch (event.key) {
                    case 'ArrowUp':
                        moveFocusUp()
                        break;
                    case 'ArrowDown':
                        moveFocusDown()
                        break;
                    case 'ArrowLeft':
                        moveFocusLeft()
                        break;
                    case 'ArrowRight':
                        moveFocusRight()
                        break;
                    default:
                        break;
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
        setFocusedKey,
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