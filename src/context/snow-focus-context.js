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
        focusedHash,
        focusOn,
        setFocusStart,
        setBoundary,
        moveFocusRight,
        moveFocusUp,
        moveFocusDown,
        moveFocusLeft,
        pressFocused
    } = React.useContext(FocusContext)

    const inheritedParentPath = React.useContext(ParentPathContext)

    const focusRef = React.useRef(null)

    let xx = props?.xx ?? 0
    let yy = props?.yy ?? 0
    let parentPath = props?.parentPath || inheritedParentPath || null
    let focusKey = props?.focusKey || null
    let canFocus = props?.canFocus ?? false
    let focusStart = (props?.focusStart ?? false) && canFocus
    let trapFocusRight = props?.trapFocusRight ?? false
    let trapFocusLeft = props?.trapFocusLeft ?? false
    let boundaryName = props?.boundary ?? null

    let focusPath = `${componentName}-${xx}x-${yy}y`
    if (focusKey) {
        focusPath = `${focusKey}-${focusPath}`
    }
    if (parentPath) {
        focusPath = `${parentPath}${Tree.DELIM}${focusPath}`
    }

    let focusHash = Tree.getPathHash(focusPath)

    let actionPress = props?.onPress
    let actionLongPress = props?.onLongPresss

    React.useEffect(() => {
        registerFocus({
            canFocus,
            focusPath,
            focusHash,
            focusRef,
            focusStart,
            xx,
            yy,
            onPress: actionPress,
            onLongPress: actionLongPress,
            trapFocusLeft,
            trapFocusRight
        })
        if (focusStart) {
            setFocusStart(focusHash)
        }
        if (boundaryName) {
            setBoundary(boundaryName, focusPath)
        }
        return () => {
            unregisterFocus(focusPath)
            if (boundaryName) {
                setBoundary(null)
            }
        }
    }, [])

    const isFocused = focusedHash == focusHash

    React.useEffect(() => {
        if (Platform.OS === 'android' && isFocused && focusRef.current) {
            if (focusRef.current.focus) {
                focusRef.current.focus()
            } else {
                const node = findNodeHandle(focusRef.current)
                if (node) {
                    UIManager.dispatchViewManagerCommand(
                        node,
                        UIManager.getViewManagerConfig('RCTView').Commands.focus,
                        null
                    )
                }
            }
        }
    }, [isFocused])

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
                focusable: true,
                hasTVPreferredFocus: isFocused
            }
        }
        if (!Platform.isTV) {
            if (actionPress) {
                actions.onPress = actionPress
            }
            if (actionLongPress) {
                actions.onLongPress = actionLongPress
            }
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
        focusOn,
        focusRef,
        focusPath,
        focusHash,
        focusWrap,
        isFocused,
        moveFocusRight,
        moveFocusUp,
        moveFocusDown,
        moveFocusLeft,
        pressFocused
    }
}

export const FocusContextProvider = (props) => {
    const FOCUS_ENABLED = props.FOCUS_ENABLED !== false
    const [debug, setDebug] = React.useState(false)
    const { currentRoute, navUpdate, navRemove } = useNavigationContext()
    const focusPathRef = React.useRef(null)
    const boundaryNameRef = React.useRef(null)
    const { addActionListener, removeActionListener } = useInputContext(props)

    const registryRef = React.useRef(new Tree.Tree())
    const adjacenciesRef = React.useRef(new Map())
    const focusedHash = currentRoute?.routeParams?.focusedHash
    const focusedPathRef = React.useRef(null)
    const [focusBoundaryPath, setBoundaryPath] = React.useState(null)

    const setBoundary = (name, path) => {
        if (name) {
            boundaryNameRef.current = name
            setBoundaryPath(path)
            navUpdate({
                boundaryName: name
            })
        }
        else {
            boundaryNameRef.current = null
            setBoundaryPath(null)
            navRemove('boundaryName')
        }
    }

    const focusStartRef = React.useRef(null)
    const setFocusStart = (focusStart) => {
        if (focusPathRef.current !== currentRoute?.routePath || !focusedHash) {
            focusPathRef.current = currentRoute?.routePath
            focusStartRef.current = focusStart
            boundaryNameRef.current = currentRoute?.routeParams?.boundaryName
        }
    }

    const updateAdjacencies = React.useCallback(useDebouncedCallback(() => {
        adjacenciesRef.current = NeighborMap.build(registryRef.current)
        const currentEntry = registryRef.current.findHash(focusedHash)?.value
        if (currentEntry) {
            focusedPathRef.current = currentEntry.focusPath
        }

        if (focusStartRef.current && !currentEntry) {
            const target = focusStartRef.current
            focusStartRef.current = null
            navUpdate({ focusedHash: target })
        }
        if (debug || props.DEBUG_FOCUS_TREE) {
            registryRef.current.debug()
            util.prettyLog({ neighbors: adjacenciesRef.current })
            setDebug(false)
        }

    }, RebuildDebounceMilliseconds))

    const scrollViewRef = React.useRef(null)

    const setScrollViewRef = (ref) => {
        scrollViewRef.current = ref
    }

    const scrollIntoView = React.useCallback((focusPath) => {
        if (Platform.OS === 'web') {
            return
        }
        const node = registryRef.current.find(focusPath)
        const targetRef = node?.value?.focusRef?.current
        const scrollRef = scrollViewRef?.current

        if (targetRef && scrollRef) {
            const nodeTag = findNodeHandle(targetRef)
            const scrollTag = findNodeHandle(scrollRef)

            requestAnimationFrame(() => {
                // We need the scroll container's measurements to know the viewport height
                UIManager.measure(scrollTag, (sx, sy, sWidth, sHeight, sPageX, sPageY) => {
                    UIManager.measureLayout(
                        nodeTag,
                        scrollTag,
                        (err) => console.error("Measure Layout Failed", err),
                        (xx, yy, width, height) => {
                            const lead = 300
                            const viewportHeight = sHeight
                            const bottomThreshold = viewportHeight - 200 // Trigger scroll before hitting bottom

                            // Get current scroll position if possible,
                            // though measureLayout yy is relative to the scroll content start.

                            // Logic: If the element's bottom is beyond our threshold,
                            // scroll so the element sits at the 'lead' distance from top.
                            // But ONLY if yy is large enough that scrolling wouldn't
                            // just jump to the top unnecessarily.

                            if (yy > bottomThreshold) {
                                const scrollTarget = yy - lead

                                scrollRef.scrollTo({
                                    y: Math.max(0, scrollTarget),
                                    animated: true // Set to true for smoother TV transitions
                                })
                            } else if (yy < lead) {
                                // Optional: If moving UP and hitting the top lead
                                scrollRef.scrollTo({
                                    y: 0,
                                    animated: true
                                })
                            }
                        }
                    )
                })
            })
        }
    }, [scrollViewRef])

    const registerFocus = async (payload) => {
        await registryRef.current.insert(payload.focusPath, payload)

        updateAdjacencies()
    }

    const unregisterFocus = async (focusPath) => {
        await registryRef.current.prune(focusPath)
        updateAdjacencies()
    }

    const moveFocus = React.useCallback((direction) => {
        const sourceEntry = registryRef.current.find(focusedPathRef.current)?.value || {}
        if (direction === 'left' && sourceEntry.trapFocusLeft) {
            return
        }
        if (direction === 'right' && sourceEntry.trapFocusRight) {
            return
        }
        const destinationFocusPath = adjacenciesRef.current?.get(focusedPathRef.current)?.get(direction)

        if (focusBoundaryPath && destinationFocusPath) {
            if (!destinationFocusPath.startsWith(focusBoundaryPath)) {
                return;
            }
        }

        if (destinationFocusPath) {
            navUpdate({ focusedHash: registryRef.current.find(destinationFocusPath)?.hash })
            scrollIntoView(destinationFocusPath)
        }
    })

    const focusOn = React.useCallback((target) => {
        navUpdate({ focusedHash: registryRef.current.find(target)?.hash })
    })

    const moveFocusDown = React.useCallback(() => { moveFocus('down') })
    const moveFocusLeft = React.useCallback(() => { moveFocus('left') })
    const moveFocusRight = React.useCallback(() => { moveFocus('right') })
    const moveFocusUp = React.useCallback(() => { moveFocus('up') })
    const pressFocused = React.useCallback(async () => {
        if (!focusedPathRef.current && focusedHash) {
            focusedPathRef.current = registryRef.current.findHash(focusedHash)?.value?.focusPath
        }
        const node = registryRef.current.find(focusedPathRef.current)
        // Focus has been lost, try to find it again
        if (!focusedPathRef.current || !node) {
            let topLeft = await registryRef.current.findTopLeft()
            if (topLeft) {
                focusOn(topLeft)
            }
            return
        }
        if (node?.value?.onPress) {
            node.value.onPress()
        }
    })

    const longPressFocused = React.useCallback(() => {
        const node = registryRef.current.find(focusedPathRef.current)

        if (node?.value?.onLongPress) {
            node.value.onLongPress()
        }
    })

    React.useEffect(() => {
        addActionListener('focus-context', {
            onUp: moveFocusUp,
            onDown: moveFocusDown,
            onRight: moveFocusRight,
            onLeft: moveFocusLeft,
            onPress: pressFocused,
            onLongPress: longPressFocused
        })
        return () => {
            removeActionListener('focus-context')
        }
    }, [])

    React.useEffect(() => {
        const node = registryRef.current.findHash(focusedHash)
        if (node) {
            focusedPathRef.current = node.value.focusPath
        }
    }, [focusedHash])

    const value = React.useMemo(() => ({
        FOCUS_ENABLED,
        focusedHash,
        focusOn,
        longPressFocused,
        moveFocusDown,
        moveFocusLeft,
        moveFocusRight,
        moveFocusUp,
        pressFocused,
        registerFocus,
        unregisterFocus,
        setFocusStart,
        setBoundary,
        setScrollViewRef,
        scrollViewRef
    }), [
        currentRoute.routeParams?.focusedHash,
        currentRoute.routeParams?.focusStart,
        currentRoute.routeParams?.boundary,
        scrollViewRef.current,
        focusStartRef.current,
        focusedPathRef.current
    ])

    return <FocusContext.Provider value={value}>{props.children}</FocusContext.Provider>
}