import React from 'react';
import { Platform, useTVEventHandler } from 'react-native'
import { SnowSafeArea } from '../component/snow-safe-area'

const FocusContext = React.createContext({});

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

export function FocusContextProvider(props) {
    const [mapKeys, setMapKeys] = React.useState({})
    const [focusedKey, setFocusedKey] = React.useState(null)
    const [focusMaps, setFocusMaps] = React.useState([])
    const [remoteCallbacks, setRemoteCallbacks] = React.useState({})
    const remoteCallbacksRef = React.useRef({});

    React.useEffect(() => {
        remoteCallbacksRef.current = remoteCallbacks
    }, [remoteCallbacks])

    const registerFocusTargets(mapKey, )

    const addFocusMap = (mapKey, refs, directions) => {
        if (!mapKeys[mapKey]) {
            setFocusMaps((prev) => {
                let result = { ...prev }
                result.push({ refs, directions })
                return result
            })
            setMapKeys((prev) => {
                let result = { ...prev }
                result[mapKey] = true
                return result
            })
        }
    }

    const popFocusMap = () {
        setFocusMaps((prev) => {
            let result = { ...prev }
            result.pop()
            return result
        })
    }

    const clearFocusMaps = () => {
        setFocusMaps([])
        setFocusedKey(null)
        setMapKeys({})
    }

    const moveFocus = (direction) => {
        if (!focusedKey || !focusMaps.length) {
            return false
        }
        const focusMap = focusMaps[focusMaps.length - 1]
        if (!focusMap.refs || !focusMap.directions || !focusMap.directions[direction]) {
            return false
        }
        setFocusedKey(focusMap.directions[direction])
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
                callback(kind, action)
            }
        }
        useTVEventHandler(remoteHandler);
    }

    const focusContext = {
        setRemoteCallbacks,
        setFocusedKey,
        addFocusMap,
        popFocusMap,
        clearFocusMaps
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