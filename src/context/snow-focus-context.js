import React from 'react'
import {
    Platform,
    findNodeHandle,
    UIManager
} from 'react-native'
import { useDebouncedCallback } from 'use-debounce'

import { useNavigationContext } from './snow-navigation-context'

import Tree from './tree'
import NeighborMap from './neighbor-map'

const RebuildDebounceMilliseconds = 100

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
        FOCUS_ENABLED,
        registerFocus,
        unregisterFocus,
        focusedPath,
        setFocusStart
    } = React.useContext(FocusContext)

    const focusRef = React.useRef(null)

    let xx = props.xx ?? 0
    let yy = props.yy ?? 0
    let parentPath = props.parentPath || null
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
            focusPath,
            focusRef,
            focusStart,
            xx,
            yy,
            onPress: actionPress,
            onLongPress: actionLongPress
        })
        if (focusStart) {
            console.log({ focusStart, focusPath })
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
        return React.cloneElement(child, {
            ...tvRemoteProps,
            ...actions,
            isFocused,
            focusPath,
            ref: focusRef,
            testID: focusPath
        })
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
    const { currentRoute, navPush } = useNavigationContext()

    const focusedPath = currentRoute?.routeParams?.focusedPath
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
        }
        registryRef.current.debug()
    }, RebuildDebounceMilliseconds))

    const scrollViewRef = React.useRef(null)

    const setScrollViewRef = (ref) => {
        scrollViewRef.current = ref
    }

    const scrollIntoView = React.useCallback((focusPath) => {
        const node = registryRef.current.get(focusPath)
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
        const dest = adjacenciesRef.current?.get(sourceFocusPath)?.get(direction)
        if (dest) {
            navPush({
                params: {
                    ...currentRoute.routeParams,
                    focusedPath: dest.focusPath
                },
                func: false,
                replace: true
            })
            scrollIntoView(dest.focusPath)
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