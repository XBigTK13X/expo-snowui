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
// Focus can get lost if in a tabs element there is only text. Nothing inside the tab should be selectable, but the outer view gets a focusKey

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
    const [focusedKey, setFocusedKey] = React.useState(null)
    const focusedKeyRef = React.useRef(focusedKey)
    const [focusMaps, setFocusMaps] = React.useState([{ layerName: 'app', refs: {}, directions: {} }])
    const focusMapsRef = React.useRef(focusMaps)
    const [remoteCallbacks, setRemoteCallbacks] = React.useState({})
    const remoteCallbacksRef = React.useRef({});

    if (props.DEBUG_FOCUS) {
        DEBUG_FOCUS = props.DEBUG_FOCUS
    }

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
        if (DEBUG_FOCUS === 'verbose') {
            console.log({ action: 'isFocused', elementFocusKey, focusedKey })
        }
        return elementFocusKey && elementFocusKey === focusedKey
    }

    const isFocusedLayer = (layerName) => {
        if (DEBUG_FOCUS === 'verbose') {
            console.log({ action: 'isFocusedLayer', layerName, layerMaps })
        }
        return layerName && focusMaps[focusMaps.length - 1].layerName === layerName
    }

    const pushFocusLayer = (layerName) => {
        if (DEBUG_FOCUS) {
            console.log({ action: 'pushFocusLayer' })
        }
        setFocusMaps((prev) => {
            let result = [...prev]
            result.push({ layerName, refs: {}, directions: {} })
            return result
        })
    }

    const popFocusLayer = () => {
        if (DEBUG_FOCUS) {
            console.log({ action: 'popFocusLayer', focusMaps })
        }
        setFocusMaps((prev) => {
            let result = [...prev]
            result.pop()
            return result
        })
    }

    const clearFocusLayers = () => {
        if (DEBUG_FOCUS) {
            console.log({ action: 'clearFocusMaps' })
        }
        setFocusMaps([{ layerName: 'app', refs: {}, directions: {} }])
        setFocusedKey(null)
    }

    const addFocusMap = (elementRef, elementProps) => {
        const focusKey = elementProps.focusKey
        const refs = {
            [focusKey]: {
                element: elementRef,
                onPress: elementProps.onPress,
                onLongPress: elementProps.onLongPress
            }
        }
        const directions = {
            [focusKey]: {
                'up': elementProps.focusUp,
                'right': elementProps.focusRight,
                'down': elementProps.focusDown,
                'left': elementProps.focusLeft
            }
        }
        if (DEBUG_FOCUS) {
            console.log({ action: 'addFocusMap', elementRef, elementProps, focusKey, refs, directions })
        }
        setFocusMaps((prev) => {
            let result = [...prev]
            result[result.length - 1] = _.merge({}, result[result.length - 1], { refs, directions })
            // If an existing key was re-added, remove transient mappings
            // This is a bandaid that needs proper key reuse handling
            if (result.transient && result.transient[focusKey]) {
                delete result.transient[focusKey]
            }
            return result
        })
    }

    const focusOn = (elementRef, focusKey) => {
        elementRef.current.focus()
        setFocusedKey(focusKey)
    }

    const moveFocus = (direction) => {
        if (Keyboard.isVisible()) {
            return false
        }
        if (DEBUG_FOCUS) {
            console.log({ action: 'moveFocus', direction, focusedKey: focusedKeyRef.current, focusMaps: focusMapsRef.current })
        }
        if (!focusedKeyRef.current || !focusMapsRef.current.length) {
            return false
        }
        let sourceKey = focusedKeyRef.current
        let destinationKey = null
        const focusMap = focusMapsRef.current[focusMapsRef.current.length - 1]
        if (
            !focusMap.directions ||
            !focusMap.directions[sourceKey] ||
            !focusMap.directions[sourceKey][direction] ||
            !focusMap.directions.hasOwnProperty(focusMap.directions[sourceKey][direction])
        ) {
            if (sourceKey.indexOf('-row-') !== -1 && sourceKey.indexOf('-column-') !== -1) {
                sourceKey = sourceKey.split('-row-')[0]
                destinationKey = focusMap.directions[sourceKey][direction]
                const destinationInGrid = destinationKey.indexOf(sourceKey) !== -1
                if (!destinationKey || destinationInGrid) {
                    return false
                }
                if (DEBUG_FOCUS) {
                    console.log({ action: 'gridAdjustment', sourceKey, destinationKey, focusMap })
                }
            } else {
                return false
            }
        }

        if (!destinationKey) {
            destinationKey = focusMap.directions[sourceKey][direction]
        }

        const hasReverseMapping = focusMap.directions[destinationKey] && focusMap.directions[destinationKey][oppositeDirections[direction]]
        const hasTransientMapping = focusMap.transient && focusMap.transient[destinationKey] && focusMap.transient[destinationKey][oppositeDirections[direction]]
        if (!hasReverseMapping || hasTransientMapping) {
            let transient = {
                [destinationKey]: {
                    [oppositeDirections[direction]]: sourceKey
                }
            }
            if (DEBUG_FOCUS) {
                console.log({ action: 'transientMap', transient })
            }
            setFocusMaps((prev) => {
                let result = [...prev]
                let directions = {
                    [destinationKey]: {
                        [oppositeDirections[direction]]: sourceKey
                    }
                }
                result[result.length - 1] = _.merge({}, result[result.length - 1], { directions, transient })
                return result
            })
        }
        focusOn(focusMap.refs[destinationKey].element, destinationKey)
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
        // This is done by the remoteHandler on TV
        if (Platform.isTV) {
            return () => { }
        }
        return () => {
            focusOn(elementRef, focusKey)
            pressFocusedElement(focusKey)
        }
    }

    const focusLongPress = (elementRef, focusKey) => {
        // This is done by the remoteHandler on TV
        if (Platform.isTV) {
            return () => { }
        }
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

    const readFocusProps = (elementProps) => {
        let focusProps = {}
        if (elementProps.focusStart) {
            focusProps.focusStart = elementProps.focusStart
        }
        if (elementProps.focusKey) {
            focusProps.focusKey = elementProps.focusKey
        }
        if (elementProps.focusUp) {
            focusProps.focusUp = elementProps.focusUp
        }
        if (elementProps.focusDown) {
            focusProps.focusDown = elementProps.focusDown
        }
        if (elementProps.focusLeft) {
            focusProps.focusLeft = elementProps.focusLeft
        }
        if (elementProps.focusRight) {
            focusProps.focusRight = elementProps.focusRight
        }
        return focusProps
    }

    const focusContext = {
        DEBUG_FOCUS,
        focusedKey,
        addFocusMap,
        clearFocusLayers,
        focusLongPress,
        focusOn,
        focusPress,
        isFocused,
        isFocusedLayer,
        popFocusLayer,
        pushFocusLayer,
        readFocusProps,
        setRemoteCallbacks
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