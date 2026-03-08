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

/*
Coordinates orientation
(0,0)->(X,0)
  |      |
  v      v
(0,Y)->(X,Y)
*/

const ParentPathContext = React.createContext(null)
const FocusContext = React.createContext(null)

export const useFocusAppContext = () => {
    return { ...React.useContext(FocusContext) }
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
        pressFocused,
        updateFocus
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
    if (focusKey) focusPath = `${focusKey}-${focusPath}`
    if (parentPath) focusPath = `${parentPath}${Tree.DELIM}${focusPath}`

    let focusHash = Tree.getPathHash(focusPath)
    let actionPress = props?.onPress
    let actionLongPress = props?.onLongPress

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
        if (focusStart) setFocusStart(focusHash)
        if (boundaryName) setBoundary(boundaryName, focusPath)
        return () => {
            unregisterFocus(focusPath)
            if (boundaryName) setBoundary(null)
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

    React.useEffect(() => {
        updateFocus(focusPath, {
            onPress: actionPress,
            onLongPress: actionLongPress
        })
    })

    const focusWrap = (child) => {
        let tvRemoteProps = {}
        let actions = {}
        if (Platform.isTV && (actionPress || actionLongPress)) {
            tvRemoteProps = {
                focusable: true,
                hasTVPreferredFocus: isFocused
            }
        }
        if (!Platform.isTV) {
            if (actionPress) actions.onPress = actionPress
            if (actionLongPress) actions.onLongPress = actionLongPress
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
    const { addActionListener, removeActionListener } = useInputContext(props)
    const actionsRef = React.useRef({})

    const registryRef = React.useRef(new Tree.Tree())
    const adjacenciesRef = React.useRef(new Map())
    const focusedHash = currentRoute?.routeParams?.focusedHash
    const focusedHashRef = React.useRef(null)
    focusedHashRef.current = focusedHash
    const focusedPathRef = React.useRef(null)
    const focusStartRef = React.useRef(null)
    const focusRouteRef = React.useRef(null)
    const boundaryNameRef = React.useRef(null)
    const scrollViewRef = React.useRef(null)
    const [focusBoundaryPath, setBoundaryPath] = React.useState(null)

    const setBoundary = (name, path) => {
        if (name) {
            boundaryNameRef.current = name
            setBoundaryPath(path)
            navUpdate({ boundaryName: name })
        } else {
            boundaryNameRef.current = null
            setBoundaryPath(null)
            navRemove('boundaryName')
        }
    }

    const setFocusStart = (focusStart) => {
        const isNewRoute = focusRouteRef.current !== currentRoute?.routePath
        if (isNewRoute || !focusedHash) {
            focusRouteRef.current = currentRoute?.routePath
            focusStartRef.current = focusStart
            boundaryNameRef.current = currentRoute?.routeParams?.boundaryName
        }
    }

    const updateAdjacencies = useDebouncedCallback(() => {
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
    }, RebuildDebounceMilliseconds)

    const setScrollViewRef = (ref) => {
        scrollViewRef.current = ref
    }

    const scrollIntoView = (focusPath) => {
        if (Platform.OS === 'web') return
        const node = registryRef.current.find(focusPath)
        const targetRef = node?.value?.focusRef?.current
        const scrollRef = scrollViewRef?.current
        if (!targetRef || !scrollRef) return

        const nodeTag = findNodeHandle(targetRef)
        const scrollTag = findNodeHandle(scrollRef)

        requestAnimationFrame(() => {
            UIManager.measure(scrollTag, (sx, sy, sWidth, sHeight, sPageX, sPageY) => {
                UIManager.measureLayout(
                    nodeTag,
                    scrollTag,
                    (err) => console.error('Measure Layout Failed', err),
                    (xx, yy, width, height) => {
                        const lead = 300
                        const bottomThreshold = sHeight - 200
                        if (yy > bottomThreshold) {
                            scrollRef.scrollTo({ y: Math.max(0, yy - lead), animated: true })
                        } else if (yy < lead) {
                            scrollRef.scrollTo({ y: 0, animated: true })
                        }
                    }
                )
            })
        })
    }

    const registerFocus = async (payload) => {
        await registryRef.current.insert(payload.focusPath, payload)
        if (payload.focusStart && focusStartRef.current && !registryRef.current.findHash(focusedHashRef.current)) {
            const target = focusStartRef.current
            focusStartRef.current = null
            navUpdate({ focusedHash: target })
        }
        updateAdjacencies()
    }

    const unregisterFocus = async (focusPath) => {
        await registryRef.current.prune(focusPath)
        updateAdjacencies()
    }

    const moveFocus = (direction) => {
        const sourceEntry = registryRef.current.find(focusedPathRef.current)?.value || {}
        if (direction === 'left' && sourceEntry.trapFocusLeft) return
        if (direction === 'right' && sourceEntry.trapFocusRight) return

        const destinationFocusPath = adjacenciesRef.current?.get(focusedPathRef.current)?.get(direction)
        if (!destinationFocusPath) return

        if (focusBoundaryPath && !destinationFocusPath.startsWith(focusBoundaryPath)) return

        navUpdate({ focusedHash: registryRef.current.find(destinationFocusPath)?.hash })
        scrollIntoView(destinationFocusPath)
    }

    const focusOn = (target) => {
        navUpdate({ focusedHash: registryRef.current.find(target)?.hash })
    }

    const moveFocusDown = () => moveFocus('down')
    const moveFocusLeft = () => moveFocus('left')
    const moveFocusRight = () => moveFocus('right')
    const moveFocusUp = () => moveFocus('up')

    const getFocusedNode = () => {
        return registryRef.current.findHash(focusedHashRef.current)
            || registryRef.current.find(focusedPathRef.current)
    }

    const pressFocused = async () => {
        const targetNode = getFocusedNode()
        if (targetNode) focusedPathRef.current = targetNode.value.focusPath
        if (targetNode?.value?.onPress) {
            targetNode.value.onPress()
        } else {
            const topLeft = await registryRef.current.findTopLeft()
            if (topLeft) focusOn(topLeft)
        }
    }

    const longPressFocused = async () => {
        const targetNode = getFocusedNode()
        if (targetNode) focusedPathRef.current = targetNode.value.focusPath
        if (targetNode?.value?.onLongPress) {
            targetNode.value.onLongPress()
        } else {
            const topLeft = await registryRef.current.findTopLeft()
            if (topLeft) focusOn(topLeft)
        }
    }

    const updateFocus = (focusPath, payload) => {
        const node = registryRef.current.find(focusPath)
        if (node) node.value = { ...node.value, ...payload }
    }

    actionsRef.current = {
        onUp: moveFocusUp,
        onDown: moveFocusDown,
        onRight: moveFocusRight,
        onLeft: moveFocusLeft,
        onPress: pressFocused,
        onLongPress: longPressFocused
    }

    React.useEffect(() => {
        const executeAction = (key) => (...args) => actionsRef.current[key]?.(...args)

        addActionListener('focus-context', {
            onUp: executeAction('onUp'),
            onDown: executeAction('onDown'),
            onRight: executeAction('onRight'),
            onLeft: executeAction('onLeft'),
            onPress: executeAction('onPress'),
            onLongPress: executeAction('onLongPress')
        })

        return () => removeActionListener('focus-context')
    }, [])

    React.useEffect(() => {
        const node = registryRef.current.findHash(focusedHash)
        if (node) focusedPathRef.current = node.value.focusPath
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
        scrollViewRef,
        updateFocus
    }), [focusedHash, focusedPathRef.current, focusBoundaryPath])

    return <FocusContext.Provider value={value}>{props.children}</FocusContext.Provider>
}