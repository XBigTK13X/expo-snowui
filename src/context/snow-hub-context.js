import React from 'react'
import { useSyncExternalStore } from 'react'

const HubStoreContext = React.createContext(null)

export function HubContextProvider(props) {
    const hubStateRef = React.useRef(props.initialData || {})
    const hubListenersRef = React.useRef(new Set())
    const hubEventHandlersRef = React.useRef(new Map())

    const getHubState = React.useCallback(() => {
        return hubStateRef.current
    }, [])

    const subscribeHubState = React.useCallback((listener) => {
        hubListenersRef.current.add(listener)
        return () => {
            hubListenersRef.current.delete(listener)
        }
    }, [])

    const onHubEvent = React.useCallback((eventName, handler) => {
        if (!hubEventHandlersRef.current.has(eventName)) {
            hubEventHandlersRef.current.set(eventName, new Set())
        }
        const handlerSet = hubEventHandlersRef.current.get(eventName)
        handlerSet.add(handler)

        return () => {
            handlerSet.delete(handler)
            if (handlerSet.size === 0) {
                hubEventHandlersRef.current.delete(eventName)
            }
        }
    }, [])

    const emitHubEvent = React.useCallback((eventName, payload) => {
        const handlerSet = hubEventHandlersRef.current.get(eventName)
        if (!handlerSet || handlerSet.size === 0) {
            return []
        }

        const hubBridge = {
            emitHubEvent,
            sendHubData,
            getHubState
        }

        const results = []
        handlerSet.forEach((handler) => {
            results.push(handler(payload, hubBridge))
        })
        return results
    }, [getHubState])

    const sendHubData = React.useCallback((patch, eventName) => {
        const previousState = hubStateRef.current
        const updates = typeof patch === 'function' ? patch(previousState) : patch

        if (updates && typeof updates === 'object') {
            hubStateRef.current = { ...previousState, ...updates }
            hubListenersRef.current.forEach((listener) => {
                listener()
            })
        }

        if (eventName) {
            emitHubEvent(eventName, updates)
        }
    }, [emitHubEvent])

    const resetHub = React.useCallback((nextInitialState) => {
        const resolvedState = typeof nextInitialState === 'function'
            ? nextInitialState(hubStateRef.current)
            : nextInitialState

        hubStateRef.current = resolvedState && typeof resolvedState === 'object'
            ? { ...resolvedState }
            : {}

        hubEventHandlersRef.current.clear()
        hubListenersRef.current.forEach((listener) => {
            listener()
        })
    }, [])

    const store = React.useMemo(() => ({
        getHubState,
        subscribeHubState,
        sendHubData,
        emitHubEvent,
        onHubEvent,
        resetHub
    }), [
        getHubState,
        subscribeHubState,
        sendHubData,
        emitHubEvent,
        onHubEvent,
        resetHub
    ])

    return (
        <HubStoreContext.Provider value={store}>
            {props.children}
        </HubStoreContext.Provider>
    )
}

export function useHubContext() {
    const store = React.useContext(HubStoreContext)
    if (!store) {
        throw new Error('useHubContext must be wrapped in a <HubContextProvider />')
    }
    return store
}

export function useHubState(selector) {
    const store = useHubContext()

    const getSelection = React.useCallback(() => {
        const currentState = store.getHubState()
        return typeof selector === 'function' ? selector(currentState) : currentState
    }, [store, selector])

    return useSyncExternalStore(store.subscribeHubState, getSelection)
}

export function useHubEventListener(eventName, handler) {
    const store = useHubContext()
    const savedHandler = React.useRef(handler)

    React.useEffect(() => {
        savedHandler.current = handler
    }, [handler])

    React.useEffect(() => {
        if (!eventName) {
            return
        }

        const handleEvent = (payload, hubBridge) => {
            if (typeof savedHandler.current === 'function') {
                return savedHandler.current(payload, hubBridge)
            }
        }

        return store.onHubEvent(eventName, handleEvent)
    }, [store, eventName])
}