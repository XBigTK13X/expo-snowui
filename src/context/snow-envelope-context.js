import React from 'react'
import { useSyncExternalStore } from 'react'

const EnvelopeStoreContext = React.createContext(null)

export function EnvelopeContextProvider(props) {
    const storeRef = React.useRef(props.initialData || {})
    const listenersRef = React.useRef(new Set())

    const getEnvelope = React.useCallback(() => {
        return storeRef.current
    }, [])

    const updateEnvelope = React.useCallback((patch) => {
        const updates = typeof patch === 'function' ? patch(storeRef.current) : patch
        storeRef.current = { ...storeRef.current, ...updates }
        listenersRef.current.forEach((listener) => {
            listener()
        })
    }, [])

    const resetEnvelope = React.useCallback(() => {
        storeRef.current = {}
        listenersRef.current.forEach((listener) => {
            listener()
        })
    }, [])

    const subscribe = React.useCallback((listener) => {
        listenersRef.current.add(listener)
        return () => {
            listenersRef.current.delete(listener)
        }
    }, [])

    const store = React.useRef({
        getEnvelope,
        updateEnvelope,
        resetEnvelope,
        subscribe
    }).current

    return (
        <EnvelopeStoreContext.Provider value={store}>
            {props.children}
        </EnvelopeStoreContext.Provider>
    )
}

export function useEnvelopeAppContext(props) {
    const store = React.useContext(EnvelopeStoreContext)
    if (!store) {
        throw new Error('useEnvelopeAppContext must be wrapped in an <EnvelopeContextProvider />')
    }

    const envelope = useSyncExternalStore(store.subscribe, store.getEnvelope)

    return React.useMemo(() => ({
        envelope,
        getEnvelope: store.getEnvelope,
        updateEnvelope: store.updateEnvelope,
        resetEnvelope: store.resetEnvelope
    }), [
        envelope,
        store.getEnvelope,
        store.updateEnvelope,
        store.resetEnvelope
    ])
}

export function useEnvelopeContext(selector) {
    const store = React.useContext(EnvelopeStoreContext)
    if (!store) {
        throw new Error('useEnvelopeContext must be wrapped in an <EnvelopeContextProvider />')
    }

    const getSnapshot = React.useCallback(() => {
        return selector ? selector(store.getEnvelope()) : store.getEnvelope()
    }, [store, selector])

    return useSyncExternalStore(store.subscribe, getSnapshot)
}