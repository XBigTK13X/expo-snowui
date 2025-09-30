import React from 'react';
import _ from 'lodash'
import { Platform, useTVEventHandler, Keyboard, findNodeHandle } from 'react-native'
import { SnowSafeArea } from '../component/snow-safe-area'

let DEBUG_FOCUS = false

/*
TODO

Focus can get lost if in a tabs element there is only text.
      Nothing inside the tab should be selectable, but the outer view gets a focusKey

Allow long press directions to continue moving focus
*/

const FocusContext = React.createContext({});

export function useFocusContext() {
    const value = React.useContext(FocusContext);
    if (!value) {
        throw new Error('useFocusContext must be wrapped in a <FocusContextProvider />');
    }
    return value;
}

function getCircularReplacer() {
    const seen = new WeakSet()
    return (key, value) => {
        if (key.indexOf('__') !== -1 || key === '_viewConfig') {
            // React garbage, discard key
            return '[react node]';
        }
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                // Circular reference found, discard key
                return '[circular reference]';
            }
            seen.add(value);
        }
        return value;
    };
}

const prettyLog = (payload) => {
    if (Platform.OS !== 'web') {
        console.log(JSON.stringify({ ...payload }, getCircularReplacer(), 4))
    } else {
        console.log({ ...payload })
    }
}

/* Relevant props
focusKey
    A unique identifier for the focus context in a given element

focusStart
    The element on the page that begins focused.
    Passing focusStart to multiple elements will not crash, but doesn't make sense.

focusUp,focusRight,focusDown,focusLeft
    A per-element optional prop.
    Setting this to a key tells the provider the relative position of an element.
    Not setting a specific direction tells the provider to ignore keypresses from that element in that direction.
*/
export function FocusContextProvider(props) {
    const [focusedKey, setFocusedKey] = React.useState(null)
    const focusedKeyRef = React.useRef(focusedKey)
    const [focusLayers, setFocusLayers] = React.useState([{ layerName: 'app', refs: {}, directions: {} }])
    const focusLayersRef = React.useRef(focusLayers)
    const [remoteCallbacks, setRemoteCallbacks] = React.useState({})
    const remoteCallbacksRef = React.useRef({});

    if (props.DEBUG_FOCUS) {
        DEBUG_FOCUS = props.DEBUG_FOCUS
    }

    React.useEffect(() => {
        focusedKeyRef.current = focusedKey
    }, [focusedKey])

    React.useEffect(() => {
        focusLayersRef.current = focusLayers
    }, [focusLayers])

    React.useEffect(() => {
        remoteCallbacksRef.current = remoteCallbacks
    }, [remoteCallbacks])

    const isFocused = (elementFocusKey) => {
        if (DEBUG_FOCUS === 'verbose') {
            prettyLog({ action: 'isFocused', elementFocusKey, focusedKey })
        }
        return elementFocusKey && elementFocusKey === focusedKey
    }

    const isFocusedLayer = (layerName) => {
        if (DEBUG_FOCUS === 'verbose') {
            prettyLog({ action: 'isFocusedLayer', layerName, layerMaps })
        }
        return layerName && focusLayers[focusLayers.length - 1].layerName === layerName
    }

    const pushFocusLayer = (layerName) => {
        if (DEBUG_FOCUS) {
            prettyLog({ action: 'pushFocusLayer' })
        }
        setFocusLayers((prev) => {
            let result = [...prev]
            result.push({ layerName, refs: {}, directions: {} })
            return result
        })
    }

    const popFocusLayer = () => {
        if (DEBUG_FOCUS) {
            prettyLog({ action: 'popFocusLayer', focusLayers })
        }
        setFocusLayers((prev) => {
            let result = [...prev]
            result.pop()
            return result
        })
    }

    const clearFocusLayers = () => {
        if (DEBUG_FOCUS) {
            prettyLog({ action: 'clearfocusLayers' })
        }
        setFocusLayers([{ layerName: 'app', refs: {}, directions: {} }])
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
        let focus = {}
        if (elementProps.focusUp) {
            focus['up'] = elementProps.focusUp
        }
        if (elementProps.focusDown) {
            focus['down'] = elementProps.focusDown
        }
        if (elementProps.focusRight) {
            focus['right'] = elementProps.focusRight
        }
        if (elementProps.focusLeft) {
            focus['left'] = elementProps.focusLeft
        }
        const directions = {
            [focusKey]: focus
        }
        if (DEBUG_FOCUS) {
            prettyLog({ action: 'addFocusMap', elementRef, elementProps, focusKey, refs, directions })
        }
        setFocusLayers((prev) => {
            let result = [...prev]
            let focusLayer = result[result.length - 1]
            if (elementProps.focusUp) {
                if (!focusLayer.directions.hasOwnProperty(elementProps.focusUp)) {
                    focusLayer.directions[elementProps.focusUp] = {}
                }
                if (!focusLayer.directions[elementProps.focusUp]['down']) {
                    focusLayer.directions[elementProps.focusUp]['down'] = focusKey
                }
            }
            if (elementProps.focusDown) {
                if (!focusLayer.directions.hasOwnProperty(elementProps.focusDown)) {
                    focusLayer.directions[elementProps.focusDown] = {}
                }
                if (!focusLayer.directions[elementProps.focusDown]['up']) {
                    focusLayer.directions[elementProps.focusDown]['up'] = focusKey
                }
            }
            if (elementProps.focusLeft) {
                if (!focusLayer.directions.hasOwnProperty(elementProps.focusLeft)) {
                    focusLayer.directions[elementProps.focusLeft] = {}
                }
                if (!focusLayer.directions[elementProps.focusLeft]['right']) {
                    focusLayer.directions[elementProps.focusLeft]['right'] = focusKey
                }
            }
            if (elementProps.focusRight) {
                if (!focusLayer.directions.hasOwnProperty(elementProps.focusRight)) {
                    focusLayer.directions[elementProps.focusRight] = {}
                }
                if (!focusLayer.directions[elementProps.focusRight]['left']) {
                    focusLayer.directions[elementProps.focusRight]['left'] = focusKey
                }
            }
            result[result.length - 1] = _.merge({}, { ...focusLayer }, { refs, directions })
            return result
        })
    }

    const focusOn = (elementRef, focusKey) => {
        elementRef.current.focus()
        setFocusedKey(focusKey)
    }

    // returning false cancels the requested movement
    const moveFocus = (direction) => {
        if (Keyboard.isVisible()) {
            if (DEBUG_FOCUS) {
                prettyLog({ action: 'moveFocus FAIL Keyboard is visible' })
            }
            return false
        }
        if (DEBUG_FOCUS) {
            prettyLog({ action: 'moveFocus', direction, focusedKey: focusedKeyRef.current, focusLayers: focusLayersRef.current })
        }
        if (!focusedKeyRef.current || !focusLayersRef.current.length) {
            if (DEBUG_FOCUS) {
                prettyLog({ action: 'moveFocus FAIL no element currently focused' })
            }
            return false
        }
        let sourceKey = focusedKeyRef.current
        let destinationKey = null
        const focusLayer = focusLayersRef.current[focusLayersRef.current.length - 1]

        const normalDestination = focusLayer.directions &&
            focusLayer.directions[sourceKey] &&
            focusLayer.directions[sourceKey][direction] &&
            focusLayer.directions.hasOwnProperty(focusLayer.directions[sourceKey][direction])
        let isGridCell = false
        if (!normalDestination) {
            isGridCell = sourceKey.indexOf('-row-') !== -1 && sourceKey.indexOf('-column-') !== -1
            if (isGridCell) {
                sourceKey = sourceKey.split('-row-')[0]
                let target = focusLayer.directions[sourceKey][direction]
                // The target is defined and isn't a cell in the grid
                if (target && target.indexOf(sourceKey) === -1) {
                    destinationKey = target
                    if (DEBUG_FOCUS) {
                        prettyLog({ action: 'moveFocus->gridAdjustment', sourceKey, destinationKey, focusLayer })
                    }
                }
            }
        }

        // If the destination wasn't found using edge cases above
        // Use a normal lookup
        if (!destinationKey && !isGridCell) {
            destinationKey = focusLayer.directions[sourceKey][direction]
            if (DEBUG_FOCUS) {
                prettyLog({ action: 'moveFocus->normalDestination', sourceKey, destinationKey, focusLayer })
            }
        }


        if (!destinationKey || !focusLayer.refs[destinationKey]) {
            if (DEBUG_FOCUS) {
                prettyLog({ action: 'moveFocus FAIL no destination found', destinationKey })
            }
            return false
        }

        if (DEBUG_FOCUS) {
            prettyLog({ action: 'moveFocus SUCCESS', destinationKey })
        }
        focusOn(focusLayer.refs[destinationKey].element, destinationKey)
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
        const focusMap = focusLayersRef.current[focusLayersRef.current.length - 1]
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
        const focusMap = focusLayersRef.current[focusLayersRef.current.length - 1]
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
        popFocusLayer,
        pushFocusLayer,
        clearFocusLayers,
        isFocused,
        isFocusedLayer,
        readFocusProps,
        setRemoteCallbacks,
        focusLongPress,
        focusOn,
        focusPress
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