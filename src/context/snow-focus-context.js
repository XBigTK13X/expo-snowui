import React from 'react';
import _ from 'lodash'
import {
    Dimensions,
    findNodeHandle,
    Keyboard,
    Platform,
    UIManager,
    useTVEventHandler,
    View,
} from 'react-native'

import { prettyLog, blankStyle } from '../util'

/*
TODO
Focus can get lost if in a tabs element there is only text.
      Nothing inside the tab should be selectable, but the outer view gets a focusKey

Allow long press directions to continue moving focus

Allow grid to grid movement to maintain the relative positon.
    Imagine a 1x3 grid and then a 1x3 under it.
    When highlighting the second element of the first, a down move should send you to the send element of the next.
    However, grid movement currently always pushes you to the start of the grid

Nested grids generate duplicate keys, breaking navigation.
    assignFocus={false} is a bandaid, but it would be useful to allow nested grids

Hitting the edge of a paged grid snaps up to the pager.
    Maybe add a way to totally block focus in one direction?
    null just means another component can decide to map to you.
*/

const FocusContext = React.createContext({});

export function useFocusContext() {
    const value = React.useContext(FocusContext);
    if (!value) {
        throw new Error('useFocusContext must be wrapped in a <FocusContextProvider />');
    }
    return value;
}

const emptyLayers = () => {
    return [
        {
            layerName: 'app',
            refs: {},
            directions: {}
        }
    ]
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
    const [isReady, setIsReady] = React.useState(false)

    const [focusedKey, setFocusedKey] = React.useState(null)
    const focusedKeyRef = React.useRef(focusedKey)
    const [focusLayers, setFocusLayers] = React.useState(emptyLayers())
    const focusLayersRef = React.useRef(focusLayers)
    const [focusedLayer, setFocusedLayer] = React.useState('app')
    const focusedLayerRef = React.useRef(focusedLayer)
    const [remoteCallbacks, setRemoteCallbacks] = React.useState({})
    const remoteCallbacksRef = React.useRef({});
    const [scrollViewRef, setScrollViewRef] = React.useState(null)

    const DEBUG = props.DEBUG_FOCUS
    let SCROLL_OFFSET = 200
    if (props.focusVerticalOffset) {
        SCROLL_OFFSET = props.focusVersionOffset
    }

    React.useEffect(() => {
        focusedKeyRef.current = focusedKey
    }, [focusedKey])

    React.useEffect(() => {
        focusedLayerRef.current = focusedLayer
    }, [focusedLayer])

    React.useEffect(() => {
        focusLayersRef.current = focusLayers
    }, [focusLayers])

    React.useEffect(() => {
        remoteCallbacksRef.current = remoteCallbacks
    }, [remoteCallbacks])

    // After focusMaps are added by components, decide at the focus layer level what should have the first focus
    React.useEffect(() => {
        let topLayer = focusLayers?.at(-1)
        if (DEBUG === 'verbose') {
            prettyLog({ context: 'focus', action: 'useEffect([focusedKey,focusLayers])', topLayer, focusedKey })
        }
        const shouldFocus = !focusedKey || (!!focusedKey && !topLayer.directions.hasOwnProperty(focusedKey))
        if (shouldFocus && topLayer.focusStartKey && topLayer.focusStartElementRef) {
            setFocusLayers((prev) => {
                let result = [...prev]
                result.at(-1).hasFocusedStart = true
                return result
            })
            focusOn(topLayer.focusStartElementRef, topLayer.focusStartKey)
        }
        setIsReady(true)
    }, [focusedKey, focusLayers])

    const isFocused = (elementFocusKey) => {
        if (DEBUG === 'verbose') {
            prettyLog({ context: 'focus', action: 'isFocused', elementFocusKey, focusedKey })
        }
        return elementFocusKey && elementFocusKey === focusedKeyRef.current
    }

    const isFocusedLayer = (layerName) => {
        if (DEBUG === 'verbose') {
            prettyLog({ context: 'focus', action: 'isFocusedLayer', layerName, focusLayers })
        }
        return layerName && focusLayers.at(-1).layerName === layerName
    }

    const pushFocusLayer = (layerName, layerIsUncloned) => {
        // By default, assume that a new layer will want any elements from old layers
        // This allows a root layout to define the first layer
        // Then each page gets a single layer, which is popped at unmount
        // That way, things like header elements can be referenced for focus by a page
        // If something like a modal is desired, then specify that and do not copy the previous layer
        setFocusLayers((prev) => {
            let result = [...prev]
            if (layerIsUncloned) {
                result.push({ layerName, refs: {}, directions: {}, isUncloned: true })
            }
            else {
                result.push({ layerName, refs: { ...prev.at(-1).refs }, directions: { ...prev.at(-1).directions }, focusedKey })
            }
            if (DEBUG === 'verbose') {
                prettyLog({ context: 'focus', action: 'pushFocusLayer', layerName, prev, result })
            }
            return result
        })
        setFocusedLayer(layerName)
        if (layerIsUncloned) {
            setFocusedKey(null)
        }
    }

    const popFocusLayer = () => {
        setFocusLayers((prev) => {
            let result = [...prev]
            result.pop()
            setFocusedLayer(result.at(-1).layerName)
            setFocusedKey(result.at(-1).focusedKey)
            if (DEBUG) {
                prettyLog({ context: 'focus', action: 'popFocusLayer', prev, result })
            }
            return result
        })
    }

    const useFocusLayer = (name, isUncloned) => {
        React.useLayoutEffect(() => {
            pushFocusLayer(name, isUncloned)
            return () => {
                popFocusLayer()
            }
        }, [])
    }

    // This is only used by low level components to interact with the focus system
    const useFocusWiring = (elementProps) => {
        const { addFocusMap, focusedLayer } = useFocusContext();
        const elementRef = React.useRef(null);

        React.useEffect(() => {
            if (elementRef.current) {
                addFocusMap(elementRef, elementProps);
            }
        }, [
            elementProps.focusStart,
            elementProps.focusKey,
            elementProps.focusDown,
            elementProps.focusUp,
            elementProps.focusRight,
            elementProps.focusLeft,
            focusedLayer,
            elementRef
        ]);

        return elementRef;
    }

    const clearFocusLayers = () => {
        if (DEBUG) {
            prettyLog({ context: 'focus', action: 'clearfocusLayers' })
        }
        setFocusLayers(emptyLayers())
        setFocusedKey(null)
        setFocusedLayer('app')
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
        if (DEBUG === 'verbose') {
            prettyLog({ context: 'focus', action: 'addFocusMap', elementRef, elementProps, focusKey, refs, directions })
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
            if (elementProps.focusStart) {
                focusLayer.focusStartElementRef = elementRef
                focusLayer.focusStartKey = elementProps.focusKey
            }
            result[result.length - 1] = _.merge({}, { ...focusLayer }, { refs, directions })
            return result
        })
    }

    const focusOn = (elementRef, focusKey) => {
        const element = elementRef?.current;
        if (!element) {
            return
        }
        if (DEBUG === 'verbose') {
            prettyLog({ context: 'focus', action: 'focusOn', elementRef, focusKey });
        }

        element.requestTVFocus?.();
        element.focus?.();

        const scroll = scrollViewRef?.current

        if (Platform.OS === 'web') {
            if (element && scroll) {
                const elementBounds = element.getBoundingClientRect();
                const scrollBounds = scroll.getBoundingClientRect();

                if (elementBounds.top < scrollBounds.top + SCROLL_OFFSET) {
                    scroll.scrollTop += elementBounds.top - scrollBounds.top - SCROLL_OFFSET;
                } else if (elementBounds.bottom > scrollBounds.bottom) {
                    scroll.scrollTop += elementBounds.bottom - scrollBounds.bottom + SCROLL_OFFSET;
                }
            }
        } else {
            const node = findNodeHandle(element);

            if (scroll && node) {
                const scrollHandle =
                    typeof scroll.getNativeScrollRef === 'function'
                        ? findNodeHandle(scroll.getNativeScrollRef())
                        : findNodeHandle(scroll);

                if (scrollHandle) {
                    UIManager.measureLayout(
                        node,
                        scrollHandle,
                        (err) => {
                            if (DEBUG === 'verbose') {
                                prettyLog({ context: 'focus', action: 'focusOn', error: 'Measurement error', err });
                            }
                        },
                        (x, y, width, height) => {
                            const viewportHeight = Dimensions.get('window').height;

                            const currentOffsetY = scroll?.scrollProperties?.offset || 0;

                            const top = y;
                            const bottom = y + height;

                            const viewTop = currentOffsetY;
                            const viewBottom = currentOffsetY + viewportHeight;

                            if (top - SCROLL_OFFSET < viewTop) {
                                scroll.scrollTo?.({ y: Math.max(top - SCROLL_OFFSET, 0), animated: false });
                            } else if (bottom > viewBottom) {
                                const target = bottom - viewportHeight + SCROLL_OFFSET;
                                scroll.scrollTo?.({ y: target, animated: false });
                            }
                        }
                    );
                }
            }
        }

        setFocusedKey(focusKey);
        focusedKeyRef.current = focusKey;
    };

    // returning false cancels the requested movement
    const moveFocus = (direction) => {
        if (Keyboard.isVisible()) {
            if (DEBUG) {
                prettyLog({ context: 'focus', action: 'moveFocus FAIL Keyboard is visible' })
            }
            return false
        }
        if (DEBUG) {
            prettyLog({ context: 'focus', action: 'moveFocus', direction, focusedKey: focusedKeyRef.current, focusLayers: focusLayersRef.current })
        }
        if (!focusedKeyRef.current || !focusLayersRef.current.length) {
            if (DEBUG) {
                prettyLog({ context: 'focus', action: 'moveFocus FAIL no element currently focused' })
            }
            return false
        }
        let sourceKey = focusedKeyRef.current
        let destinationKey = null
        const focusLayer = focusLayersRef.current.at(-1)

        const request = focusLayer.directions?.[sourceKey]?.[direction];
        const normalDestination = request && focusLayer.directions.hasOwnProperty(request)
        let isGridCell = false
        if (!normalDestination) {
            isGridCell = (sourceKey.indexOf('-row-') !== -1 && sourceKey.indexOf('-column-') !== -1) || (sourceKey.indexOf('-grid-end') !== -1)
            if (isGridCell) {
                sourceKey = sourceKey.split('-row-')[0]
                // Only ever replace one -grid-end at a time
                // Otherwise, a nested grid will have focus escape a map too early
                sourceKey = sourceKey.replace('-grid-end', '')
                let target = focusLayer.directions?.[sourceKey]?.[direction]
                // The target is defined and isn't a cell in the grid
                if (target && target.indexOf(sourceKey) === -1) {
                    destinationKey = target
                    if (DEBUG) {
                        prettyLog({ context: 'focus', action: 'moveFocus->gridAdjustment', sourceKey, destinationKey, focusLayer })
                    }
                }
            }
        }

        // If the destination wasn't found using edge cases above
        // Use a normal lookup
        if (!destinationKey && !isGridCell && focusLayer.directions[sourceKey]) {
            destinationKey = focusLayer.directions[sourceKey][direction]
            if (DEBUG) {
                prettyLog({ context: 'focus', action: 'moveFocus->normalDestination', sourceKey, destinationKey, focusLayer })
            }
        }


        if (!destinationKey || !focusLayer.refs[destinationKey]) {
            if (DEBUG) {
                prettyLog({ context: 'focus', action: 'moveFocus FAIL no destination found', destinationKey })
            }
            return false
        }

        if (DEBUG) {
            prettyLog({ context: 'focus', action: 'moveFocus SUCCESS', destinationKey })
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

    const focusedElementAction = (focusKey, action) => {
        if (!focusKey) {
            focusKey = focusedKeyRef.current
        }
        const focusMap = focusLayersRef.current.at(-1)
        const shouldNotPress = Keyboard.isVisible() || !(focusMap?.refs?.[focusKey]?.[action])
        if (DEBUG) {
            prettyLog({
                context: 'focus',
                action: 'focusedElementAction',
                kind: action,
                focusKey,
                shouldNotPress,
                focusMap,
                keyboardVisible: Keyboard.isVisible(), [action]: focusMap?.refs?.[focusKey]?.[action]
            })
        }
        if (shouldNotPress) {
            return false
        }
        return focusMap.refs[focusKey][action]()
    }

    const focusAction = (elementRef, focusKey, action) => {
        return () => {
            focusOn(elementRef, focusKey)
            focusedElementAction(focusKey, action)
        }
    }

    const focusPress = (elementRef, focusKey) => {
        return focusAction(elementRef, focusKey, 'onPress')
    }

    const focusLongPress = (elementRef, focusKey) => {
        return focusAction(elementRef, focusKey, 'onLongPress')
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
            if (DEBUG === 'verbose') {
                prettyLog({ context: 'focus', action: 'remoteHandler', kind, action, focusedKey: focusedKeyRef.current })
            }
            switch (kind) {
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

    // If these are omitted, then TV remote doesn't work on first launch
    // This is a low level helper for wired components
    // Most things outside snowui will not need it
    const tvRemoteProps = (elementProps) => {
        if (!Platform.isTV || !elementProps.focusStart) {
            return {}
        }
        return {
            focusable: elementProps.focusStart,
            hasTVPreferredFocus: elementProps.focusStart
        }
    }

    const focusContext = {
        DEBUG,
        focusedKey,
        focusedLayer,
        isFocused,
        isFocusedLayer,
        tvRemoteProps,
        useFocusWiring,
        addFocusMap,
        useFocusLayer,
        popFocusLayer,
        pushFocusLayer,
        clearFocusLayers,
        readFocusProps,
        setRemoteCallbacks,
        focusLongPress,
        focusOn,
        focusPress,
        setScrollViewRef
    }

    if (!isReady) {
        if (DEBUG) {
            prettyLog({ context: 'focus', action: 'render short circuit', focusedLayer })
        }
        return <View style={blankStyle} />
    }

    if (DEBUG === 'verbose') {
        prettyLog({ context: 'focus', action: 'render', focusedKey, focusedLayer })
    }

    return (
        <FocusContext.Provider
            style={{ flex: 1 }}
            value={focusContext}>
            {props.children}
        </FocusContext.Provider>
    );
}

export default FocusContextProvider