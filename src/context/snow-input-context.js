import React from 'react';
import { BackHandler, Platform, useTVEventHandler } from 'react-native'

import { prettyLog, getUuid } from '../util'

const InputContext = React.createContext({});

export function useInputContext() {
    let value = React.useContext(InputContext);
    if (!value) {
        throw new Error('useInputContext must be wrapped in a <StyleContextProvider />');
    }
    return value;
}

export function InputContextProvider(props) {
    const DEBUG = props.DEBUG_INPUT

    const [actionListeners, setActionListeners] = React.useState({})
    const actionListenersRef = React.useRef(actionListeners)
    const [backListeners, setBackListeners] = React.useState({})
    const backListenersRef = React.useRef(backListeners)


    const addBackListener = (ownerKey, onListen) => {
        if (typeof ownerKey === 'function') {
            onListen = ownerKey
            ownerKey = getUuid()
        }
        if (DEBUG === 'verbose') {
            prettyLog({ context: 'input', action: 'addBackListener', ownerKey, onListen })
        }
        setBackListeners((prev) => {
            let result = { ...prev, [ownerKey]: onListen }
            backListenersRef.current = result
            return result
        })
        return ownerKey
    }

    const removeBackListener = (ownerKey) => {
        if (DEBUG === 'verbose') {
            prettyLog({ context: 'input', action: 'removeBackListener', ownerKey })
        }
        setBackListeners((prev) => {
            let result = { ...prev }
            delete result[ownerKey]
            backListenersRef.current = result
            return result
        })
    }

    const addActionListener = (ownerKey, onListen) => {
        if (typeof ownerKey === 'object') {
            onListen = ownerKey
            ownerKey = getUuid()
        }
        if (DEBUG === 'verbose') {
            prettyLog({ context: 'input', action: 'addActionListener', ownerKey, onListen })
        }
        setActionListeners((prev) => {
            let result = { ...prev, [ownerKey]: onListen }
            actionListenersRef.current = result
            return result
        })
        return ownerKey
    }

    const removeActionListener = (ownerKey) => {
        if (DEBUG === 'verbose') {
            prettyLog({ context: 'input', action: 'removeActionListener', ownerKey })
        }
        setActionListeners((prev) => {
            let result = { ...prev }
            delete result[ownerKey]
            actionListenersRef.current = result
            return result
        })
    }

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
                        // If any one listener returns true, then block the native Android back event
                        result = true
                    }
                }
                if (DEBUG) {
                    prettyLog({ context: 'input', action: 'androidBack result', result })
                }
                return result
            };

            const backListener = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => {
                backListener.remove()
            }
        }, []);
    }

    // Web browser history back
    if (Platform.OS === 'web') {
        React.useEffect(() => {
            const onPopState = (evt) => {
                // If a listener returns true, then block the web back event
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
                // This prevents back from leaving the app
                window.history.pushState(null, '', window.location.pathname + window.location.search)
            }

            window.addEventListener('popstate', onPopState)
            window.history.pushState(null, '', window.location.pathname + window.location.search)

            return () => window.removeEventListener('popstate', onPopState)
        }, [])
    }

    if (Platform.isTV) {
        const remoteButtonHandler = (remoteEvent) => {
            const kind = remoteEvent.eventType
            // action 0  = start, action 1 = end for longpresses
            const action = remoteEvent.eventKeyAction
            if (DEBUG === 'verbose') {
                prettyLog({ context: 'input', action: 'remoteButtonHandler', kind, remoteAction: action, remoteEvent })
            }
            // TV Remote back button
            if (kind !== 'menu' && kind !== 'back') {
                // TV Remote any other button
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
                        default:
                            break
                    }
                }
            }
            window.addEventListener('keydown', keyboardHandler);
            return () => {
                window.removeEventListener('keydown', keyboardHandler);
            }
        }, [])
    }

    const context = {
        DEBUG_INPUT: DEBUG,
        addBackListener,
        removeBackListener,
        addActionListener,
        removeActionListener
    }
    return (
        <InputContext.Provider style={{ flex: 1 }} value={context}>
            {props.children}
        </InputContext.Provider>
    )
}

export default InputContextProvider