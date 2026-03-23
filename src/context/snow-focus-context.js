import React from 'react'
import {
    Platform,
    findNodeHandle,
    UIManager
} from 'react-native'
import { useDebouncedCallback } from 'use-debounce'

import util, { prettyLog } from '../util'
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
        updateFocus,
        scrollViewRef,
        setScrollViewHeight
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
                    focusable: canFocus,
                    accessible: canFocus,
                    isFocused,
                    focusPath,
                    ref: focusRef,
                    testID: focusPath,
                    onLayout: (event) => {
                        const scrollNode = scrollViewRef.current;
                        if (focusRef.current && scrollNode) {
                            requestAnimationFrame(() => {
                                if (!focusRef.current) return;

                                if (Platform.OS === 'android') {
                                    try {
                                        const node = findNodeHandle(focusRef.current);
                                        const scrollTag = findNodeHandle(scrollNode);

                                        if (node && scrollTag) {
                                            UIManager.measureLayout(
                                                node,
                                                scrollTag,
                                                () => { },
                                                (xx, yy, width, height) => {
                                                    updateFocus(focusPath, { staticY: yy, height });
                                                }
                                            );
                                        }
                                    } catch (swallow) {
                                    }
                                }
                            });
                        }
                        if (child.props.onLayout) child.props.onLayout(event);
                    }
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
        pressFocused,
        setScrollViewHeight
    }
}

export const FocusContextProvider = (props) => {
    const FOCUS_ENABLED = props.ENABLE_FOCUS !== false
    const DEBUG = props.DEBUG_FOCUS

    const [firstDebug, setFirstDebug] = React.useState(false)
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
    const scrollOffsetRef = React.useRef(0)
    const scrollViewHeightRef = React.useRef(0)
    const lastFocusedStaticYRef = React.useRef(null)
    const [scrollViewHeight, setScrollViewHeight] = React.useState(0)
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
        if (DEBUG || props.DEBUG_FOCUS_TREE) {
            prettyLog({ context: 'focus', action: 'setFocusStart', focusStart })
        }
        const isNewRoute = focusRouteRef.current !== currentRoute?.routePath
        if (isNewRoute || !focusedHash) {
            focusStartRef.current = focusStart
        }
    }

    const updateAdjacencies = useDebouncedCallback(() => {
        if (DEBUG) {
            prettyLog({ context: 'focus', action: 'updateAdjacencies' })
        }
        adjacenciesRef.current = NeighborMap.build(registryRef.current)
        focusRouteRef.current = currentRoute?.routePath
        const currentEntry = registryRef.current.findHash(focusedHash)?.value
        if (currentEntry) {
            focusedPathRef.current = currentEntry.focusPath
            scrollIntoView(currentEntry.focusPath)
        }
        if (focusStartRef.current && !currentEntry) {
            const target = focusStartRef.current
            focusStartRef.current = null
            navUpdate({ focusedHash: target })
        }
        if (firstDebug || props.DEBUG_FOCUS_TREE) {
            registryRef.current.debug()
            util.prettyLog({ neighbors: adjacenciesRef.current })
            setFirstDebug(false)
        }
    }, RebuildDebounceMilliseconds)

    const setScrollViewRef = (ref) => {
        scrollViewRef.current = ref
    }

    const setScrollOffset = (offset) => {
        scrollOffsetRef.current = offset
    }

    const handleSetScrollViewHeight = (h) => {
        scrollViewHeightRef.current = h
        setScrollViewHeight(h)
    }
    const lastScrollYRef = React.useRef(0)

    const scrollIntoView = (focusPath) => {
        const node = registryRef.current.find(focusPath)
        const item = node?.value
        const actualScrollRef = scrollViewRef.current

        if (item?.staticY == null || !actualScrollRef || !scrollViewHeightRef.current) return

        const currentOffset = scrollOffsetRef.current
        const viewportTop = item.staticY - currentOffset
        const viewportBottom = viewportTop + item.height

        const bottomMargin = scrollViewHeightRef.current * 0.60
        const topMargin = scrollViewHeightRef.current * 0.40

        if (viewportTop < topMargin || viewportBottom > scrollViewHeightRef.current - bottomMargin) {
            const centeredY = item.staticY - (scrollViewHeightRef.current / 2) + (item.height / 2)
            const delta = Math.abs(centeredY - currentOffset)
            if (delta < 10) return
            if (Math.abs(centeredY - lastScrollYRef.current) < 10) return

            lastScrollYRef.current = Math.max(0, centeredY)
            scrollOffsetRef.current = Math.max(0, centeredY)
            actualScrollRef.scrollTo({ y: Math.max(0, centeredY), animated: false })
        }
    }

    const registerFocus = async (payload) => {
        if (DEBUG === 'verbose') {
            prettyLog({ context: 'focus', action: 'registerFocus', payload })
        }
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
        if (DEBUG) {
            prettyLog({ context: 'focus', action: 'moveFocus', direction })
        }
        const sourceEntry = registryRef.current.find(focusedPathRef.current)?.value || {}
        if (direction === 'left' && sourceEntry.trapFocusLeft) return
        if (direction === 'right' && sourceEntry.trapFocusRight) return

        const destinationFocusPath = adjacenciesRef.current?.get(focusedPathRef.current)?.get(direction)
        if (!destinationFocusPath) return

        if (focusBoundaryPath && !destinationFocusPath.startsWith(focusBoundaryPath)) return

        navUpdate({ focusedHash: registryRef.current.find(destinationFocusPath)?.hash })
    }

    const focusOn = (target) => {
        if (DEBUG === 'verbose') {
            prettyLog({ context: 'focus', action: 'focusOn', target })
        }
        const node = registryRef.current.find(target)
        if (node) {
            node.focusRef?.current?.focus()
            navUpdate({ focusedHash: node.hash })
        }
    }

    const moveFocusDown = () => moveFocus('down')
    const moveFocusLeft = () => moveFocus('left')
    const moveFocusRight = () => moveFocus('right')
    const moveFocusUp = () => moveFocus('up')

    const getFocusedNode = () => {
        const node = registryRef.current.findHash(focusedHashRef.current)
            || registryRef.current.find(focusedPathRef.current)
        if (node) focusedPathRef.current = node.value.focusPath
        return node
    }

    const pressFocused = async () => {
        if (DEBUG) {
            prettyLog({ context: 'focus', action: 'pressFocused' })
        }
        const node = getFocusedNode()
        if (node) {
            focusedPathRef.current = node.value.focusPath

            if (node.value.onPress) {
                node.value.onPress()
            }
        } else {
            const topLeft = await registryRef.current.findTopLeft()
            if (topLeft) focusOn(topLeft)
        }
    }

    const longPressFocused = async () => {
        if (DEBUG) {
            prettyLog({ context: 'focus', action: 'longPressFocused' })
        }
        const node = getFocusedNode()
        if (node) {
            focusedPathRef.current = node.value.focusPath

            if (node.value.onLongPress) {
                node.value.onLongPress()
            }
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
        if (!focusedHash) return
        const node = registryRef.current.findHash(focusedHash)
        if (node) {
            focusedPathRef.current = node.value.focusPath
            const staticY = node.value.staticY
            if (staticY === lastFocusedStaticYRef.current) return
            lastFocusedStaticYRef.current = staticY
            scrollIntoView(node.value.focusPath)
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
        setScrollViewHeight: handleSetScrollViewHeight,
        setScrollOffset,
        scrollViewRef,
        updateFocus
    }), [focusedHash, focusedPathRef.current, focusBoundaryPath, scrollViewHeight])

    return <FocusContext.Provider value={value}>{props.children}</FocusContext.Provider>
}