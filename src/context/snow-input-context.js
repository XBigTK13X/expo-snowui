import React from 'react'
import { BackHandler, Platform, useTVEventHandler, Pressable } from 'react-native'

import { prettyLog, getUuid } from '../util'

const InputContext = React.createContext(null)

export function useInputContext() {
    const value = React.useContext(InputContext)
    if (!value) {
        throw new Error('useInputContext must be wrapped in an <InputContextProvider />')
    }
    return value
}

export function InputContextProvider(props) {
    const DEBUG = props.DEBUG_INPUT

    const [actionListeners, setActionListeners] = React.useState({})
    const actionListenersRef = React.useRef(actionListeners)
    const [backListeners, setBackListeners] = React.useState({})
    const backListenersRef = React.useRef(backListeners)

    const addBackListener = React.useCallback((ownerKey, onListen) => {
        let key = ownerKey
        let listener = onListen
        if (typeof key === 'function') {
            listener = key
            key = getUuid()
        }
        if (DEBUG === 'verbose') {
            prettyLog({ context: 'input', action: 'addBackListener', ownerKey: key, onListen: listener })
        }
        setBackListeners((prev) => {
            const result = { ...prev, [key]: listener }
            backListenersRef.current = result
            return result
        })
        return key
    }, [DEBUG])

    const removeBackListener = React.useCallback((ownerKey) => {
        if (DEBUG === 'verbose') {
            prettyLog({ context: 'input', action: 'removeBackListener', ownerKey })
        }
        setBackListeners((prev) => {
            const result = { ...prev }
            delete result[ownerKey]
            backListenersRef.current = result
            return result
        })
    }, [DEBUG])

    const addActionListener = React.useCallback((ownerKey, onListen) => {
        let key = ownerKey
        let listener = onListen
        if (typeof key === 'object') {
            listener = key
            key = getUuid()
        }
        if (DEBUG === 'verbose') {
            prettyLog({ context: 'input', action: 'addActionListener', ownerKey: key, onListen: listener })
        }
        setActionListeners((prev) => {
            const result = { ...prev, [key]: listener }
            actionListenersRef.current = result
            return result
        })
        return key
    }, [DEBUG])

    const removeActionListener = React.useCallback((ownerKey) => {
        if (DEBUG === 'verbose') {
            prettyLog({ context: 'input', action: 'removeActionListener', ownerKey })
        }
        setActionListeners((prev) => {
            const result = { ...prev }
            delete result[ownerKey]
            actionListenersRef.current = result
            return result
        })
    }, [DEBUG])

    // Android back button press
    if (Platform.OS === 'android') {
        React.useEffect(() => {
            const onBackPress = () => {
                let result = false
                for (const [ownerKey, onListen] of Object.entries(backListenersRef.current)) {
                    if (DEBUG) {
                        prettyLog({ context: 'input', action: 'androidBackListener', ownerKey })
                    }
                    if (onListen()) {
                        result = true
                    }
                }
                if (DEBUG) {
                    prettyLog({ context: 'input', action: 'androidBack result', result })
                }
                return result
            }

            const backListener = BackHandler.addEventListener('hardwareBackPress', onBackPress)
            return () => {
                backListener.remove()
            }
        }, [DEBUG])
    }

    // Web browser history back
    if (Platform.OS === 'web') {
        React.useEffect(() => {
            const onPopState = () => {
                let result = false
                for (const [ownerKey, onListen] of Object.entries(backListenersRef.current)) {
                    if (DEBUG) {
                        prettyLog({ context: 'input', action: 'webBackListener', ownerKey })
                    }
                    if (onListen()) {
                        result = true
                    }
                }
                if (result) {
                    return
                }
                window.history.pushState(null, '', window.location.pathname + window.location.search)
            }

            window.addEventListener('popstate', onPopState)
            window.history.pushState(null, '', window.location.pathname + window.location.search)

            return () => window.removeEventListener('popstate', onPopState)
        }, [DEBUG])
    }

    if (Platform.isTV) {
        const remoteButtonHandler = (remoteEvent) => {
            const kind = remoteEvent.eventType
            const action = remoteEvent.eventKeyAction
            if (DEBUG === 'verbose') {
                prettyLog({ context: 'input', action: 'remoteButtonHandler', kind, remoteAction: action, remoteEvent })
            }
            if (kind !== 'menu' && kind !== 'back') {
                for (const [ownerKey, listener] of Object.entries(actionListenersRef.current)) {
                    if (DEBUG) {
                        prettyLog({ context: 'input', action: 'tvActionListener', ownerKey, kind, action })
                    }
                    switch (kind) {
                        case 'up':
                            listener.onUp?.()
                            break
                        case 'longUp':
                            if (action === 0) {
                                listener?.onLongUpStart?.()
                            } else {
                                listener?.onLongUpEnd?.()
                            }
                            break
                        case 'down':
                            listener.onDown?.()
                            break
                        case 'longDown':
                            if (action === 0) {
                                listener?.onLongDownStart?.()
                            } else {
                                listener?.onLongDownEnd?.()
                            }
                            break
                        case 'right':
                            listener.onRight?.()
                            break
                        case 'longRight':
                            if (action === 0) {
                                listener?.onLongRightStart?.()
                            } else {
                                listener?.onLongRightEnd?.()
                            }
                            break
                        case 'left':
                            listener?.onLeft?.()
                            break
                        case 'longLeft':
                            if (action === 0) {
                                listener?.onLongLeftStart?.()
                            } else {
                                listener?.onLongLeftEnd?.()
                            }
                            break
                        case 'select':
                            listener.onPress?.()
                            break
                        case 'longSelect':
                            if (action === 0) {
                                listener.onLongPress?.()
                            }
                            break
                        default:
                            break
                    }
                }
            }
        }
        useTVEventHandler(remoteButtonHandler)
    }

    if (Platform.OS === 'web') {
        React.useEffect(() => {
            const keyboardHandler = (event) => {
                const pressedKey = event.key
                for (const [ownerKey, listener] of Object.entries(actionListenersRef.current)) {
                    switch (pressedKey) {
                        case 'ArrowUp':
                            if (DEBUG) {
                                prettyLog({ context: 'input', action: 'webActionUp', ownerKey, keyPress: event.key })
                            }
                            listener.onUp?.()
                            break
                        case 'ArrowDown':
                            if (DEBUG) {
                                prettyLog({ context: 'input', action: 'webActionDown', ownerKey, keyPress: event.key })
                            }
                            listener.onDown?.()
                            break
                        case 'ArrowRight':
                            if (DEBUG) {
                                prettyLog({ context: 'input', action: 'webActionRight', ownerKey, keyPress: event.key })
                            }
                            listener.onRight?.()
                            break
                        case 'ArrowLeft':
                            if (DEBUG) {
                                prettyLog({ context: 'input', action: 'webActionLeft', ownerKey, keyPress: event.key })
                            }
                            listener.onLeft?.()
                            break
                        case 'Enter':
                            if (DEBUG) {
                                prettyLog({ context: 'input', action: 'webActionEnter', ownerKey, keyPress: event.key })
                            }
                            listener.onPress?.()
                            break
                        default:
                            break
                    }
                }
            }
            window.addEventListener('keydown', keyboardHandler)
            return () => {
                window.removeEventListener('keydown', keyboardHandler)
            }
        }, [DEBUG])
    }

    const context = React.useMemo(() => ({
        DEBUG_INPUT: DEBUG,
        addBackListener,
        removeBackListener,
        addActionListener,
        removeActionListener
    }), [
        DEBUG,
        addBackListener,
        removeBackListener,
        addActionListener,
        removeActionListener
    ])

    return (
        <InputContext.Provider value={context}>
            <Pressable
                hasTVPreferredFocus={true}
                style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
            />
            {props.children}
        </InputContext.Provider>
    )
}

export default InputContextProvider