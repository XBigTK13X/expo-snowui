import React from 'react'

import { Platform, useTVEventHandler } from 'react-native'

import { useStyleContext } from './snow-style-context'
import { useFocusContext } from './snow-focus-context'
import { useNavigationContext } from './snow-navigation-context'
import { useLayerContext } from './snow-layer-context'

import util from '../util'

const SnowContext = React.createContext({});

export function useSnowContext() {
    const value = React.useContext(SnowContext);
    if (!value) {
        throw new Error('useSnowContext must be wrapped in a <SnowContextProvider />');
    }
    return value;
}

export function SnowContextProvider(props) {
    const StyleContext = useStyleContext(props)
    const FocusContext = useFocusContext(props)
    const NavigationContext = useNavigationContext(props)
    const InteractionLayerContext = useLayerContext(props)

    const [remoteCallbacks, setRemoteCallbacks] = React.useState({})
    const remoteCallbacksRef = React.useRef(remoteCallbacks)

    if (Platform.isTV) {
        const remoteHandler = (remoteEvent) => {
            const callbacks = remoteCallbacksRef.current
            for (const [key, callback] of Object.entries(callbacks)) {
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

    React.useEffect(() => {
        remoteCallbacksRef.current = remoteCallbacks
    }, [remoteCallbacks])

    const context = React.useMemo(() => ({
        ...StyleContext,
        ...FocusContext,
        ...NavigationContext,
        ...InteractionLayerContext,
        setRemoteCallbacks
    }), [
        StyleContext,
        FocusContext,
        NavigationContext,
        InteractionLayerContext,
        setRemoteCallbacks
    ]);

    return (
        <SnowContext.Provider
            style={util.blankStyle}
            value={context}
        >
            {props.children}
        </SnowContext.Provider>
    )
}

export default SnowContextProvider