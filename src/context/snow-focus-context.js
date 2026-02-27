import React from 'react'
import {
    Platform,
    findNodeHandle,
    UIManager
} from 'react-native'
import { useDebouncedCallback } from 'use-debounce'

import util from '../util'
import { useInputContext } from './snow-input-context'
import { useNavigationContext } from './snow-navigation-context'

import Tree from './tree'
import NeighborMap from './neighbor-map'

const RebuildDebounceMilliseconds = 100

// This is a component level context to track parentPath
// without needing to pass it all the way from root to leaf
const ParentPathContext = React.createContext(null);

// This is an app level context to handle everything else
const FocusContext = React.createContext(null)

/*
Coordinates orientation
(0,0)->(X,0)
  |      |
  v      v
(0,Y)->(X,Y)
*/


export const useFocusAppContext = () => {
    return {
        ...React.useContext(FocusContext)
    }
}

export const useFocusContext = (componentName, props) => {
    const {
        registerFocus,
        unregisterFocus,
        focusedPath,
        setFocusStart
    } = React.useContext(FocusContext)

    const inheritedParentPath = React.useContext(ParentPathContext)

    const focusRef = React.useRef(null)

    let xx = props.xx ?? 0
    let yy = props.yy ?? 0
    let parentPath = props.parentPath || inheritedParentPath || null
    let focusKey = props.focusKey || null
    let canFocus = props.canFocus ?? false
    let focusStart = (props.focusStart ?? false) && canFocus

    let focusPath = `${componentName}-${xx}x-${yy}y`
    if (focusKey) {
        focusPath = `${focusKey}-${focusPath}`
    }
    if (parentPath) {
        focusPath = `${parentPath}${Tree.DELIM}${focusPath}`
    }

    let actionPress = props.onPress
    let actionLongPress = props.onLongPresss

    React.useEffect(() => {
        registerFocus({
            canFocus,
            focusPath,
            focusRef,
            focusStart,
            xx,
            yy,
            onPress: actionPress,
            onLongPress: actionLongPress
        })
        if (focusStart) {
            setFocusStart(focusPath)
        }
        return () => {
            unregisterFocus(focusPath)
        }
    }, [])

    const isFocused = focusedPath == focusPath

    const focusWrap = (child) => {
        /*
        If these are omitted, then TV remote doesn't work on first launch
        This is a low level helper for wired components
        Most things outside snowui will not need it
        */
        let actions = {}
        let tvRemoteProps = {}
        if (Platform.OS.isTV && (onPress || onLongPress)) {
            tvRemoteProps = {
                focusable: isFocused,
                hasTVPreferredFocus: isFocused
            }
        }
        if (actionPress) {
            actions.onPress = actionPress
        }
        if (actionLongPress) {
            actions.onLongPress = actionLongPress
        }
        return (
            <ParentPathContext.Provider value={focusPath}>
                {React.cloneElement(child, {
                    ...tvRemoteProps,
                    ...actions,
                    isFocused,
                    focusPath,
                    ref: focusRef,
                    testID: focusPath
                })}
            </ParentPathContext.Provider>
        )
    }

    return {
        focusRef,
        focusPath,
        focusWrap,
        isFocused,
    }
}

export const FocusContextProvider = (props) => {
    const FOCUS_ENABLED = props.FOCUS_ENABLED !== false
    const [debug, setDebug] = React.useState(false)
    const { currentRoute, navPush } = useNavigationContext()
    const { addActionListener, removeActionListener } = useInputContext(props)

    const focusedPath = currentRoute?.routeParams?.focusedPath
    const focusedPathRef = React.useRef(focusedPath)
    const registryRef = React.useRef(new Tree.Tree())
    const adjacenciesRef = React.useRef(new Map())

    const focusStartRef = React.useRef(null)
    const setFocusStart = (focusStart) => {
        focusStartRef.current = focusStart
    }

    const updateAdjacencies = React.useCallback(useDebouncedCallback(() => {
        adjacenciesRef.current = NeighborMap.build(registryRef.current)
        if (focusStartRef?.current) {
            navPush({
                params: {
                    ...currentRoute.routeParams,
                    focusedPath: focusStartRef.current
                },
                func: false,
                replace: true
            })
            focusStartRef.current = null
        }
        if (!debug) {
            registryRef.current.debug()
            util.prettyLog({ neighbors: adjacenciesRef.current })
            setDebug(true)
        }

    }, RebuildDebounceMilliseconds))

    const scrollViewRef = React.useRef(null)

    const setScrollViewRef = (ref) => {
        scrollViewRef.current = ref
    }

    const scrollIntoView = React.useCallback((focusPath) => {
        const node = registryRef.current.find(focusPath)
        if (node?.ref?.current && scrollViewRef?.current) {
            const nodeTag = findNodeHandle(node.ref.current)
            const scrollTag = findNodeHandle(node.parentScrollRef.current)
            UIManager.measureLayout(nodeTag, scrollTag, () => { }, (xx, yy) => {
                scrollViewRef.current.scrollTo({ y: yy, animated: true })
            })
        }
    }, [])

    const registerFocus = async (payload) => {
        await registryRef.current.insert(payload.focusPath, payload)
        updateAdjacencies()
    }

    const unregisterFocus = async (focusPath) => {
        await registryRef.current.prune(focusPath)
        updateAdjacencies()
    }

    const moveFocus = React.useCallback((direction) => {
        const destinationFocusPath = adjacenciesRef.current?.get(focusedPathRef.current)?.get(direction)
        if (destinationFocusPath) {
            navPush({
                params: {
                    ...currentRoute.routeParams,
                    focusedPath: destinationFocusPath
                },
                func: false,
                replace: true
            })
            scrollIntoView(destinationFocusPath)
        }
    })

    const moveFocusDown = React.useCallback(() => { moveFocus('down') })
    const moveFocusLeft = React.useCallback(() => { moveFocus('left') })
    const moveFocusRight = React.useCallback(() => { moveFocus('right') })
    const moveFocusUp = React.useCallback(() => { moveFocus('up') })

    const pressFocused = () => {

    }

    const longPressFocused = () => {

    }


    React.useEffect(() => {
        focusedPathRef.current = focusedPath
    }, [focusedPath])

    React.useEffect(() => {
        addActionListener('focus-context', {
            onUp: moveFocusUp,
            onDown: moveFocusDown,
            onRight: moveFocusRight,
            onLeft: moveFocusLeft
        })
        return () => {
            removeActionListener('focus-context')
        }
    }, [])

    const value = React.useMemo(() => ({
        FOCUS_ENABLED,
        focusedPath,
        longPressFocused,
        moveFocusDown,
        moveFocusLeft,
        moveFocusRight,
        moveFocusUp,
        pressFocused,
        registerFocus,
        unregisterFocus,
        setFocusStart,
        setScrollViewRef,
        scrollViewRef
    }), [currentRoute, scrollViewRef.current, focusStartRef.current])

    return <FocusContext.Provider value={value}>{props.children}</FocusContext.Provider>
}